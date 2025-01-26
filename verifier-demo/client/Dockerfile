# Use the official Node.js image
FROM node:20-alpine

# Set the working directory
WORKDIR /bfc-status-demo/verifier-demo/client

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Expose port
EXPOSE 5173

# Command preview based on built files in /dist
CMD ["npm", "run", "preview"]
