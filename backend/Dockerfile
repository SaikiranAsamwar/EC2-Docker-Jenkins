# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production mode)
RUN npm install --production

# Copy application files
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
