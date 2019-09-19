#!/bin/bash

SCRIPT_CALLING_PATH="$0";
SCRIPT_CALLING_DIR=$(dirname "$SCRIPT_CALLING_PATH");
SCRIPT_ABS_DIR=$(realpath "${SCRIPT_CALLING_DIR}");
PROJECT_DIR=$(realpath "${SCRIPT_ABS_DIR}/..");

. "${SCRIPT_ABS_DIR}/development_environment.sh"

cd "${PROJECT_DIR}" || exit 1;
sudo docker build -t "${DOCKER_IMAGE}" . 
