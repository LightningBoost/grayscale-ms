import { ApolloServer, gql } from 'apollo-server';
import { GraphQLDateTime } from 'graphql-iso-date';

const typeDefs = gql`
  scalar Date

  # This entity represent all Grayscale purchases
  type Grayscale {
    id: ID!
    date: Date!
    amount: Float!
  }

  type Query {
    purchases: [Grayscale!]
  }
`;

const resolvers = {
  Date: GraphQLDateTime,
};

const server = new ApolloServer({});
