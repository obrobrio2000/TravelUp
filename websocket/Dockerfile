FROM node:16
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm i -g nodemon
RUN npm i --loglevel=error --production
COPY . .
EXPOSE 1337
CMD [ "npm", "run", "start" ]
