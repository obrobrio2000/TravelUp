FROM node:16-alpine
WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm i --loglevel=error --include=dev
RUN npm i ws
COPY . .
EXPOSE 1337
CMD [ "npm", "run", "start" ]
