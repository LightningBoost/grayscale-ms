FROM node:lts-alpine

WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV=production

# Install Chromium
RUN apk add chromium

# Install yarn
RUN apk add yarn

COPY package.json /app/package.json
RUN yarn install --silent

# Add app
COPY . /app

# Generate prisma
RUN yarn run generate

# Build the app
RUN yarn build

