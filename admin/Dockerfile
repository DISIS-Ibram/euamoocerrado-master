FROM node:24 AS node

WORKDIR /app

COPY ./ /app
RUN npm install

RUN npm install webpack-dev-server@^5.0.0 --save-dev
RUN npm run build-dev