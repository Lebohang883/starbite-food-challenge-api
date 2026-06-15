#Use Node.js version
FROM node:22-alpine

# Set working directory
WORKDIR /app

#Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .
# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "src/server.js"]