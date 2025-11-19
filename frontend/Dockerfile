# FROM node:14 as builder



# WORKDIR /app

# # Copiar arquivos de dependências primeiro para aproveitar o cache
# COPY package*.json ./
# RUN npm install

# # Copiar o resto dos arquivos
# COPY . .

# # Build da aplicação com debug
# RUN npm run build || (echo "Build failed" && exit 1)
# RUN ls -la /app/dist || (echo "Dist directory not found" && exit 1)

# # Comando para manter o container rodando no stage de build
# # CMD ["tail", "-f", "/dev/null"]

# # Stage final (comentado temporariamente)
# FROM nginx:alpine


# COPY --from=builder /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# RUN ls -la /usr/share/nginx/html || (echo "Nginx html directory not found" && exit 1)

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


# hotreload
FROM node:18
WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE 8080

CMD ["npm", "run", "serve"]
