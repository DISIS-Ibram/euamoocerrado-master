Instalar o yarn

brew install yarn --without-node

Instalar o sprite-cli para converter o spritesheets usados no mapbox

yarn global add @mapbox/spritezero-cli



# Hot reload
docker compose -f docker-compose-dev.yaml build
docker compose -f docker-compose-dev.yaml up -d

vue.config.js
// hot reload
module.exports = {
  lintOnSave: false,

  devServer: {
    host: "0.0.0.0",
    port: 8080,
    hot: true,
    liveReload: true,

    watchOptions: {
      poll: 1000,
      ignored: /node_modules/
    }
  }
};



# Build




# postgresql - docker
saber o ip de conexão
hostname -I 


# Backup banco
A tabela parque_atrativo tem um erro na coluna parque_id
resolver depois

salvar os dados no banco
docker exec -it eac-postgres psql -U postgres -d euamoocerrado -f db-backup/tables/parque_atrativo.sql 

Andamento - Arquivos
App.vue
parques.js
query.js
api.js'
actions.js

Está dando erro ao buscar os dados usando o graphql
Tem que popular as tabelas e criar os relacionamentos
Erro sumário_especie
