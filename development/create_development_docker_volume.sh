#!/bin/bash

SCRIPT_CALLING_PATH="$0";
SCRIPT_CALLING_DIR=$(dirname "$SCRIPT_CALLING_PATH");
SCRIPT_ABS_DIR=$(realpath "${SCRIPT_CALLING_DIR}");
PROJECT_DIR=$(realpath "${SCRIPT_ABS_DIR}/..");

. "${SCRIPT_ABS_DIR}/development_environment.sh"

function does_volume_exist() {
  sudo docker volume ls|grep "${DOCKER_VOLUME}";
  return $?;
}

function copy_db_dir_to_volume() {
  sudo docker run --mount type=bind,source="${DB_PATH}",target=/from --mount source="${DOCKER_VOLUME}",target=/db  --entrypoint="/bin/sh" alpine -c 'rm -rf /db/*; cp -r /from/* /db' || exit 1;
}

function create_volume_if_not_exists() {
  if does_volume_exist; then
    echo "${DOCKER_VOLUME} exists.";
  else
    sudo docker volume create "${DOCKER_VOLUME}" || exit 1;
  fi
}


create_volume_if_not_exists;
copy_db_dir_to_volume;
