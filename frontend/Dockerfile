# ====== Stage 1: Build ======
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files trước (tận dụng Docker cache)
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code và build
COPY . .
RUN npm run build

# ====== Stage 2: Serve với Nginx ======
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output từ stage 1
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
