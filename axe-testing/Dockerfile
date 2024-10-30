FROM node:lts-alpine3.19@sha256:2ef8a5348c8936329810271059b2c1ba88f293f4d6849e5d2ade22652c3d396c

WORKDIR /app

# We don't need the standalone Chromium for puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Add a default value for HOMEPAGE_URL
ENV HOMEPAGE_URL="http://127.0.0.1:8080"
ENV PUPPETEER_EXECUTABLE_PATH='/usr/bin/chromium-browser'

# Install packages (Chromium and dependencies)
RUN apk update && apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates 
  # ttf-freefont # only needed if testing fonts - leaving out for now 

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code for building
COPY ./axeignore.json .
COPY ./src ./src
COPY ./index.js .

# Create a non-root user
RUN addgroup -g 1001 -S puppeteer && adduser -u 1001 -S puppeteer -G puppeteer

# Set ownership of the working directory to puppeteer user
RUN chown -R puppeteer:puppeteer /app

# Switch to the non-root user 
USER puppeteer

# Start application
CMD ["npm", "--no-update-notifier", "start"]