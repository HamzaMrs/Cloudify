FROM node:18-alpine

WORKDIR /usr/src/app

# Copie uniquement package.json (pas besoin de package-lock.json)
COPY package.json ./

RUN npm install

COPY src/ .

EXPOSE 3000

CMD ["node", "server.js"]