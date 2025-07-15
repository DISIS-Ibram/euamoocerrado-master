#compilar o node
FROM node:10 as node
# RUN apt-get update && apt-get install -y yarn
WORKDIR /app
ADD ./ /app
RUN npm install
RUN npm add webpack-dev-server@2.4.5 
RUN npm run build-dev