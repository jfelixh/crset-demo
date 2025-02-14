FROM node:20.18.3

WORKDIR /app

# Install sqlite3
RUN apt-get update && apt-get install -y --no-install-recommends sqlite3 && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port 3000
EXPOSE 3000

# Start development server
CMD ["sh", "-c", "npm run db:init && npm run dev"]
