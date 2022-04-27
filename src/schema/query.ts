import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { client as apiClient } from "../api-client";
import { Channel } from "./channel";

export const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    hello: {
      type: GraphQLString,
      resolve() {
        return "Hello, world!";
      },
    },
    channel: <GraphQLFieldConfig<unknown, unknown, { id: string }>>{
      type: Channel,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      async resolve(source, args, context, info) {
        const { id } = args;
        const { data } = await apiClient.channels.list({
          id: [id],
          part: ["snippet", "contentDetails"],
        });

        if (!data.items) {
          return null;
        }

        return data.items[0];
      },
    },
  },
});
