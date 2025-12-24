#!/bin/bash
docker exec -it eac-frontend-dev yarn add -s "$@"
# docker-compose -f ./docker-compose-dev.yaml --env-file=./.env.development "$@"
# docker-compose -f docker-compose.yaml -f docker-compose-dev.yaml --env-file=./.env.development "$@"