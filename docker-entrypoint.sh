#!/bin/sh
if [ "$(id -u)" = "0" ]; then
  chown -R kunstumsglas:kunstumsglas /app/tmp
  set -- gosu kunstumsglas "$@"
fi

# Replace the shell with the given program, allowing the application
# to receive any Unix signals sent to the container.
exec "$@";
