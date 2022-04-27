import { youtube_v3 } from "@googleapis/youtube";
import DataLoader from "dataloader";

import { client as apiClient } from "./api-client";

export const videoLoader = new DataLoader<
  string,
  youtube_v3.Schema$Video | null
>(async (keys) => {
  console.debug("batch load videos");
  const { data } = await apiClient.videos.list({
    id: keys.slice(),
    part: ["snippet", "contentDetails"],
  });

  if (!data.items) {
    return [];
  }

  const itemByKey = new Map(data.items.map((item) => [item.id!, item]));
  return keys.map((key) => itemByKey.get(key) ?? null);
});
