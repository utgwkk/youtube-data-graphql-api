import { GraphQLScalarType } from "graphql";

export const ISO8601DateTime = new GraphQLScalarType({
  name: "ISO8601DateTime",
});

export const ISO8601Duration = new GraphQLScalarType({
  name: "ISO8601Duration",
});
