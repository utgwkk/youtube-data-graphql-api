import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import * as fs from "fs";
import path from "path";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return "Hello, world!";
        },
      },
    },
  }),
});
