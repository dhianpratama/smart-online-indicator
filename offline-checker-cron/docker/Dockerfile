FROM node:10.15.3-alpine

RUN npm config set unsafe-perm true

# Global dependencies
RUN apk --no-cache add --virtual native-deps \
    g++ gcc libgcc libstdc++ linux-headers git make python && \
    npm install --quiet node-gyp -g

# App dependencies
WORKDIR /app
COPY package.json ./
RUN npm --allow-root install

# Remove unneeded dependencies
RUN apk del native-deps

# Build assets
COPY . ./

# Compile codes to dist
RUN npm run build

# Default runtime configs and helpers
EXPOSE 8080
CMD sync; /app/docker/start.sh
