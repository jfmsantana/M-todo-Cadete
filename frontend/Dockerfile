# frontend/Dockerfile

# FASE 1: build do front
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# FASE 2: servir com Nginx
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# copia os arquivos estáticos gerados pelo Vite
COPY --from=build /app/dist ./

# opcional: arquivo de config do nginx (pode ignorar por enquanto)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
