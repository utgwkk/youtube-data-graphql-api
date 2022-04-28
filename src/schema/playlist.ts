import { youtube_v3 } from "@googleapis/youtube";
import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import {
  Connection,
  ConnectionArguments,
  forwardConnectionArgs,
} from "graphql-relay";

import { client as apiClient } from "../api-client";

import { Channel } from "./channel";
import { ISO8601DateTime } from "./custom-scalar";
import { PlaylistItemConnection } from "./playlist-item";

const connectionFromAPIResponse = (
  data: youtube_v3.Schema$PlaylistItemListResponse
): Connection<youtube_v3.Schema$PlaylistItem> => {
  const edges = (data.items ?? []).map((item) => ({
    node: item,
    cursor: "",
  }));

  return {
    edges,
    pageInfo: {
      startCursor: data.prevPageToken ?? null,
      endCursor: data.nextPageToken ?? null,
      hasNextPage: !!data.nextPageToken,
      hasPreviousPage: !!data.prevPageToken,
    },
  };
};

export const Playlist: GraphQLObjectType<youtube_v3.Schema$Playlist> =
  new GraphQLObjectType({
    name: "Playlist",
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLID),
        resolve(source) {
          return source.id;
        },
      },
      items: {
        type: PlaylistItemConnection,
        args: forwardConnectionArgs,
        async resolve(source, { first = 5, after }: ConnectionArguments) {
          const { data } = await apiClient.playlistItems.list({
            playlistId: source.id!,
            part: ["snippet", "contentDetails"],
            maxResults: first ?? 5,
            ...(after ? { pageToken: after } : {}),
          });

          return connectionFromAPIResponse(data);
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
