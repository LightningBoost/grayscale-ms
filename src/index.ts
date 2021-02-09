import { ApolloServer, gql } from 'apollo-server';
import { GraphQLDateTime } from 'graphql-iso-date';
import prisma from './database';

const serverPort = 4001;

const typeDefs = gql`
  scalar Date

  # This entity represents all Grayscale purchases
  type Grayscale {
    id: ID!
    date: Date!
    amount: Float!
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

server.listen({ port: serverPort }, () => {
  console.log(`Server listening at ${serverPort}`); // eslint-disable-line
});
