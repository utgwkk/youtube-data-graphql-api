import { youtube_v3 } from "@googleapis/youtube";
import {
  GraphQLEnumType,
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
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

const PlaylistItem: GraphQLObjectType<youtube_v3.Schema$PlaylistItem> =
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

const Playlist: GraphQLObjectType<youtube_v3.Schema$Playlist> =
  new GraphQLObjectType({
    name: "Playlist",
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLID),
        resolve(source) {
          return source.id;
        },
      },
      items: <
        GraphQLFieldConfig<
          youtube_v3.Schema$Playlist,
          unknown,
          { first?: number; after?: string }
        >
      >{
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

const RelatedPlaylistKeyEnum = new GraphQLEnumType({
  name: "RelatedPlaylistKeyEnum",
  values: {
    LIKES: {
      value: "LIKES",
    },
    UPLOADS: {
      value: "UPLOADS",
    },
    FAVORITES: {
      value: "FAVORITES",
    },
    WATCH_HISTORY: {
      value: "WATCH_HISTORY",
    },
    WATCH_LATER: {
      value: "WATCH_LATER",
    },
  },
});

const Channel: GraphQLObjectType<youtube_v3.Schema$Channel> =
  new GraphQLObjectType({
    name: "Channel",
    fields: () => ({
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
      relatedPlaylist: <
        GraphQLFieldConfig<youtube_v3.Schema$Channel, unknown, { key: string }>
      >{
        type: Playlist,
        args: {
          key: {
            type: new GraphQLNonNull(RelatedPlaylistKeyEnum),
          },
        },
        async resolve(source, args) {
          const { key } = args;
          let id: string | undefined;
          switch (key) {
            case "UPLOADS":
              id = source.contentDetails!.relatedPlaylists!.uploads;
              break;
            case "LIKES":
              id = source.contentDetails!.relatedPlaylists!.likes;
              break;
            case "FAVORITES":
              id = source.contentDetails!.relatedPlaylists!.favorites;
              break;
            case "WATCH_HISTORY":
              id = source.contentDetails!.relatedPlaylists!.watchHistory;
              break;
            case "WATCH_LATER":
              id = source.contentDetails!.relatedPlaylists!.watchLater;
              break;
            default:
              throw new Error(`Invalid key: ${key}`);
          }

          if (!id) {
            return null;
          }

          const { data } = await apiClient.playlists.list({
            id: [id],
            part: ["snippet", "contentDetails"],
          });

          if (!data.items) {
            return null;
          }

          return data.items[0];
        },
      },
      // TODO:
    }),
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
            part: ["snippet", "contentDetails"],
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
