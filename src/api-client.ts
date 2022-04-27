import { youtube_v3 } from "@googleapis/youtube";

export const client = new youtube_v3.Youtube({
  auth: process.env.API_KEY,
});
