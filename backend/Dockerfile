FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .

EXPOSE 5001

CMD ["sh", "-c", "npx prisma migrate deploy && node index.js"]
