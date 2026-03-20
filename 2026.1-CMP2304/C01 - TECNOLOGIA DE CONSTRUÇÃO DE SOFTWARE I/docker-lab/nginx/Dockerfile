# Imagem base do Nginx
FROM nginx:alpine

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia o arquivo de configuração personalizado para o container
COPY nginx.conf /etc/nginx/nginx.conf