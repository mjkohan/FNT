FROM node:22-alpine3.21

WORKDIR /usr/src/app

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy package files
COPY package.json ./

# Install dependencies (including devDependencies for development)
RUN npm install --production=false

# Install Redis client dependencies
RUN npm install redis ioredis 

# Verify Prisma is installed
RUN npx prisma --version

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Use nodemon for development with live reload
CMD ["sh", "-c", "npm run db:deploy && nodemon --watch . --ext ts,js,json --exec 'npm run dev'"]