#!/bin/bash
SCRIPT_CALLING_PATH="$0";
SCRIPT_CALLING_DIR=$(dirname "$SCRIPT_CALLING_PATH");
SCRIPT_ABS_DIR=$(realpath "${SCRIPT_CALLING_DIR}");
PROJECT_DIR=$(realpath "${SCRIPT_ABS_DIR}/..");

RED="\e[31m"
GREEN="\e[32m"
CYAN="\e[36m"
LGREEN="\e[1;32m"
NORM="\e[0m"

SSH_FORWARD_CMD="";
STACK_PATH_ABS="${PROJECT_DIR}/tmp/stack.yml";

function print_help_and_exit() {
  local EXIT_VAL="$1";

  echo -e "${CYAN}Manage deployment docker stack${NORM}";
  echo -e "Commands:";
  echo -e "${GREEN}deploy${NORM} : Build image from a commit, put it on the server, create volume and network if needed then deploy the stack.";
  echo -e "${GREEN}rm${NORM}     : Remove stack from the server.";

  exit $EXIT_VAL;
}


#################################
# Names
#################################
function project_name() {
  local BASENAME=$(basename $PR_GIT_URL);

  echo "${BASENAME%.*}";
}

function image_name() {
  echo $(project_name):${PR_BRANCH}-$(git log -n 1 --pretty=format:"%h");
}

function stack_name() {
  echo $(project_name)_${STACK_PURPOSE};
}

function network_name() {
  echo "$(stack_name)_network";
}

function db_volume_name() {
  echo "$(stack_name)_volume";  # USE _ AND NOT - AS SEPARATOR! THIS NAME WILL BE GENERATED AT DEPLOYMENT
}

#################################
# Subcommands of push_image
#################################
function start_registry_on_host() {
  echo -e "${CYAN}Starting registry on ${LGREEN}${REMOTE_HOST}${NORM}";

  ssh root@${REMOTE_HOST} << EOF
    set -euo pipefail;
    # docker run --name tmp_registry  -d --rm -p 127.0.0.1:5000:5000 registry;
EOF
}

function stop_registry_on_host() {
  echo -e "${CYAN}Stopping registry on ${LGREEN}${REMOTE_HOST}${NORM}";

  ssh root@${REMOTE_HOST} << EOF
    set -euo pipefail;
    # docker container stop tmp_registry;
EOF
}

function start_forward_ssh() {
  echo -e "${CYAN}Starting forward tunneling to ${LGREEN}${REMOTE_HOST}${NORM}";

  # -f. go in background right
  # -N: Do not execute a remote command.
  # -L local forward
  SSH_FORWARD_CMD="ssh -o ExitOnForwardFailure=yes -f -N -L 5000:localhost:5000 root@${REMOTE_HOST}";
  ${SSH_FORWARD_CMD};
}


function stop_forward_ssh() {
  echo -e "${CYAN}Stopping forward tunneling to ${LGREEN}${REMOTE_HOST}${NORM}";

  local PID=$(pgrep -f "${SSH_FORWARD_CMD}");
  kill -9 $PID;
}

function push_image_to_registry() {
  local IMAGE=$(image_name);
  local IMAGE_WITH_REGISTRY="localhost:5000/${IMAGE}";

  echo -e "${CYAN}Creating image alias which contains the target registry ${NORM}${LGREEN}${IMAGE_WITH_REGISTRY}${NORM}";
  # sudo docker tag "${IMAGE}" "${IMAGE_WITH_REGISTRY}";

  echo -e "${CYAN}Pushing ${NORM}${LGREEN}${IMAGE_WITH_REGISTRY}${NORM}";
  # sudo docker push "${IMAGE_WITH_REGISTRY}";

  echo -e "${CYAN}Remove aliased ${NORM}${LGREEN}image ${IMAGE_WITH_REGISTRY}${NORM}";
  # sudo docker rm "${IMAGE_WITH_REGISTRY}";
}

#################################
# Subcommands of deploy_stack
#################################
function clone_and_cd() {
  local PR_NAME=$(project_name);

  echo -e "${CYAN}Shallow cloning${NORM} ${LGREEN}${PR_BRANCH}${NORM} ${CYAN}branch of${NORM} ${LGREEN}${PR_GIT_URL}${NORM}";
  git clone --branch ${PR_BRANCH} --depth 1 ${PR_GIT_URL};
  cd ${PR_NAME};
}

function build_image() {
  local IMAGE=$(image_name);

  echo -e "${CYAN}Building ${LGREEN}image ${IMAGE}${NORM}";
  sudo docker build -t "${IMAGE}" .
}

function create_stack_file() {
  echo -e "${CYAN}Creating ${LGREEN}compose file ${STACK_PATH_ABS}${NORM}";

  # This is NOT the pattern file of the cloned project!
  cat "${SCRIPT_ABS_DIR}/stack-pattern.yml"| \
  sed \
      -e "s/STACK_IMAGE/$(image_name)/g"             \
      -e "s/STACK_DB_IMAGE/${STACK_DB_IMAGE}/g"      \
      -e "s/STACK_DB_VOLUME/$(db_volume_name)/g"    \
      -e "s/STACK_NETWORK/$(network_name)/g"        \
      -e "s/STACK_DB_PORT/${STACK_DB_PORT}/g"        \
      -e "s/STACK_WEB_PORT/${STACK_WEB_PORT}/g"      \
      > "${STACK_PATH_ABS}";

  # echo -e "${LGREEN}##### START stack.yml ######";
  # cat stack.yml
  # echo -e }"##### END stack.yml ######${NORM}";
}

function copy_stack_file() {
  echo -e "${CYAN}Copying stack file to ${LGREEN}${REMOTE_HOST}:${REMOTE_ROOT_OF_STACK_FILES}${NORM}${CYAN} and backing up the current one if exists.";

  local STACK_FILE_ABS_DIR="${REMOTE_ROOT_OF_STACK_FILES}/$(project_name)/${STACK_PURPOSE}";

  ssh -T root@${REMOTE_HOST} << EOF
    set -euo pipefail;
    STACK_FILE_ABS_DIR=${STACK_FILE_ABS_DIR};
    STACK_PATH="\$STACK_FILE_ABS_DIR/stack.yml";

    mkdir -p \$STACK_FILE_ABS_DIR;

    if [[ -a "\$STACK_PATH" ]]; then
      mv "\$STACK_PATH" "\$STACK_FILE_ABS_DIR/stack-\$(date +'%Y-%m-%d_%H-%M-%S').yml";
    fi
EOF

  scp "${STACK_PATH_ABS}" root@${REMOTE_HOST}:${STACK_FILE_ABS_DIR};
}

function push_image() {
  start_registry_on_host;
  start_forward_ssh;
  push_image_to_registry;
  stop_forward_ssh;
  stop_registry_on_host;
}

function create_remote_network_if_not_exist() {
  echo "not implemented";
}

function create_volume_network_if_not_exist() {
  echo "not implemented";
}

function deploy_remote_stack() {
  echo "not implemented";
}

#################################
# Command handlers
#################################
function deploy_stack() {
  local BUILD_DIR="${PROJECT_DIR}/tmp/build";

  echo -e "${CYAN}Creating ${LGREEN}workdir ${BUILD_DIR}${NORM}";
  mkdir -p ${BUILD_DIR} && cd ${BUILD_DIR};

  clone_and_cd;
  build_image;
  create_stack_file;
  copy_stack_file;
  # push_image;
  # create_remote_network_if_not_exist;
  # create_volume_network_if_not_exist;
  # deploy_remote_stack;

  rm -rf ${BUILD_DIR};
  echo -e "${CYAN}Removed ${LGREEN}workdir ${BUILD_DIR}${NORM}";
}

function rm_stack() {
  echo "Not implemented";
}

#################################
# Main
#################################
set -ueo pipefail;

. "${SCRIPT_ABS_DIR}/production_environment.sh";

if [[ $# -eq 0 ]]; then
  print_help_and_exit 0;
fi

case "$1" in
  deploy)
    deploy_stack;
    ;;
  rm)
    rm_stack;
    ;;
  *)
    print_help_and_exit 0;
    ;;
esac
