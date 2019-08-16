#!/bin/bash
SCRIPT_CALLING_PATH="$0";
SCRIPT_CALLING_DIR=$(dirname "$SCRIPT_CALLING_PATH");
SCRIPT_ABS_DIR=$(realpath "${SCRIPT_CALLING_DIR}");
PROJECT_DIR=$(realpath "${SCRIPT_ABS_DIR}/..");

. "${SCRIPT_ABS_DIR}/include_local_development_environment_data.sh"

RED="\e[31m"
CYAN="\e[36m"
NORM="\e[0m"


function stop_stack() {
  sudo docker stack rm ${DOCKER_DEVELOPMENT_STACK} || exit 1;
}

stop_stack;
