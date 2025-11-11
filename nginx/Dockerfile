# Usa imagem base leve do NGINX
FROM nginx:alpine

# Criar diretórios necessários e ajustar permissões
RUN mkdir -p /var/log/nginx /var/cache/nginx /etc/nginx/cache && \
    chown -R nginx:nginx /var/log/nginx /var/cache/nginx /etc/nginx/cache
  
# Copiar a configuração do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# # # COPY run_nginx.sh /etc/nginx/run_nginx.sh
# # # RUN chmod +x /etc/nginx/run_nginx.sh

# # # Copiar arquivos estáticos
# # COPY static /static

# # # Ajustar permissões dos arquivos estáticos
# # RUN chown -R nginx:nginx /static

# # EXPOSE 80

# # CMD ["nginx", "-g", "daemon off;"]