FROM node:16.10-alpine

WORKDIR /backend

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn
COPY . .

CMD [ "yarn", "start" ]