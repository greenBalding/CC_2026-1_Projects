# Imagem base do Nginx
FROM nginx:alpine

# Copia o arquivo de configuração personalizado para o container
COPY nginx.conf /etc/nginx/nginx.conf

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
