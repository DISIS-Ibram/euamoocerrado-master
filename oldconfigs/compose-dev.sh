#!/bin/bash
docker-compose -f ./docker-compose-dev.yaml --env-file=./.env.development "$@"
# docker-compose -f docker-compose.yaml -f docker-compose-dev.yaml --env-file=./.env.development "$@"