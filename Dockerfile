# Build stage.
FROM node:12-alpine AS build
WORKDIR /home/lagimakan/Documents/EXPRESS/express-js-api
COPY . /home/lagimakan/Documents/EXPRESS/express-js-api

CMD [ "npm", "start" ]