# Stage 1: Build the Astro application
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve the static files using Nginx
FROM nginx:alpine
# Copy the Astro build output to Nginx default public folder
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx configuration to listen on port 8080 (Cloud Run default)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
