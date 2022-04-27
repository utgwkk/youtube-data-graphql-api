import { youtube_v3 } from "@googleapis/youtube";
import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { client as apiClient } from "../api-client";
import { RelatedPlaylistKeyEnum } from "./enum/related-playlist-key-enum";
import { Playlist } from "./playlist";
import { ISO8601DateTime } from "./custom-scalar";

export const Channel: GraphQLObjectType<youtube_v3.Schema$Channel> =
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
