# Stage 1: Build the app
FROM node:18-alpine3.17 AS build
# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies.
RUN npm install --production

# Copy the source code of the Express.js app
COPY . .
# --- Run Stage ---
FROM node:18-alpine3.17

WORKDIR /app

# Copy node_modules from build stage
COPY --from=build /app/node_modules ./node_modules

# Copy the source code from build stage
COPY --from=build /app . 

# The app listens on port 3000
EXPOSE 3000

CMD ["node", "server.js"]
