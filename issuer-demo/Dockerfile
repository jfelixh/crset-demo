FROM node:20.13.1

WORKDIR /app

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
