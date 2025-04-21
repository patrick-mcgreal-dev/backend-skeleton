FROM node:18

WORKDIR /app

# Copy the root package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Copy the /worker package.json into the container to include /worker-specific dependencies
COPY ./projects/worker/package.json ./projects/worker/package.json

# Install the /worker workspace dependencies specifically
RUN npm install --workspace projects/worker

COPY . .

CMD ["npm", "run", "start:dev"]
