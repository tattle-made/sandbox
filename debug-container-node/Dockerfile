FROM node:18-alpine3.15

COPY . /app
WORKDIR /app

RUN apk add vim curl git

EXPOSE 3000
CMD node index.js