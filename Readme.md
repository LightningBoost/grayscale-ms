# Grayscale microservice

This is a microservice project do query data from Grayscale and save it in a PostgreSQL database. It exposes a GraphQL route at root, with a query to fetch all data stored in the database. This microservice fuels [LightningBoost](https://lightningboost.info/grayscale) dataset.

This project uses puppeteer, so it depends on Chromium to run. The Dockerfile automatically install all necessary dependencies.

To use this project, you must define environment variables:

```
DATABASE_URL="postgresql://USER:PASSWORD@IP:PORT/DATABASE?schema=SCHEMA"
PORT=4001
```
