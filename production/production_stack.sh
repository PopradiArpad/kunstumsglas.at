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


function print_help_and_exit() {
  local EXIT_VAL="$1";

  echo -e "${CYAN}Manage deployment docker stack${NORM}";
  echo -e "Commands:";
  echo -e "${GREEN}deploy${NORM} : Build image from a commit, put it on the server, create volume and network if needed then deploy the stack.";
  echo -e "${GREEN}rm${NORM}     : Remove stack from the server.";

  exit $EXIT_VAL;
}


#################################
# Remote deployment handling
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

function create_docker_compose_file() {
  echo -e "${CYAN}Creating ${LGREEN}compose file stack.yml${NORM}";

  local STACK=$(stack_name);
  local STACK_DB_VOLUME="${STACK}_volume";  # USE _ AND NOT - AS SEPARATOR! THIS NAME WILL BE GENERATED AT DEPLOYMENT
  local STACK_NETWORK="${STACK}_network";


  # This is NOT the pattern file of the cloned project!
  cat "${SCRIPT_ABS_DIR}/stack-pattern.yml"| \
  sed \
      -e "s/STACK_IMAGE/$(image_name)/g"             \
      -e "s/STACK_DB_IMAGE/${STACK_DB_IMAGE}/g"      \
      -e "s/STACK_DB_VOLUME/${STACK_DB_VOLUME}/g"    \
      -e "s/STACK_NETWORK/${STACK_NETWORK}/g"        \
      -e "s/STACK_DB_PORT/${STACK_DB_PORT}/g"        \
      -e "s/STACK_WEB_PORT/${STACK_WEB_PORT}/g"      \
      > stack.yml;

  echo -e "${LGREEN}##### START stack.yml ######";
  cat stack.yml
  echo -e }"##### END stack.yml ######${NORM}";
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
  # push_image;
  create_docker_compose_file;
  # push_docker_compose_file;
  # deploy_remote;

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
