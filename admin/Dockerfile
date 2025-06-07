#compilar o node
FROM node:24 AS node
# RUN apt-get update && apt-get install -y yarn
WORKDIR /app
# ADD ./ /app
COPY ./ /app
RUN npm install
# RUN npm add webpack-dev-server@2.4.5
RUN npm install webpack-dev-server@^5.0.0 --save-dev
RUN npm run build-dev