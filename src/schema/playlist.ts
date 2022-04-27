import { youtube_v3 } from "@googleapis/youtube";
import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType, GraphQLString
} from "graphql";
import { client as apiClient } from "../api-client";
import { ISO8601DateTime } from "./custom-scalar";
import { PlaylistItem } from "./playlist-item";
import { Channel } from "./channel";

export const Playlist: GraphQLObjectType<youtube_v3.Schema$Playlist> = new GraphQLObjectType({
  name: "Playlist",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve(source) {
        return source.id;
      },
    },
    items: <GraphQLFieldConfig<
      youtube_v3.Schema$Playlist, unknown, { first?: number; after?: string; }
    >>{
        type: new GraphQLNonNull(
          new GraphQLList(new GraphQLNonNull(PlaylistItem))
        ),
        args: {
          first: {
            type: GraphQLInt,
          },
          after: {
            type: GraphQLString,
          },
        },
        async resolve(source, { first = 5, after }) {
          const { data } = await apiClient.playlistItems.list({
            playlistId: source.id!,
            part: ["snippet", "contentDetails"],
            maxResults: first,
            pageToken: after,
          });

          return data.items;
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
  }),
});
