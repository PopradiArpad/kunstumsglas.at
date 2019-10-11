#!/bin/bash
SCRIPT_CALLING_PATH="$0";
SCRIPT_CALLING_DIR=$(dirname "$SCRIPT_CALLING_PATH");
SCRIPT_ABS_DIR=$(realpath "${SCRIPT_CALLING_DIR}");
PROJECT_DIR=$(realpath "${SCRIPT_ABS_DIR}/..");

RED="\e[31m";
GREEN="\e[32m";
CYAN="\e[36m";
LGREEN="\e[1;32m";
YELLOW="\e[33m";
NORM="\e[0m";

G_STACK_PATH_ABS="${PROJECT_DIR}/tmp/stack.yml";
G_SSH_FORWARD_CMD="";

function print_help_and_exit() {
  echo;
  echo -e "${CYAN}Manage deployment docker stack${NORM}";
  echo -e "Commands:";
  echo -e "${GREEN}deploy${NORM} ${LGREEN}path_to_deployment_env_file${NORM} : Build image from a commit, put it on the server, create volume and network if needed then deploy the stack.";

  exit 1;
}

function check_arguments_and_load_deployment_file() {
  local COMMAND="${1}";
  local DEPLOYMENT_ENV_FILE="${2}";

  if [[ ! -f  "${DEPLOYMENT_ENV_FILE}" ]]; then
    echo -e "${RED}No file${NORM} ${LGREEN}${DEPLOYMENT_ENV_FILE}${NORM}";
    print_help_and_exit;
  fi

  . "${DEPLOYMENT_ENV_FILE}";
}


#################################
# Generated names
#################################
function project_name() {
  local BASENAME=$(basename $PR_GIT_URL);

  echo "${BASENAME%.*}";
}

function image_name() {
  echo $(project_name):${PR_BRANCH}-$(git log -n 1 --pretty=format:"%h");
}

# The ssh socket uses the same port 5000 on both side,
# therefore this name can be used on both side.
function image_name_with_registry() {
  echo "localhost:5000/$(image_name)";
}

function stack_name() {
  echo $(project_name)_${STACK_PURPOSE};
}

function network_name() {
  local STACK_NAME="$(stack_name)";
  # docker: name must be valid as a DNS name component
  echo "${STACK_NAME/\./_}_network";
}

function db_volume_name() {
  local STACK_NAME="$(stack_name)";
  echo "${STACK_NAME/\./_}_volume";  # USE _ AND NOT - AS SEPARATOR! THIS NAME WILL BE GENERATED AT DEPLOYMENT
}

function remote_stack_file_abs_dir() {
  echo "${REMOTE_ROOT_OF_STACK_FILES}/$(project_name)/${STACK_PURPOSE}";
}

#################################
# Subcommands of push_image
#################################
function start_registry_on_host() {
  echo -e "${CYAN}Starting registry on ${LGREEN}${REMOTE_HOST}${NORM}";

  ssh -T root@${REMOTE_HOST} <<EOF
    set -euo pipefail;
    docker run --name tmp_registry  -d --rm -p 127.0.0.1:5000:5000 registry;
EOF
}

function stop_registry_on_host() {
  echo -e "${CYAN}Stopping registry on ${LGREEN}${REMOTE_HOST}${NORM}";

  ssh -T root@${REMOTE_HOST} <<EOF
    set -euo pipefail;
    docker container stop tmp_registry;
    echo -e "${YELLOW}${REMOTE_HOST}: Stopped tmp_registry${NORM}";
EOF
}

function start_forward_ssh() {
  echo -e "${CYAN}Starting forward tunneling to ${LGREEN}${REMOTE_HOST}${NORM}";

  # -f. go in background right
  # -N: Do not execute a remote command.
  # -L local forward
  G_SSH_FORWARD_CMD="ssh -o ExitOnForwardFailure=yes -f -N -L 5000:localhost:5000 root@${REMOTE_HOST}";
  ${G_SSH_FORWARD_CMD};
}


function stop_forward_ssh() {
  echo -e "${CYAN}Stopping forward tunneling to ${LGREEN}${REMOTE_HOST}${NORM}";

  local PID=$(pgrep -f "${G_SSH_FORWARD_CMD}");
  kill -9 $PID;
}

function push_image_to_registry() {
  local IMAGE=$(image_name);
  local IMAGE_WITH_REGISTRY=$(image_name_with_registry);

  echo -e "${CYAN}Creating image alias which contains the target registry ${NORM}${LGREEN}${IMAGE_WITH_REGISTRY}${NORM}";
  sudo docker tag "${IMAGE}" "${IMAGE_WITH_REGISTRY}";

  echo -e "${CYAN}Pushing ${NORM}${LGREEN}${IMAGE_WITH_REGISTRY}${NORM}";
  sudo docker push "${IMAGE_WITH_REGISTRY}";

  echo -e "${CYAN}Remove aliased ${NORM}${LGREEN}image ${IMAGE_WITH_REGISTRY}${NORM}";
  sudo docker image rm "${IMAGE_WITH_REGISTRY}";
}

function pull_image_from_registry_on_remote() {
    local IMAGE=$(image_name);
    local IMAGE_WITH_REGISTRY=$(image_name_with_registry);

    echo -e "${CYAN}Pulling ${NORM}${LGREEN}image ${IMAGE}${NORM}${CYAN} on host ${NORM}${LGREEN}${REMOTE_HOST}${NORM}";

    ssh -T root@${REMOTE_HOST} << EOF
      set -euo pipefail;
      docker pull "${IMAGE_WITH_REGISTRY}";
      docker tag "${IMAGE_WITH_REGISTRY}" "${IMAGE}";
      docker image rm "${IMAGE_WITH_REGISTRY}";
EOF
}

#################################
# Subcommands of deploy_stack
#################################
function clone() {
  local PR_NAME=$(project_name);

  echo -e "${CYAN}Shallow cloning${NORM} ${LGREEN}${PR_BRANCH}${NORM} ${CYAN}branch of${NORM} ${LGREEN}${PR_GIT_URL}${NORM}";
  git clone --branch ${PR_BRANCH} --depth 1 ${PR_GIT_URL};
}

function build_image() {
  local IMAGE=$(image_name);

  echo -e "${CYAN}Building ${LGREEN}image ${IMAGE}${NORM}";
  sudo docker build -t "${IMAGE}" .
}

function create_stack_file() {
  echo -e "${CYAN}Creating ${LGREEN}compose file ${G_STACK_PATH_ABS}${NORM}";

  # This is NOT the pattern file of the cloned project!
  cat "${SCRIPT_ABS_DIR}/stack-pattern.yml"| \
  sed \
      -e "s/STACK_IMAGE/$(image_name)/g"             \
      -e "s/STACK_DB_IMAGE/${STACK_DB_IMAGE}/g"      \
      -e "s/STACK_DB_VOLUME/$(db_volume_name)/g"    \
      -e "s/STACK_NETWORK/$(network_name)/g"        \
      -e "s/STACK_DB_PORT/${STACK_DB_PORT}/g"        \
      -e "s/STACK_WEB_PORT/${STACK_WEB_PORT}/g"      \
      > "${G_STACK_PATH_ABS}";

  # echo -e "${LGREEN}##### START stack.yml ######";
  # cat stack.yml
  # echo -e }"##### END stack.yml ######${NORM}";
}

function copy_stack_file() {
  local STACK_FILE_ABS_DIR="$(remote_stack_file_abs_dir)";
  echo -e "${CYAN}Copying stack file to ${LGREEN}${REMOTE_HOST}:${STACK_FILE_ABS_DIR}${NORM}${CYAN} and backing up the current one if exists${NORM}";


  ssh -T root@${REMOTE_HOST} <<EOF
    set -euo pipefail;
    STACK_FILE_ABS_DIR=${STACK_FILE_ABS_DIR};
    STACK_PATH="\$STACK_FILE_ABS_DIR/stack.yml";

    mkdir -p \$STACK_FILE_ABS_DIR;

    if [[ -a "\$STACK_PATH" ]]; then
      mv "\$STACK_PATH" "\$STACK_FILE_ABS_DIR/stack-\$(date +'%Y-%m-%d_%H-%M-%S').yml";
    fi
EOF

  scp "${G_STACK_PATH_ABS}" root@${REMOTE_HOST}:${STACK_FILE_ABS_DIR};
}

function push_image() (
  start_registry_on_host;
  trap stop_registry_on_host EXIT;

  (
    start_forward_ssh;
    trap stop_forward_ssh EXIT;

    push_image_to_registry;
  )
  pull_image_from_registry_on_remote;
)

function create_remote_network_if_not_exist() {
  local NETWORK_NAME=$(network_name);
  echo -e "${CYAN}Creating remote network ${LGREEN}${NETWORK_NAME}${NORM}${CYAN} if not exists${NORM}";

  ssh -T root@${REMOTE_HOST} <<EOF
    set -euo pipefail;

    function does_network_exist() {
      docker network ls|grep "${NETWORK_NAME}" > /dev/null;
      return \$?;
    }

    if ! does_network_exist; then
      docker network create --driver overlay --attachable ${NETWORK_NAME} > /dev/null;
    fi
EOF
}

function create_remote_volume_if_not_exist() (
  echo -e "${CYAN}Creating remote ${LGREEN}volume $(db_volume_name)${NORM}${CYAN} if not exists on ${NORM}${LGREEN}${REMOTE_HOST}${NORM}${NORM}";

  local REMOTE_DB_VOLUME_NAME=$(db_volume_name);
  local VOLUME_EXISTS=$(ssh -T root@${REMOTE_HOST} <<EOF

    function does_volume_exist() {
      sudo docker volume ls|grep "${REMOTE_DB_VOLUME_NAME}" > /dev/null;
      return $?;
    }

    if does_volume_exist; then
      echo "y";
    else
      echo "n";
    fi
EOF
  );

  if [[ $VOLUME_EXISTS = "y" ]]; then
    return 0;
  fi

  function rm_tmp_volume() {
    sudo docker volume rm ${TMP_DB_VOLUME_NAME};
  }

  local TMP_DB_VOLUME_NAME="$(db_volume_name)-tmp-$(date +'%Y-%m-%d_%H-%M-%S')";
  npm run db_management create ${STACK_DB_IMAGE} ${TMP_DB_VOLUME_NAME} ${DB_SESSION_SECRET};
  trap rm_tmp_volume EXIT;

  # https://www.guidodiepen.nl/2016/05/transfer-docker-data-volume-to-another-host/
  sudo docker run --rm --mount source=${TMP_DB_VOLUME_NAME},target="/from" alpine ash -c "cd /from ; tar -cvf - . " | ssh root@${REMOTE_HOST} "docker run --rm -i --mount source=${REMOTE_DB_VOLUME_NAME},target='/to' alpine ash -c 'cd /to ; tar -xpvf - ' ";
)

function close_ports_remote() {
  echo -e "${CYAN}Closing remote ${LGREEN}ports ${STACK_DB_PORT}${NORM} ${CYAN}and ${LGREEN}${STACK_WEB_PORT}${NORM}";

  ssh -T root@${REMOTE_HOST} <<EOF
    iptables -S;
EOF

}

function deploy_remote_stack() {
  local STACK=$(stack_name);
  echo -e "${CYAN}Deploying ${LGREEN}stack ${STACK}${NORM}${CYAN} on ${NORM}${LGREEN}${REMOTE_HOST}${NORM}";

  ssh -T root@${REMOTE_HOST} <<EOF
    set -euo pipefail;

    cd $(remote_stack_file_abs_dir);
    # sudo docker stack deploy -c stack.yml $(stack_name);
EOF
}

#################################
# Command handlers
#################################
function deploy_stack() {
  local BUILD_DIR="${PROJECT_DIR}/tmp/build";

  echo -e "${CYAN}Creating ${LGREEN}workdir ${BUILD_DIR}${NORM}";
  mkdir -p ${BUILD_DIR} && cd ${BUILD_DIR};

  clone;
  cd $(project_name);
  build_image;
  create_stack_file;
  copy_stack_file;
  push_image;
  create_remote_network_if_not_exist;
  create_remote_volume_if_not_exist;
  # close_ports_remote;
  # deploy_remote_stack;

  rm -rf ${BUILD_DIR};
  echo -e "${CYAN}Removed ${LGREEN}workdir ${BUILD_DIR}${NORM}";
}

#################################
# Main
#################################
set -ueo pipefail;
export SHELLOPTS;

check_arguments_and_load_deployment_file $@;

case "$1" in
  deploy)
    deploy_stack;
    ;;
  *)
    echo -e "${RED}Unknown command${NORM} ${LGREEN}${1}${NORM}";
    print_help_and_exit 0;
    ;;
esac
