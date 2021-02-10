FROM node:lts-alpine

RUN npm install -g prisma

RUN mkdir /app
WORKDIR /app

COPY ./ ./

CMD ["prisma", "studio"]
