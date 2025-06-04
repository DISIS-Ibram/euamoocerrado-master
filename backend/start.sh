#!/bin/bash

DB_HOST=$1
shift
CMD="$@"

sleep 10

echo "Aguardando o banco de dados em $DB_HOST..."

until pg_isready -h "$DB_HOST" -p 5432; do
  sleep 2
  echo "Aguardando o banco de dados..."
done

echo "Banco disponível. Iniciando aplicação."

#incluir os migrates aqui

python manage.py migrate

echo "Iniciando o servidor Django..."

exec $CMD
