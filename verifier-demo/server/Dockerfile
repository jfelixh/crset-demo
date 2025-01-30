FROM node:20.13.1

# Set the working directory inside the container
WORKDIR /bfc-status-demo/verifier-demo/server

# Install sqlite3
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm packages
RUN npm ci

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the server will listen on
EXPOSE 8080 8090

# Initialize sqliteDB and start the Express server
CMD ["sh", "-c", "npm run db:init && exec npm run dev"]