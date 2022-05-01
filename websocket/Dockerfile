FROM node:16-alpine
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm i -g nodemon
RUN npm i --loglevel=error
COPY . .
EXPOSE 1337
CMD [ "npm", "run", "start" ]
