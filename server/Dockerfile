FROM node:22-alpine3.21

WORKDIR /usr/src/app

# Copy package files
COPY package.json ./

# Install dependencies (production only)
RUN npm install --only=production

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
