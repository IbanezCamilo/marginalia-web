# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies first for better layer caching.
COPY package.json package-lock.json ./
RUN npm ci

# Vite inlines VITE_* variables at BUILD time, so the backend origin must be
# provided as a build arg (in Dokploy: a "Build-time Variable"), NOT a runtime
# container env var — a runtime var would never reach the already-compiled JS.
# Set to the API origin WITHOUT /api, e.g. https://api.marginalia.com
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# ---- Serve stage ----
FROM nginx:alpine AS serve
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
