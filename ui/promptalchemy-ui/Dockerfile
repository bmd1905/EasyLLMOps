# Use an official Node runtime as the base image
FROM node:22.6

# Set environment variable to fix the OpenSSL issue
ENV NODE_OPTIONS=--openssl-legacy-provider

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
