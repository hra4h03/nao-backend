FROM node:20-buster-slim as builder

USER root

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Production image
FROM node:20-buster-slim

WORKDIR /app

COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-lock.yaml
COPY --from=builder /app/.env /app/.env
COPY --from=builder /app/dist /app/dist

RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile

CMD ["sh","-c","pnpm start:processor:prod"]