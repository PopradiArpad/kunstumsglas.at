#!/bin/bash
SCRIPT_CALLING_PATH="$0";
SCRIPT_CALLING_DIR=$(dirname "$SCRIPT_CALLING_PATH");
SCRIPT_ABS_DIR=$(realpath "${SCRIPT_CALLING_DIR}");
PROJECT_DIR=$(realpath "${SCRIPT_ABS_DIR}/..");

. "${SCRIPT_ABS_DIR}/development_environment.sh"

RED="\e[31m"
CYAN="\e[36m"
NORM="\e[0m"


function start_mongod() {
  echo -e "${CYAN}Starting mongod${NORM}";
  # remember the PID of mongod to let it kill
  mongod --master --dbpath $DB_PATH --port $DB_PORT & echo $! > mongod.pid;
}

function exit_if_mongod_cannot_start() {
  sleep .5;

  if ! ps `cat mongod.pid`>/dev/null; then
    rm mongod.pid;
    exit 1;
  fi
}

function run_kug_server_and_wait_for_end() {
  echo -e "${CYAN}Starting kug server${NORM}";
  cd "${PROJECT_DIR}";
  PORT=$PORT MONGO_URL=mongodb://127.0.0.1:$DB_PORT/test node --trace-warnings server_build/server.js --  --log --graphiql;
}

function kill_mongod() {
  MONGOPID=`cat mongod.pid`;
  rm mongod.pid;

  if ps $MONGOPID>/dev/null; then
    #Never use kill -9 on mongod!
    kill -2 $MONGOPID;
  fi
}


start_mongod;
exit_if_mongod_cannot_start;
run_kug_server_and_wait_for_end;
kill_mongod;
