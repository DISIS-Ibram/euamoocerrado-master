# Projeto EU AMO CERRADO
---

O Projeto esta disponível como um docker-compose.


````
docker-compose --env-file=./.env up -d
````

O projeto estará disponível em http://localhost:8888




É composto por alguns serviços, que destacamos abaixo:

 
## Servidor Web - NGINX
Servidor proxy para os serviços.  
fica disponivel em http://localhost:8181


## Banco de Dados - Postgres/Postgis
Arquivo de dump disponibilizado em **/db-backup**

Caso utilizem o banco no container, o backup pode ser recuperado no container do banco executando
```
./bin/restore-db.sh
```

## Frontend do Site - Vue
Desenvolvido em Vue 2.x

## Servidor GraphQL - HASSURA
Um cliente GraphQL que fornece para o Frontend site os dados, através de uma conexão direta no banco.


## MEDIA SERVICE
So um servico temporario para fornecer as imagens que o DJANGO fornecia.


## Backend - DJANGO - *SEM FUNCIONAR*
Desenvolvido em DJANGO. É utilizado para inclusão de dados no backend, através do interface disponibilizada no Frontend Admin




# #########################
DANIEL

Executar o Docker-compose.yaml
docker compose build

Após executar os containers de db e backend, executar o comando para restaurar o banco de dados
docker compose exec db bash -c "psql -U postgres -d euamocerrado < /db-backup/backup_completo.sql"

Frontend
Instalar as dependências
npm install


Rodar o projeto 
docker compose up -d

