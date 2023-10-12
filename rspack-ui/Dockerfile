FROM node:18.6.0-alpine3.15 AS builder

COPY . /rspack-ui
WORKDIR /rspack-ui
RUN npm install

USER node
EXPOSE 8080
CMD ["npm", "run", "dev"]
