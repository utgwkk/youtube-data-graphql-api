import { youtube_v3 } from "@googleapis/youtube";
import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { ISO8601DateTime, ISO8601Duration } from "./custom-scalar";

export const Video: GraphQLObjectType<youtube_v3.Schema$Video> =
  new GraphQLObjectType({
    name: "Video",
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLID),
        resolve(source) {
          return source.id;
        },
      },
      title: {
        type: GraphQLString,
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
      tags: {
        type: new GraphQLNonNull(
          new GraphQLList(new GraphQLNonNull(GraphQLString))
        ),
        resolve(source) {
          return source.snippet!.tags;
        },
      },
      duration: {
        type: new GraphQLNonNull(ISO8601Duration),
        resolve(source) {
          return source.contentDetails!.duration;
        },
      },
    }),
  });
