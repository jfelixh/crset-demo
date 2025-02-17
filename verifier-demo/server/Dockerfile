# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


FROM base AS sqlite-builder

# Install sqlite build dependencies
RUN \
  apk update && \
  apk upgrade && \
  apk add \
  alpine-sdk \
  build-base  \
  tcl-dev \
  tk-dev \
  mesa-dev \
  jpeg-dev \
  libjpeg-turbo-dev

# Download latest sqlite release
RUN \
  wget \
  -O sqlite.tar.gz \
  https://www.sqlite.org/src/tarball/sqlite.tar.gz?r=release && \
  tar xvfz sqlite.tar.gz

# Configure and make SQLite3 binary
RUN \
  ./sqlite/configure --prefix=/usr && \
  make && \
  make install && \
  # Smoke test
  sqlite3 --version


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Production image, copy all the files and run node
FROM base AS runner
WORKDIR /app

COPY --from=sqlite-builder /usr/bin/sqlite3 /usr/bin/sqlite3

# Copy the schema.sql so it can be used at runtime
COPY src/db/schema.sql ./src/db/schema.sql
COPY package.json ./package.json

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules

USER node

EXPOSE 8080

ENV PORT=8080

ENV HOSTNAME="0.0.0.0"
CMD ["sh", "-c", "npm run db:init && node dist/index.js"]