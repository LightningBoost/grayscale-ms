FROM node:lts-slim

WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV=production

RUN apt-get update

# Install Chromium
RUN apt-get install chromium -y

# Install yarn
RUN apt-get install yarn -y

COPY package.json /app/package.json
RUN yarn install --silent

# Add app
COPY . /app

# Generate prisma
RUN yarn run generate

# Build the app
RUN yarn build

EXPOSE 4000

# Start the app
CMD ["yarn", "run", "migrate:prod"]
CMD ["yarn", "run", "start"]
