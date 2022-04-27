import { GraphQLSchema } from "graphql";

import { Query } from "./query";

export const schema = new GraphQLSchema({
  query: Query,
});
