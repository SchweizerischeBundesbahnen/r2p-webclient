# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the Angular application
RUN npm run build

# Runtime stage
FROM bitnami/nginx:latest

# Bitnami Nginx serves static files from /app
COPY --from=builder /app/dist/r2p-webclient/browser /app

# Bitnami Nginx runs on 8080 by default
EXPOSE 8080
