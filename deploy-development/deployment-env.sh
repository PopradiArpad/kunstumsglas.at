STACK_DB_IMAGE="mongo:3.4.23";
STACK_WEB_PORT="3002";

function db_create_volume() {
  local DB_VOLUME_NAME="${1}";
  local DB_SESSION_SECRET="söskjdf(64GXldDF1.";

  npm run db_management create ${STACK_DB_IMAGE} ${DB_VOLUME_NAME} ${DB_SESSION_SECRET};
}
