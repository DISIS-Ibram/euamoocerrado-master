#!/bin/bash

# Copia os arquivos públicos do admin para a pasta de build
cp -R /app/public/* /dist/admin/

# Faz o replace da variável no index.html do ADMIN
sed -E -i -e 's|(window.____BACKEND_URL=).*|\1"'"$VUE_APP_BACKEND_URL"'"|g' /dist/admin/index.html

# Inicia o servidor (ex: nginx ou serve)
nginx -g 'daemon off;'


# #!/bin/bash

# cp -R /app/public/* /dist/admin/ 
# sed -E -i -e 's|(window.____BACKEND_URL=).*|\1\"'"$VUE_APP_BACKEND_URL"'\"|g' /dist/frontend/index.html 


# sed -E -i -e 's|(window.____BACKEND_URL=).*|\1\"'"$VUE_APP_BACKEND_URL"'\"|g' /usr/share/nginx/html/index.html 
# sed -E -i -e 's|(window.____MVTMAPSERVER_URL=).*|\1\"'"$VUE_APP_MVTMAPSERVER_URL"'\"|g' /usr/share/nginx/html/index.html 
# nginx -g 'daemon off;'