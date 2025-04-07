# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install NPM version specified in package.json
RUN npm install -g npm@10.5.2

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Copy the .env file
COPY .env .env

# Generate Prisma client
RUN npx prisma generate

# Check Prisma client installation
RUN ls -la node_modules/@prisma/client

# Build the application
RUN npm run build

# Expose the port your application runs on (change if necessary)
EXPOSE 3000

# Specify the command to run your application
CMD ["npm", "start"]
