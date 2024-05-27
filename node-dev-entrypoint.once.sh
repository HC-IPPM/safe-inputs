#!/bin/sh
set -o errexit
set -o pipefail
set -o nounset

container_command="${*}"

echo "Installing packages..."
npm ci

${container_command}
