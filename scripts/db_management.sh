#!/bin/bash
SCRIPT_CALLING_PATH="$0";
SCRIPT_CALLING_DIR=$(dirname "$SCRIPT_CALLING_PATH");
SCRIPT_ABS_DIR=$(realpath "${SCRIPT_CALLING_DIR}");
PROJECT_DIR=$(realpath "${SCRIPT_ABS_DIR}/..");

RED="\e[31m"
GREEN="\e[32m"
CYAN="\e[36m"
NORM="\e[0m"


function print_help_and_exit() {
  local EXIT_VAL="$1";

  echo -e "${NORM}Commands:";
  echo -e "${GREEN}create ${CYAN}path_to_db session_secret${NORM}                            : Create a new KUG db at path_to_db with a session secret to sign the session id cookie.";
  echo -e "${GREEN}start_mongod_and_open_mongo_shell ${CYAN}path_to_db${NORM}                : Start the database of path_to_db and open a mongo shell to it.";
  echo -e "${GREEN}start_mongod_and_run_script_in_it ${CYAN}path_to_db path_to_script${NORM} : Start the database of path_to_db and run a js script in it.";

  exit $EXIT_VAL;
}


###################################
# Start/stop mongod
###################################
function start_mongod() {
  local PATH_TO_DB="$1";

  echo -e "${CYAN}Starting mongod${NORM}";
  # remember the PID of mongod to let it kill
  mongod --master --dbpath "$PATH_TO_DB" & echo $! > mongod.pid;

  sleep .5;

  if ! ps `cat mongod.pid`>/dev/null; then
    rm mongod.pid;
    exit 1;
  fi

  echo -e "${GREEN}mongod started${NORM}";
}

function kill_mongod() {
  MONGOPID=`cat mongod.pid`;
  rm mongod.pid;

  if ps $MONGOPID>/dev/null; then
    echo -e "${GREEN}stopping mongod...${NORM}";
    #Never use kill -9 on mongod!
    kill -2 $MONGOPID;
  fi
}


###################################
# Dockerized helpers
###################################
function does_volume_exist() {
  sudo docker volume ls|grep "${DOCKER_VOLUME}" > /dev/null;
  return $?;
}


###################################
# Command handlers
###################################
function create_initial_db() {
  local DOCKER_DB_IMAGE="$1";
  local DOCKER_VOLUME="$2";
  local SESSION_SECRET="$3";

  if does_volume_exist "${DOCKER_VOLUME}"; then
    echo -e "${RED}Volume ${CYAN}${DOCKER_VOLUME}${RED} already exists!";
    print_help_and_exit 1;
  fi

  if [ -z "$SESSION_SECRET" ]; then
    echo -e "${CYAN}session_secret${RED} must be non empty!";
    print_help_and_exit 1;
  fi

    local TMP_DB_INIT="tmp_db_init";

    sudo docker run --name ${TMP_DB_INIT} \
                    -d --rm \
                    --mount type=bind,source="${SCRIPT_ABS_DIR}",target="/scripts" \
                    --mount source="${DOCKER_VOLUME}",target="/data/db" \
                    ${DOCKER_DB_IMAGE} > /dev/null;
    #  /dev/null has no effect. I don't know why
    sudo docker exec -i ${TMP_DB_INIT} '/bin/bash'  << EOF > /dev/null
      set -ue;
      echo '{registeringAllowed:true,secret:"${SESSION_SECRET}"}'             | mongoimport --db test --collection cmsconfigs;
      cat /scripts/initial_collections/initial_translations.json              | mongoimport --db test --collection translations;
      cat /scripts/initial_collections/initial_productgroups.json             | mongoimport --db test --collection productgroups;
      cat /scripts/initial_collections/initial_caches.json                    | mongoimport --db test --collection caches;
      echo '{_id: "mainview", translations:[], productGroups:[], users: []}'  | mongoimport --db test --collection mainviews;
      mongo scripts/setup_initial_mainview.js;
EOF
    sudo docker container stop ${TMP_DB_INIT}  > /dev/null;
}

function start_mongod_and_open_mongo_shell() {
  local PATH_TO_DB="$1";

  start_mongod "$PATH_TO_DB";
  mongo;
  kill_mongod;
  # echo -e "start_mongod_and_open_mongo_shell ${RED}NOT IMPLEMENTED${NORM}";
}

function start_mongod_and_run_script_in_it() {
  local PATH_TO_DB="$1";
  local PATH_TO_SCRIPT="$2";

  start_mongod "$PATH_TO_DB";
  mongo "$PATH_TO_DB" "$PATH_TO_SCRIPT";
  kill_mongod;
}

###################################
# Main
###################################
set -ue;
case "$1" in
  create)
    create_initial_db "$2" "$3" "$4";
    ;;
  start_mongod_and_open_mongo_shell)
    start_mongod_and_open_mongo_shell "$2";
    ;;
  start_mongod_and_run_script_in_it)
    start_mongod_and_run_script_in_it "$2" "$3";
    ;;
  *)
    print_help_and_exit 0;
    ;;
esac
