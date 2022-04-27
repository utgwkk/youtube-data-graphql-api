import { GraphQLEnumType } from "graphql";

export const RelatedPlaylistKeyEnum = new GraphQLEnumType({
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
