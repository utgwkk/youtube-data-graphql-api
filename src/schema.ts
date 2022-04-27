import type { youtube_v3 } from "@googleapis/youtube";
import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

import { client as apiClient } from "./api-client";

const ISO8601DateTime = new GraphQLScalarType({
  name: "ISO8601DateTime",
});

const Channel = new GraphQLObjectType<youtube_v3.Schema$Channel>({
  name: "Channel",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve(source) {
        return source.id;
      },
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(source) {
        return source.snippet!.title;
      },
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(source) {
        return source.snippet!.description;
      },
    },
    publishedAt: {
      type: new GraphQLNonNull(ISO8601DateTime),
      resolve(source) {
        return source.snippet!.publishedAt;
      },
    },
    // TODO:
  },
});

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
            part: ["snippet"],
          });

          if (!data.items) {
            return null;
          }

          return data.items[0];
        },
      },
    },
  }),
});
