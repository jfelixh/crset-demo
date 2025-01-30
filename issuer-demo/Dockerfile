FROM node:20-alpine

WORKDIR /bfc-status-demo/issuer-demo/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app
COPY . .

# Expose port 3000
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev", "--", "-p", "3000"]

# # Adapted from: https://github.com/vercel/next.js/tree/canary/examples/with-docker and https://geshan.com.np/blog/2023/01/nextjs-docker/
# FROM node:18-alpine AS deps

# RUN apk add --no-cache libc6-compat
# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN  npm install --production

# FROM node:18-alpine AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# ENV NEXT_TELEMETRY_DISABLED 1

# RUN npm run build

# FROM node:18-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json

# USER nextjs

# EXPOSE 3000

# ENV PORT 3000

# CMD ["npm", "start"]
