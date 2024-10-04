# Debian node base image
FROM node:18-bullseye
# FROM node:lts-alpine3.19@sha256:20b236009deb4c33bf7e255c32fe1e82da7eb0a10245657e0a6a846851fde521 AS build

WORKDIR /app

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# # Allow Puppeteer to manage browser installation
# ENV PUPPETEER_CACHE_DIR=/home/puppeteer/.cache/puppeteer

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install Google Chrome Stable and fonts for puppeteer 
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# #  Add user with UID 1000
# RUN groupadd puppeteer && useradd -r -u 10000 -g puppeteer -G audio,video puppeteer

# # Ensure /tmp/chrome is writable by non-root user
# RUN mkdir -p /tmp/chrome && chown -R puppeteer:puppeteer /tmp/chrome

COPY package*.json ./
RUN npm ci

# COPY ./.env ./.env.example ./
COPY ./whitelist-config.json .
COPY ./src ./src
COPY ./index.js .

# Change switch to non-root user
# RUN chown -R 1000:1000 /app
# USER puppeteer

CMD ["npm", "--no-update-notifier", "start"]