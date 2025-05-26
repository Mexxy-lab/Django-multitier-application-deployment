# Use official Node.js image
FROM node:22-alpine

# Set work directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy everything else
COPY . .
COPY .env .env

# Expose port 3001
EXPOSE 3001

# Set React app to run on port 3001
ENV PORT=3001

# Start React application
CMD ["npm", "start"]
