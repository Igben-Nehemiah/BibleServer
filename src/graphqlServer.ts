import { ApolloServer } from "apollo-server-express";
import express from "express";
import { readFileSync } from "fs";
import { join } from "path";
import resolvers from "./graphql/resolvers";

const typeDefs = readFileSync(join(__dirname, "./schema.graphql"), "utf8");

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const app = express();

server.applyMiddleware( {app})

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);