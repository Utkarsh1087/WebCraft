# ===================================================
# Stage 1: Build Stage
# ===================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first for maximum layer caching
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy source files and compile TypeScript
COPY . .
RUN npm run build

# ===================================================
# Stage 2: Minimal Production Runtime
# ===================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Run container as secure non-root user
USER node

# Copy production artifacts from builder
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/generated ./generated
COPY --chown=node:node --from=builder /app/prisma ./prisma

EXPOSE 3000

# Docker Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/healthz || exit 1

CMD ["node", "dist/server.js"]
