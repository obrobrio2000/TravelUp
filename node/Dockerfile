FROM node:14
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm i -g nodemon
RUN npm i --loglevel=error
COPY . .
EXPOSE 8080
CMD [ "npm", "run", "start" ]
