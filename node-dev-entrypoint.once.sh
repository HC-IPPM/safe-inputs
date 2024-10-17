#!/bin/sh
set -o errexit
set -o pipefail
set -o nounset

container_command="${*}"

echo "Installing packages..."
npm ci

eval "${container_command}"
