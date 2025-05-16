#!/bin/bash
# sed -E -i -e 's|(window.____BACKEND_URL=).*|\1\"'"$VUE_APP_BACKEND_URL"'\"|g' /usr/share/nginx/html/index.html 
nginx -g 'daemon off;'