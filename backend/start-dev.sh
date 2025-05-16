#!/bin/sh
set -e

sleep 10

until PGPASSWORD=$DB_PASS psql -h "$DB_HOST" -U "postgres" -c '\q'; do
  >&2 echo "Aguardando o banco...."
  sleep 10
done

>&2 echo "Banco OK... executando"


#incluir os migrations aq ui
# python manage.py migrate

pip install debugpy -t /tmp 

python /tmp/debugpy --listen 0.0.0.0:3001 manage.py runserver 0.0.0.0:80
exec $cmd