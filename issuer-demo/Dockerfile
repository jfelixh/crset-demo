FROM node:20.13.1

WORKDIR /bfc-status-demo/issuer-demo/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port 3000
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev", "--", "-p", "3000"]
