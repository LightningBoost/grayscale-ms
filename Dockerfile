FROM node:latest

WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV=production

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
       --no-install-recommends \
    && apt-get install yarn -y \
    && apt-get install dumb-init -y \
    && rm -rf /var/lib/apt/lists/*

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
ENTRYPOINT ["dumb-init", "--"]
CMD ["yarn", "run", "start"]
