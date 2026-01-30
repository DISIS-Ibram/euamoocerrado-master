# # #############################################
# # #compilar o node
# # FROM node:10 AS node
# # # RUN apt-get update && apt-get install -y yarn
# # WORKDIR /app
# # ADD ./ /app
# # RUN npm install
# # RUN npm add webpack-dev-server@2.4.5 
# # RUN npm run build-dev
# # #############################################

# # =========================
# # STAGE 1 — BUILD
# # =========================
# FROM node:10 AS build

# WORKDIR /app

# COPY package.json package-lock.json* ./
# RUN npm install

# COPY . .
# RUN npm run build-prod

# # =========================
# # STAGE 2 — NGINX
# # =========================
# FROM nginx:1.25-alpine

# COPY --from=build /app/public /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]


# Teste para desenvolvimento - Rodar localmente
FROM node:10

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]