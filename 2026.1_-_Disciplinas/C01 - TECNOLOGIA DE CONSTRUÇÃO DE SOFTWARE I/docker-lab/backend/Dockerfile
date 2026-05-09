# Etapa 1: imagem base do Node.js
FROM node:lts-alpine

# Etapa 2: diretório da aplicação
WORKDIR /app

# Etapa 3: copia a definição do projeto
COPY package*.json ./

# Etapa 4: instala dependências
RUN npm install

# Etapa 5: copia o código
COPY . .

# Etapa 6: expõe a porta do backend
EXPOSE 3000

# Etapa 7: inicia o servidor
CMD ["npm", "run", "start:dev"]