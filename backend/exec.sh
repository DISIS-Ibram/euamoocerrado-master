#!/bin/bash
docker exec -w '/app' -it eac-backend "$@"

#examples
#migrate
#./exec.sh python manage.py makemigrations
#./exec.sh python manage.py migrate