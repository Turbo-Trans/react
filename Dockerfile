# 1️⃣ Build stage
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2️⃣ Runtime stage
FROM node:20

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 80

CMD ["npm", "start"]
