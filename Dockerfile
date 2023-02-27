# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Bundle app source code
COPY . .

# Install app dependencies
RUN npm install --force

# Expose port 3000 for the Nest.js app
EXPOSE 3000

# Install the Postgres database
RUN apt-get update && apt-get install -y postgresql postgresql-contrib

# Install the Prisma ORM
RUN npm install prisma -D

# Set the default command to start the Nest.js app and the Postgres database
CMD npm run start:prod