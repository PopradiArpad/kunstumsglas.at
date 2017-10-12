#!/bin/bash

# Example
# npm run start_test_server -- --db_path db_test  --db_port 30002 --port 3002 --log --graphiql

DEBUG=0;
READ_NEXT_ARG=1;
for arg in "$@"; do
  shift; #shift the positional parameters to let $1 to be the one after $arg
  if [[ $READ_NEXT_ARG -eq '1' ]];then
    case "$arg" in
      "--db_path")
        DB_PATH=$1;
        READ_NEXT_ARG=0;
        ;;
      "--db_port")
        DB_PORT=$1;
        READ_NEXT_ARG=0;
        ;;
      "DEBUG")
        DEBUG=1;
        READ_NEXT_ARG=1;
        ;;
      *)
        UNINTERPRETED_ARGS="$UNINTERPRETED_ARGS $arg";
        READ_NEXT_ARG=1;
        ;;
    esac
  else
    READ_NEXT_ARG=1;
  fi
done

if [[ $DEBUG -eq '1' ]];then
  CMD=start_debug;
else
  CMD=start;
fi

function exitIfMongodCannotStarted() {
  sleep .5;

  if ! ps `cat mongod.pid`>/dev/null; then
    rm mongod.pid;
    exit 1;
  fi
}

function killMongod() {
  MONGOPID=`cat mongod.pid`;
  rm mongod.pid;

  if ps $MONGOPID>/dev/null; then
    #Never use kill -9 on mongod!
    kill -2 $MONGOPID;
  fi
}

echo "starting mongod"
(mongod --master --dbpath $DB_PATH --port $DB_PORT & echo $! > mongod.pid) && exitIfMongodCannotStarted;


echo "starting server with npm run start with --db_port $DB_PORT $UNINTERPRETED_ARGS"
npm run $CMD -- --db_port $DB_PORT $UNINTERPRETED_ARGS;
killMongod;
