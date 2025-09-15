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


#////////////////////////////////////////////////////
# FROM node:22-alpine3.21 AS build

# WORKDIR /usr/src/app

# # Copy package files
# COPY package.json package-lock.json* ./

# # Install all dependencies (needed for build: typescript, prisma, etc.)
# RUN npm install

# # Copy the rest of the application
# COPY . .

# # Generate Prisma client
# RUN npx prisma generate

# # Build TypeScript to dist/
# RUN npm run build


# # -------- Production Image --------
# FROM node:22-alpine3.21 AS prod

# WORKDIR /usr/src/app

# # Copy only package files
# COPY package.json package-lock.json* ./

# # Install only production dependencies
# RUN npm install --production=true

# # Copy dist (compiled JS) and Prisma stuff
# COPY --from=build /usr/src/app/dist ./dist
# COPY --from=build /usr/src/app/prisma ./prisma
# COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# # Expose port
# EXPOSE 3000

# # Run migrations and start app
# CMD ["sh", "-c", "npm run db:deploy && npm run start"]

#////////////////////////////////////////////////////

# FROM node:22-alpine3.21

# WORKDIR /usr/src/app

# COPY package.json package-lock.json ./

# RUN npm ci

# COPY . .

# CMD ["sh", "-c", "npm run db:deploy && npm run dev"]
