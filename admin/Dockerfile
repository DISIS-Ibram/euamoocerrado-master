FROM node:10 as node

# Corrige repositórios e remove os que não existem mais
RUN sed -i '/stretch-updates/d' /etc/apt/sources.list && \
    sed -i 's/deb.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
    sed -i 's|security.debian.org|archive.debian.org|g' /etc/apt/sources.list && \
    echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid-until && \
    apt-get update && \
    apt-get install -y python-minimal make g++ && \
    ln -sf /usr/bin/python /usr/bin/python2

# Diretório da aplicação
WORKDIR /app

# Copia o projeto
COPY . .

# # Instala dependências (inclusive Babel)
# RUN npm install --save-dev @babel/core @babel/preset-env @babel/preset-typescript

# Instala dependências
RUN npm install

EXPOSE 8080

CMD ["npm", "start"]
