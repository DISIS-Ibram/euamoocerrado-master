#!/usr/bin/env bash

echo "################################## Run nginx"

if [ $NODE_ENV == "development" ]
  then
    FILENAME="nginx-dev.tmpl"
else
    FILENAME="nginx-prod.tmpl"
fi

envsubst '$FRONTEND_PORT $BACKEND_PORT $ADMIN_PORT $BACKEND_CONTEXT $DOMAIN ' < "/etc/nginx/$FILENAME" > /etc/nginx/nginx.conf # /etc/nginx/conf.d/default.conf
cat /etc/nginx/nginx.conf
rm -rf /etc/nginx/cache/*

if [ $NODE_ENV == "development" ]
  then
    #nginx -g "daemon off;"
    while :; 
      do sleep 10s & wait ${!}; 
      envsubst '$FRONTEND_PORT $BACKEND_PORT $ADMIN_PORT $BACKEND_CONTEXT $DOMAIN' < "/etc/nginx/$FILENAME" > /etc/nginx/nginx.conf; 
      cat /etc/nginx/nginx.conf
      nginx -s reload; 
    done & nginx -g "daemon off;"
else
    while :; do sleep 6h & wait ${!}; nginx -s reload; done & nginx -g "daemon off;"
fi