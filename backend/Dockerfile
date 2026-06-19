# Stage 1: Build the backend app
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copy workspace package definitions
COPY package*.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install build dependencies for backend workspace
RUN npm ci --workspace=school-management-backend

# Copy backend source
COPY backend/tsconfig.json ./backend/
COPY backend/src/ ./backend/src/

WORKDIR /usr/src/app/backend
RUN npm run build

# Stage 2: Production environment
FROM node:22-alpine

WORKDIR /usr/src/app

# Copy workspace package definitions
COPY package*.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install production dependencies for backend workspace
RUN npm ci --omit=dev --workspace=school-management-backend

# Copy compiled backend code
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Copy constants.ts from frontend (context is monorepo root)
COPY frontend/constants.ts ./frontend/constants.ts

# Create database folder
RUN mkdir -p backend/data

ENV NODE_ENV=production
ENV PORT=5050
ENV DATABASE_PATH=/usr/src/app/backend/data/school.db
ENV CONSTANTS_PATH=/usr/src/app/frontend/constants.ts

# SQLite persistence volume (handled via Railway Volumes / docker-compose mounts)

EXPOSE 5050

WORKDIR /usr/src/app/backend
CMD ["node", "dist/index.js"]
