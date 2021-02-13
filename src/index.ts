import dotenv from 'dotenv';
import { ApolloServer, gql } from 'apollo-server';
import { GraphQLDateTime } from 'graphql-iso-date';
import cron from 'node-cron';
import prisma from './database';
import queryGrayscale from './jobs/queryGrayscale';

dotenv.config();

const serverPort = 4000;

// graphql definitions
const typeDefs = gql`
  scalar Date

  # This entity represents all Grayscale purchases
  type Grayscale {
    id: ID!
    date: Date!
    shares: Float!
    bitcoinsPerShare: Float!
    fiat: Float!
    bought: Float!
    bitcoinPrice: Float!
  }

  type Query {
    allPurchases: [Grayscale!]!
  }
`;

const resolvers = {
  Date: GraphQLDateTime,
  Query: {
    allPurchases: () => prisma.purchases.findMany(),
  },
};

const server = new ApolloServer({ resolvers, typeDefs });

// cron job definition
cron.schedule('0 19 * * *', () => queryGrayscale(), {
  timezone: 'America/Sao_Paulo',
});

server.listen({ port: serverPort }, () => {
  console.log(`Server listening at ${serverPort}`); // eslint-disable-line
});
