#!/usr/bin/env sh
set -e

# Start Podman machine if available and not already running
if [ -x "$(command -v podman)" ]; then
  if podman machine inspect >/dev/null 2>&1; then
    if ! podman machine inspect | grep -q '"State": "running"'; then
      echo "Podman machine detected but not running, starting machine..."
      podman machine start
    else
      echo "Podman machine is already running."
    fi
  fi
fi

# Start Docker machine if available and not already running
if [ -x "$(command -v docker-machine)" ]; then
  if ! docker-machine ls --filter "STATE=Running" | grep -q "Running"; then
    echo "Docker machine detected, starting the default machine..."
    docker-machine start default
    # Configure Docker environment variables
    eval "$(docker-machine env default)"
  else
    echo "Docker machine is already running."
  fi
fi

# Determine the appropriate compose command
if [ -x "$(command -v podman)" ]; then
  exec='podman compose'
elif [ -x "$(command -v docker)" ]; then
  exec='docker compose'
else
  echo "Neither podman nor docker found. Aborting."
  exit 1
fi

export HOSTNAME="$(hostname).local"

echo 'Container startup'
eval "$exec up $@"
