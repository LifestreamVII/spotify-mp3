# Base image
FROM node:18

# Set working directory
WORKDIR /server

# Copy package.json and package-lock.json
COPY package.json ./

# Copy server files
COPY . .

# Install dependencies
RUN cd /server
RUN npm install -g nodemon
RUN npm install

# Start the server
CMD ["nodemon", "app"]