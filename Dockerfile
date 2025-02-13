# Use official Node.js image
FROM node:20 AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build the frontend
COPY . .
RUN npm run build

# Use nginx to serve the built frontend
FROM nginx:alpine

# Copy built files to nginx directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose the nginx port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]