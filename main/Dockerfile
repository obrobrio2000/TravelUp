FROM node:16-alpine
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm i --loglevel=error --include=dev
COPY . .
EXPOSE 8080
CMD [ "npm", "run", "startDev" ]
