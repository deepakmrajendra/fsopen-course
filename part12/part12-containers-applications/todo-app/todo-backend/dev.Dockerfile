# Use Node.js as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install Nodemon globally for development
RUN npm install -g nodemon

# Copy the entire project (excluding files in .dockerignore)
COPY . .

# Set the environment variable to development mode
ENV NODE_ENV=development

# Expose the port
EXPOSE 3000

# Start the application using Nodemon
CMD ["nodemon", "--legacy-watch", "bin/www"]