# Use an official Node runtime as the base image
FROM node:20-alpine

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS=--openssl-legacy-provider

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Install a simple server for serving static content
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Define the command to run the app
CMD ["serve", "-s", "build", "-l", "3000"]
