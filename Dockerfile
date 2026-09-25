# =========================================================
# Stage 1 — Build React/Vite frontend
# =========================================================
FROM node:20-bookworm-slim AS frontend-build

WORKDIR /build/frontend

COPY apps/frontend/package*.json ./
RUN npm ci

COPY apps/frontend/ ./
RUN npm run build


# =========================================================
# Stage 2 — Build Express/TypeScript backend
# =========================================================
FROM node:20-bookworm-slim AS backend-build

WORKDIR /build/backend

COPY apps/backend/package*.json ./
RUN npm ci

COPY apps/backend/ ./
RUN npm run build


# =========================================================
# Stage 3 — Install production backend dependencies
#
# better-sqlite3 contains native bindings.
# Build tools are included here in case a prebuilt binary
# is not available for the runner architecture.
# =========================================================
FROM node:20-bookworm-slim AS production-deps

WORKDIR /build/backend

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
       python3 \
       make \
       g++ && \
    rm -rf /var/lib/apt/lists/*

COPY apps/backend/package*.json ./

RUN npm ci --omit=dev


# =========================================================
# Stage 4 — Minimal runtime image
# =========================================================
FROM node:20-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/data/data.sqlite

# Production Node dependencies
COPY --from=production-deps \
    /build/backend/node_modules \
    ./node_modules

# Compiled Express/TypeScript application
COPY --from=backend-build \
    /build/backend/dist \
    ./dist

# React/Vite production build
COPY --from=frontend-build \
    /build/frontend/dist \
    ./public

# Package metadata
COPY apps/backend/package.json ./package.json

# SQLite persistent mount location
RUN mkdir -p /data

EXPOSE 3000

CMD ["node", "dist/index.js"]