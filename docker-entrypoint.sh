#!/bin/sh
if [ "$(id -u)" = "0" ]; then
  chown -R kunstumsglas:kunstumsglas /app/tmp
  set -- gosu kunstumsglas "$@"
fi

exec "$@";
