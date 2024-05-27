#!/bin/sh
set -o errexit
set -o pipefail
set -o nounset

# WARNING: this needs to run inside the app docker container, which is alpine linux
# That means sh instead of bash, different unix utilities, etc

# Using tmux to manage backgrounded process(es) rather than sh `&` backgrounding, because of
# an issue with react-scripts start command. In projects using react-scripts, `npm start`
# launches three separate processes, and sending a TERM signal to just `npm start` doesn't 
# properly clean up all of them, at which point the dev server port is still in use and calling
# `npm start` again will throw errors.
#
# By executing the container command in a tmux managed shell session, tmux tracks all the 
# session's processes and is responsible for killing them all when the session's killed.
#
# Using a named pipe to buffer the tmux session's output and read it in to stdout

# The container's command (docker file CMD or a command line/compose file overwrite) is
# passed to the entrypoint script args, split by word. Usually parsed from $@, which
# is an array of all arg values, but for our purposes we're using the less-common $*,
# which is a space seperated string of all args (i.e. the original command string)
container_command="${*}"

tmux_session=""

buffer="$(mktemp -d)/tmux-output-buffer"
mkfifo "${buffer}"

start_container_command () {
  echo "Starting container command"

  # Kill any existing container command tmux session
  if [ ! -z "${tmux_session}" ]; then
    kill_container_command
  fi

  # Start a new tmux session, store it's name in the script-level tmux_session variable
  tmux_session=$(tmux new-session -dP -s "container_command_$(date +%s)")

  # Pipe the tmux session's output in to the buffer
  tmux pipe-pane -o -t "${tmux_session}" "cat > ${buffer}" 

  # Start reading from the buffer, outputting to this script's stdout
  # Note: `cat` terminates on EOF, so will end when the tmux session is killed
  cat "${buffer}" &

  # Send container command to the new tmux session
  tmux send-keys -t "${tmux_session}" "${container_command}" ENTER
}

kill_container_command () {
  echo "Killing container command..."
  tmux kill-session -t "${tmux_session}"
  tmux_session=""
  echo "Container command killed!"
}

# Initial package install and container command startup
echo "Installing packages..."
npm ci

start_container_command

# Watch for any changes in this directory that impact the package-lock.json
# Refresh the packages and restart the container command in response
inotifywait -e close_write,moved_to,create -m . | while read -r directory events filename; do
  if [ "$filename" = "package-lock.json" ]; then
    echo "Host's package-lock.json has been modified; re-installing node modules and restarting container command"

    kill_container_command

    echo "Installing packages..."
    npm ci
    
    start_container_command
  fi

  if echo "$filename" | grep -q "^\.env.*"; then
    echo "Host's .env has been modified; restarting container command"

    kill_container_command
    
    start_container_command
  fi
done