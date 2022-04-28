import { GraphQLEnumType } from "graphql";

export const ThumbnailKeyEnum = new GraphQLEnumType({
  name: "ThumbnailKeyEnum",
  values: {
    DEFAULT: {
      value: "DEFAULT",
    },
    MEDIUM: {
      value: "MEDIUM",
    },
    HIGH: {
      value: "HIGH",
    },
  },
});

export type ThumbnailKeyEnumType = "DEFAULT" | "MEDIUM" | "HIGH";
