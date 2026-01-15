FROM node:18-alpine AS builder

WORKDIR /app

# Copie uniquement package.json (package-lock.json sera créé si nécessaire)
COPY package.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Configuration pour compatibilité OpenSSL avec les anciens algorithmes
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build de l'application React
RUN npm run build

# Stage 2 : Production avec Nginx
FROM nginx:alpine

# Copie du build React vers Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copie de la configuration Nginx personnalisée (optionnel)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposition du port 80
EXPOSE 80

# Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]