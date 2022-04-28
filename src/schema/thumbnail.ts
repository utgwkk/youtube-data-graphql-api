import { youtube_v3 } from "@googleapis/youtube";
import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

export const Thumbnail: GraphQLObjectType<youtube_v3.Schema$Thumbnail> =
  new GraphQLObjectType({
    name: "Thumbnail",
    fields: () => ({
      url: {
        type: new GraphQLNonNull(GraphQLString),
        resolve(source) {
          return source.url;
        },
      },
      width: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve(source) {
          return source.width;
        },
      },
      height: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve(source) {
          return source.height;
        },
      },
    }),
  });
