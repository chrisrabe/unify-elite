FROM node:16-alpine

WORKDIR /app
COPY . .
COPY package.json package-lock.json ./

RUN npm install;npm run build;rm -rf src;

CMD ["npm", "run", "serve"]
