#!/bin/bash

# local processes, without Docker
SCRIPT_CALLING_PATH="$0";
SCRIPT_CALLING_DIR=$(dirname "$SCRIPT_CALLING_PATH");
SCRIPT_ABS_DIR=$(realpath "${SCRIPT_CALLING_DIR}");
PROJECT_DIR=$(realpath "${SCRIPT_ABS_DIR}/..");
DB_PATH=$(realpath "${SCRIPT_ABS_DIR}/../db_development_2");
# DB_PATH=$(realpath "${SCRIPT_ABS_DIR}/../db_test");
DB_PORT="30002";
PORT="3002";

# with Docker
DOCKER_IMAGE="kunstumsglas.at:development";
DOCKER_DB_IMAGE="mongo:3.4.23";
DOCKER_VOLUME="kunstumsglas-at-development-volume";
DOCKER_NETWORK="kunstumsglas-at-development-network";
DOCKER_DB_PORT="20002";
DOCKER_WEB_PORT="2002";
DOCKER_SESSION_SECRET="söskjdf(64GXldDF1.";
DOCKER_COMPOSE_FILE="${SCRIPT_ABS_DIR}/stack-DEVELOPMENT.yml";
DOCKER_DEVELOPMENT_STACK="kunstumsglas-at-development";
