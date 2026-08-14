FROM node:22-bookworm-slim AS builder
RUN apt-get update && apt-get install -y python3 make g++ openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY web/package.json web/package-lock.json ./web/
WORKDIR /app/web
RUN npm ci
COPY web ./
COPY ["FUZZEQUIPAMIENTOS - ADMIN.xlsx", "/app/FUZZEQUIPAMIENTOS - ADMIN.xlsx"]
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate && npm run build

FROM node:22-bookworm-slim AS runner
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/web ./web
COPY --from=builder ["/app/FUZZEQUIPAMIENTOS - ADMIN.xlsx", "./FUZZEQUIPAMIENTOS - ADMIN.xlsx"]
WORKDIR /app/web
EXPOSE 3000
CMD ["npm", "run", "start:production"]
