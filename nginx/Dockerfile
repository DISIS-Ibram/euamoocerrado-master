FROM nginx:alpine

# Criar diretórios necessários e ajustar permissões
RUN mkdir -p /var/log/nginx /var/cache/nginx /etc/nginx/cache && \
    chown -R nginx:nginx /var/log/nginx /var/cache/nginx /etc/nginx/cache

# Copiar a configuração do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos estáticos
COPY static /static

# Ajustar permissões dos arquivos estáticos
RUN chown -R nginx:nginx /static

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]