#!/bin/bash
SCRIPT_CALLING_PATH="$0";
SCRIPT_CALLING_DIR=$(dirname "$SCRIPT_CALLING_PATH");
SCRIPT_ABS_DIR=$(realpath "${SCRIPT_CALLING_DIR}");
PROJECT_DIR=$(realpath "${SCRIPT_ABS_DIR}/..");

DB_PATH=$(realpath "${SCRIPT_ABS_DIR}/../db_test_empty");
# DB_PATH=$(realpath "${SCRIPT_ABS_DIR}/../db_test");
DB_PORT="30002";
PORT="3002";
