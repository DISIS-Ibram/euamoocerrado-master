#!/bin/sh
set -e

host="$1"
shift
cmd="$@"

sleep 10

until PGPASSWORD=$DB_PASS psql -h "$DB_HOST" -U "postgres" -c '\q'; do
  >&2 echo "Aguardando o banco...."
  sleep 10
done

>&2 echo "Banco OK... executando"
#incluir os migrations aq ui
python manage.py migrate
exec $cmd