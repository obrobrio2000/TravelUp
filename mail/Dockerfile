FROM node:16-alpine
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm i -g nodemon
RUN npm i --loglevel=error
COPY . .
EXPOSE 465
CMD [ "npm", "run", "start" ]
