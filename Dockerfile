# =========================================
# STAGE 1: Build the React application
# =========================================
FROM node:18-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the source code
COPY . .

# Build the app
RUN npm run build

# =========================================
# STAGE 2: Serve with Nginx
# =========================================
FROM nginx:stable-alpine AS runner

# Copy built files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config (we'll create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]