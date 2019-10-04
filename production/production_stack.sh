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

function clone_and_cd() {
  local PR_NAME=$(project_name ${PR_GIT_URL});

  echo -e "${CYAN}Shallow cloning${NORM} ${LGREEN}${PR_BRANCH}${NORM} ${CYAN}branch of${NORM} ${LGREEN}${PR_GIT_URL}${NORM}";
  git clone -b ${PR_BRANCH} --depth 1 ${PR_GIT_URL};
  cd ${PR_NAME};
}

function build_image() {
  local IMAGE=$(image_name);

  echo -e "${CYAN}Building ${LGREEN}image ${IMAGE}${NORM}";
  sudo docker build -t "${IMAGE}" .
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
  # create_docker_compose_file;
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
