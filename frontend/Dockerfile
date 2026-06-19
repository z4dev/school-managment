# Stage 1: Build the Vite/React application
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copy workspace package definitions
COPY package*.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install build dependencies for frontend workspace
RUN npm ci --workspace=school-management-frontend

# Copy frontend source
COPY frontend/tsconfig.json ./frontend/
COPY frontend/vite.config.ts ./frontend/
COPY frontend/index.html ./frontend/
COPY frontend/index.tsx ./frontend/
COPY frontend/App.tsx ./frontend/
COPY frontend/constants.ts ./frontend/
COPY frontend/types.ts ./frontend/
COPY frontend/curriculumData.ts ./frontend/
COPY frontend/components/ ./frontend/components/

WORKDIR /usr/src/app/frontend
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /usr/src/app/frontend/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
