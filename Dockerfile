FROM node:22-alpine AS build

WORKDIR /app
RUN apk add --no-cache ca-certificates

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY scripts ./scripts
COPY src ./src
RUN npm run build

FROM node:22-alpine AS production

ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache ca-certificates

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 CMD wget -qO- "http://127.0.0.1:${REPLAY_SERVER_PORT:-3000}/healthz" || exit 1

CMD ["npm", "start"]
