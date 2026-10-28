# ─── Этап 1: сборка ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Prisma требует OpenSSL для своего query engine
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY tsconfig.json nest-cli.json ./
COPY src ./src/

RUN npx prisma generate
RUN npm run build && test -f dist/main.js

# ─── Этап 2: production-образ ─────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Prisma требует OpenSSL для своего query engine
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev && npx prisma generate

COPY --from=builder /app/dist ./dist

COPY docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
