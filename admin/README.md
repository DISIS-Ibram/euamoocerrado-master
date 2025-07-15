# SI3RC
**Icones**  
Para gerar icone svg automaticamente coloque em src/componentes/elements/icon/svg  

**stylus**
mixen box (all t l r b w h)

###  Executar o servidor de admin fora do dockerfile do projeto

# Criar a imagem
docker build -t eac-admin .

# Executar a imagem
docker run nome-da-imagem
docker run -d -p 8000:8000 nome-da-imagem

# Executar imagem de forma iterativa - acessando a máquina
docker run -it name-da-maquina /bin/bash    # máquina completa
docker run -it nome-da-maquina /bin/sh      # máquina alpine - limitada

# Rodar o projeto com o Dockerfile
docker build -t eac-admin .
docker run -p 8080:8080 eac-admin


# Usar a versão 15 do node para rodar o projeto antigo
sudo apt update
sudo apt install curl -y

# Baixar o nvm para instalar versão antigas do node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Adicionar o nvm ao shell do linux
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm --version

nvm ls

nvm use 10
nvm use XX

# Ver todas as versões disponíveis 
nvm ls-remote

# Definir versão padrão
nvm alias default 10

# Instalar o React 15 no node 10
npm install react@15.6.2 react-dom@15.6.2

# Abrir um terminal em uma imagem em execução
docker exec -it eac-backend /bin/bash
docker exec -it eac-backend /bin/sh
