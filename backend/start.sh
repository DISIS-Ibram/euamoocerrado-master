#!/bin/sh
set -e

echo "Aguardando banco..."

until PGPASSWORD=$POSTGRES_PASSWORD psql \
  -h "$DB_HOST" \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  -c '\q'; do
  sleep 5
done

echo "Banco OK"

python manage.py migrate

exec python -m debugpy \
  --listen 0.0.0.0:3001 \
  manage.py runserver 0.0.0.0:8585


# #!/bin/sh
# set -e

# host="$1"
# shift
# cmd="$@"

# sleep 10

# until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_DB" -U "postgres" -c '\q'; do
#   >&2 echo "Aguardando o banco...."
#   sleep 10
# done

# >&2 echo "Banco OK... executando"
# #incluir os migrations aq ui
# python manage.py migrate
# exec $cmd