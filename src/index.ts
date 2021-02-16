import dotenv from 'dotenv';
import { ApolloServer, gql } from 'apollo-server';
import { GraphQLDateTime } from 'graphql-iso-date';
import cron from 'node-cron';
import prisma from './database';
import queryGrayscale from './jobs/queryGrayscale';
import { Resolvers } from './generated/graphql';

dotenv.config();

const serverPort = 4000;

// graphql definitions
const typeDefs = gql`
  scalar Date

  input PurchaseFilter {
    id: ID
    date: Date
  }

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
    allPurchases(skip: Int, take: Int): [Grayscale!]!
    getPurchase(filter: PurchaseFilter, skip: Int, take: Int): [Grayscale]
  }
`;

const resolvers: Resolvers = {
  Date: GraphQLDateTime,
  Query: {
    allPurchases: (parent, args, context) =>
      context.prisma.purchases.findMany({ skip: args.skip, take: args.take }),
    getPurchase: (parent, args, context) => {
      const where = args.filter
        ? {
            AND: [
              { date: { contains: args.filter } },
              { id: { contains: args.filter } },
            ],
          }
        : {};
      return context.prisma.purchases.findMany({
        where,
        skip: args.skip,
        take: args.take,
      });
    },
  },
};

const server = new ApolloServer({ resolvers, typeDefs, context: { prisma } });

// cron job definition
cron.schedule('50 20 * * *', () => queryGrayscale(), {
  timezone: 'America/Sao_Paulo',
});

server.listen({ port: serverPort }, () => {
  console.log(`Server listening at ${serverPort}`); // eslint-disable-line
});
