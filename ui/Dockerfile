FROM node:18.6.0-alpine3.15 AS builder

RUN mkdir /ui
# Copy package.json to avoid unecessarily re-running the
# `npm install` stanza.
COPY package.json /ui
WORKDIR /ui
RUN npm i

# Copy source code and run `npm build` after
# the `npm install` stanza.
COPY . /ui
RUN npm run build

FROM node:18.6.0-alpine3.15

RUN npm i --location=global serve
COPY --from=builder --chown=node:node /ui/build /ui
USER node
EXPOSE 3000
CMD ["serve", "-s", "ui"]
