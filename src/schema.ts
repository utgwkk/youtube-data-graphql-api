import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import fetch from "node-fetch";

import { Channel as ChannelSource } from "./source";

const ISO8601DateTime = new GraphQLScalarType({
  name: "ISO8601DateTime",
});

const Channel = new GraphQLObjectType<ChannelSource>({
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
        return source.snippet.title;
      },
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(source) {
        return source.snippet.description;
      },
    },
    publishedAt: {
      type: new GraphQLNonNull(ISO8601DateTime),
      resolve(source) {
        return source.snippet.publishedAt;
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
          const url = buildRequestURL({ resource: "channels", id });
          const resp = await fetch(url);
          const data = (await resp.json()) as any;

          if (!data.items) {
            return null;
          }

          return data.items[0];
        },
      },
    },
  }),
});

const buildRequestURL = ({
  resource,
  id,
}: {
  resource: string;
  id: string;
}) => {
  return `https://www.googleapis.com/youtube/v3/${resource}?key=${process.env.API_KEY}&id=${id}&part=id,snippet&filter=*`;
};
