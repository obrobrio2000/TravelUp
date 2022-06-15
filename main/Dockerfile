FROM node:16-alpine
WORKDIR /usr/src/app
COPY ./package*.json ./
ARG NODE_ENV

RUN npm i --package-lock-only --loglevel=error
RUN if [ "${NODE_ENV}" == "production" ]; then npm ci --only=production --loglevel=error; else npm ci --loglevel=error; fi

# RUN if [ "${NODE_ENV}" == "production" ]; then npm i --package-lock-only --loglevel=error && npm ci --only=production --loglevel=error; else npm i --include=dev --loglevel=error; fi

COPY . .
EXPOSE 8080
