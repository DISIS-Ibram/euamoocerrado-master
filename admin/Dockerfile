# FROM node:24 AS node

# WORKDIR /app

# COPY ./ /app
# RUN npm install

# RUN npm install webpack-dev-server@^5.0.0 --save-dev
# RUN npm run start


# Etapa base: imagem Node
FROM node:24 as node
 
# Diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (melhora cache)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta usada pelo Webpack Dev Server
EXPOSE 8080

# Comando padrão ao iniciar o container
CMD ["npm", "run", "start"]
