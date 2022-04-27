import { youtube_v3 } from "@googleapis/youtube";
import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { client as apiClient } from "../api-client";
import { videoLoader } from "../dataloader";

import { Channel } from "./channel";
import { ISO8601DateTime } from "./custom-scalar";
import { Video } from "./video";

export const PlaylistItem: GraphQLObjectType<youtube_v3.Schema$PlaylistItem> =
  new GraphQLObjectType({
    name: "PlaylistItem",
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
      channel: {
        type: Channel,
        async resolve(source, args, context) {
          const { data } = await apiClient.channels.list({
            id: [source.snippet!.channelId!],
            part: ["snippet", "contentDetails"],
          });

          if (!data.items) {
            return null;
          }

          return data.items[0];
        },
      },
      position: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve(source) {
          return source.snippet!.position;
        },
      },
      video: {
        type: new GraphQLNonNull(Video),
        resolve(source) {
          return videoLoader.load(source.contentDetails!.videoId!);
        },
      },
      startAt: {
        type: GraphQLInt,
        resolve(source) {
          return source.contentDetails!.startAt;
        },
      },
      endAt: {
        type: GraphQLInt,
        resolve(source) {
          return source.contentDetails!.endAt;
        },
      },
      note: {
        type: GraphQLString,
        resolve(source) {
          return source.contentDetails!.note;
        },
      },
    }),
  });
