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
# Command handlers
#################################
function deploy_stack() {
  echo "Not implemented";
}

function rm_stack() {
  echo "Not implemented";
}

#################################
# Main
#################################
# Because of build, etc
cd ${PROJECT_DIR} || exit 1;

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
