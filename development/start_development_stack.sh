#!/bin/bash
SCRIPT_CALLING_PATH="$0";
SCRIPT_CALLING_DIR=$(dirname "$SCRIPT_CALLING_PATH");
SCRIPT_ABS_DIR=$(realpath "${SCRIPT_CALLING_DIR}");
PROJECT_DIR=$(realpath "${SCRIPT_ABS_DIR}/..");

. "${SCRIPT_ABS_DIR}/include_local_development_environment_data.sh"

RED="\e[31m"
CYAN="\e[36m"
NORM="\e[0m"


function does_network_exist() {
  sudo docker network ls|grep "${DOCKER_NETWORK}";
  return $?;
}

function create_docker_compose_file() {
  echo -e "${CYAN}Creating Docker compose file ${RED}${COMPOSE_FILE}${NORM}";
  cat "${SCRIPT_ABS_DIR}/compose-deployment-DEVELOPMENT-pattern.yml"| \
  sed \
      -e "s/DOCKER_IMAGE/${DOCKER_IMAGE}/g"     \
      -e "s/DOCKER_VOLUME/${DOCKER_VOLUME}/g"   \
      -e "s/DOCKER_NETWORK/${DOCKER_NETWORK}/g" \
      -e "s/DOCKER_DB_PORT/${DOCKER_DB_PORT}/g" \
      -e "s/DOCKER_WEB_PORT/${DOCKER_WEB_PORT}/g" \
      > ${DOCKER_COMPOSE_FILE} || exit 1;
}

function create_network_if_not_exist() {
  if does_network_exist; then
    echo "${DOCKER_NETWORK} exists";
  else
    echo "${DOCKER_NETWORK} does not exist";
    sudo docker network create --driver overlay --attachable ${DOCKER_NETWORK} || exit 1;
  fi
}

function start_stack() {
  sudo docker stack deploy -c ${DOCKER_COMPOSE_FILE} ${DOCKER_DEVELOPMENT_STACK} || exit 1;
}

create_network_if_not_exist;
create_docker_compose_file;
start_stack;
