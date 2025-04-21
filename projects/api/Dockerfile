FROM node:18

WORKDIR /app

# Copy the root package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Copy the /api package.json into the container to include /api-specific dependencies
COPY ./projects/api/package.json ./projects/api/package.json

# Install the /api workspace dependencies specifically
RUN npm install --workspace projects/api

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
