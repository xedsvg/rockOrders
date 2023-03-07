FROM node:16.10-alpine

WORKDIR /frontend

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn
COPY . .

RUN npx expo export:web

CMD [ "yarn", "start" ]