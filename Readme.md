# Grayscale microservice

This is a microservice project to query data from Grayscale and save it in a PostgreSQL database. It exposes a GraphQL route at root, with a query to fetch all data stored in the database. This microservice fuels [LightningBoost](https://lightningboost.info/grayscale) dataset.

This project uses puppeteer, so it depends on Chromium to run. The Dockerfile automatically install all necessary dependencies. Unfortunately due to compatibility issues, it will download two versions of node `slim` and `alpine`.

There are two `docker-compose` files in this repository, one for production and one for development. The development version will install `prisma studio` and expose the port 5555, binding to the 5555 port of the host.

To use this project, you must define environment variables:

```
DATABASE_URL="postgresql://postgres:admin@postgres:5432/postgres"
POSTGRES_PASSWORD=admin
```

The database won't be exposed to external connections, it will only be accessible by this stack.
