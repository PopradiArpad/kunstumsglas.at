#!/bin/bash
SCRIPT_CALLING_PATH="$0";
SCRIPT_CALLING_DIR=$(dirname "$SCRIPT_CALLING_PATH");
SCRIPT_ABS_DIR=$(realpath "${SCRIPT_CALLING_DIR}");
PROJECT_DIR=$(realpath "${SCRIPT_ABS_DIR}/..");

. "${SCRIPT_ABS_DIR}/development_environment.sh"

RED="\e[31m"
GREEN="\e[32m"
CYAN="\e[36m"
LGREEN="\e[1;32m"
NORM="\e[0m"

function print_help_and_exit() {
  local EXIT_VAL="$1";

  echo -e "${CYAN}Manage development docker stack defined in ${LGREEN}development_environment.sh:";
  echo -e "${NORM}Commands:";
  echo -e "${GREEN}deploy${NORM} : Deploy development stack.";
  echo -e "${GREEN}rm${NORM}     : Remove development stack.";

  exit $EXIT_VAL;
}


###################################
# Network handling
###################################
function does_network_exist() {
  sudo docker network ls|grep "${DOCKER_NETWORK}" > /dev/null;
  return $?;
}

function create_network_if_not_exist() {
  if ! does_network_exist; then
    echo -e "${CYAN}Creating ${LGREEN}${DOCKER_NETWORK}";

    #Use external network to allow attach external containers for db backup
    sudo docker network create --driver overlay --attachable ${DOCKER_NETWORK} > /dev/null || exit 1;
  fi
}

###################################
# Volume handling
###################################
function does_volume_exist() {
  sudo docker volume ls|grep "${DOCKER_VOLUME}" > /dev/null;
  return $?;
}

function copy_db_dir_to_volume() {
  local LOCAL_DB_PATH="$1";

  sudo docker run --rm --mount type=bind,source="${LOCAL_DB_PATH}",target=/from --mount type=volume,source="${DOCKER_VOLUME}",target=/db  --entrypoint="/bin/sh" alpine -c 'rm -rf /db/*; cp -r /from/* /db' || exit 1;
}

function create_volume_if_not_exists() {
  if ! does_volume_exist; then
    echo -e "${CYAN}Creating and setting up ${LGREEN}${DOCKER_VOLUME}${NORM}";

    local TMP_MONGO_DB="tmp/TMP_MONGO_DB";
    npm run db_management create ${TMP_MONGO_DB} ${DOCKER_SESSION_SECRET} || exit 1;
    copy_db_dir_to_volume "${PROJECT_DIR}/${TMP_MONGO_DB}" || exit 1;
    rm -rf "${TMP_MONGO_DB}" || exit 1;
  fi
}


###################################
# Deploy stack
###################################
function create_docker_compose_file() {
  echo -e "${CYAN}Creating Docker compose file ${LGREEN}${COMPOSE_FILE}";
  cat "${SCRIPT_ABS_DIR}/stack-DEVELOPMENT-pattern.yml"| \
  sed \
      -e "s/DOCKER_IMAGE/${DOCKER_IMAGE}/g"           \
      -e "s/DOCKER_DB_IMAGE/${DOCKER_DB_IMAGE}/g"     \
      -e "s/DOCKER_VOLUME/${DOCKER_VOLUME}/g"         \
      -e "s/DOCKER_NETWORK/${DOCKER_NETWORK}/g"       \
      -e "s/DOCKER_DB_PORT/${DOCKER_DB_PORT}/g"       \
      -e "s/DOCKER_WEB_PORT/${DOCKER_WEB_PORT}/g"     \
      > ${DOCKER_COMPOSE_FILE} || exit 1;
}

function deploy_stack_i() {
  echo -e "${CYAN}Starting ${LGREEN}${DOCKER_DEVELOPMENT_STACK}${NORM} from ${LGREEN}${DOCKER_COMPOSE_FILE}.";
  sudo docker stack deploy -c ${DOCKER_COMPOSE_FILE} ${DOCKER_DEVELOPMENT_STACK} || exit 1;
}

function deploy_stack() {
  create_network_if_not_exist;
  create_volume_if_not_exists;
  # create_docker_compose_file;
  # deploy_stack_i;
}

###################################
# Remove stack
###################################
function rm_stack() {
  sudo docker stack rm ${DOCKER_DEVELOPMENT_STACK} || exit 1;
}

###################################
# Main
###################################
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
