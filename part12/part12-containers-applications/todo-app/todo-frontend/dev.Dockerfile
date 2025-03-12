FROM node:20

WORKDIR /usr/src/app

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

# Expose port 5173 for the Vite development server
EXPOSE 5173

# Start Vite in development mode and allow external access
CMD ["npm", "run", "dev", "--", "--host"]