FROM node:20-alpine AS builder

# Define build arguments
ARG VITE_BACKEND_HOST
ARG VITE_BACKEND_PORT
ARG VITE_BACKEND_PORT_WS

# Make them available as environment variables during build
ENV VITE_BACKEND_HOST=$VITE_BACKEND_HOST
ENV VITE_BACKEND_PORT=$VITE_BACKEND_PORT
ENV VITE_BACKEND_PORT_WS=$VITE_BACKEND_PORT_WS

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM busybox:1.37 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist .
EXPOSE 8080
CMD ["busybox", "httpd", "-f", "-v", "-p", "8080"]
