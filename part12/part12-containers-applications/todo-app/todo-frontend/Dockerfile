# Step 1: Install Dependencies and Run Tests
FROM node:20 AS test-stage

WORKDIR /usr/src/app
COPY . .
RUN npm install

# Run tests using Vitest
RUN npm test

# Step 2: Build Stage
FROM node:20 AS build-stage

WORKDIR /usr/src/app
COPY . .

RUN npm ci

# Set backend URL before building
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Build the frontend
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:1.25-alpine

# Copy the built frontend from previous stage
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

# Expose the default port
EXPOSE 80

# Default Nginx CMD
CMD ["nginx", "-g", "daemon off;"]