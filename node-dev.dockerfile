FROM node:18-alpine

# dependencies used in the entrypoint script
RUN apk add --no-cache inotify-tools \
  && apk add --no-cache tmux

# Make (non-root) user "node-dev", we'll switch to it later. Note creating the user
# also creates it's /home/node-dev directory
RUN adduser -u 5678 -G node -s /bin/sh -D node-dev

# To use this image, mount a node project from your host OS as a volume over top of
# this work dir location, e.g `-v ./api:/home/node-dev/project`
RUN mkdir /home/node-dev/project
WORKDIR /home/node-dev/project

# Make sure the user owns it's home dir and ALL the contents within before switching to it
RUN chown -R node-dev /home/node-dev
USER node-dev

# The host's project directory will be mounted at .../project, enabling the container to
# live update against changes at run time. On the other hand, we want the container to install
# its own .../project/node_modules without messing with the host's filesystem. This can be achieved
# by creating a placeholder ../node_modules volume in advance. When the host's project dir is mounted
# down the road this empty container volume will be used regardless.   
# To make sure the node-dev user can write to the volume, we create a place holder dir first,
# rhe empty node_modules volume will inherit the permissions from this placeholder.
RUN mkdir ./node_modules
VOLUME /home/node-dev/project/node_modules

# This entrypoint syncs the container's node modules against the host workdir's package-lock.json.
# Uses inotify-tools to watch for changes to package-lock.json, kills and restarts the container
# command as needed. Note that it's 
COPY --chown=node-dev ./node-dev-entrypoint.sh ../entrypoint.sh
# When this image is built on windows, the entrypoint's newlines tend to get mangled.
# `dos2unix` fixes that if it's the case, harmless to run if not
RUN dos2unix ../entrypoint.sh
ENTRYPOINT [ "../entrypoint.sh" ]


# Default, specify the appropriate command in your docker-compose.yaml/in your `docker` args/etc 
CMD npm start