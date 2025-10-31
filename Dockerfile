FROM node:22-alpine
WORKDIR /app

RUN apk add --no-cache bash

COPY package*.json ./
RUN npm ci

COPY . .

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]