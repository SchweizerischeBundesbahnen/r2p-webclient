# Build stage
FROM node:26-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Runtime stage
FROM nginxinc/nginx-unprivileged:1.29-alpine

COPY --from=builder /app/dist/r2p-webclient/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
