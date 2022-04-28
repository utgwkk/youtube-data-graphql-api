import { youtube_v3 } from "@googleapis/youtube";
import DataLoader from "dataloader";

import { client as apiClient } from "./api-client";

export const videoLoader = new DataLoader<
  string,
  youtube_v3.Schema$Video | null
>(async (keys) => {
  console.debug("batch load videos");
  const chunkedKeys = chunk(keys, 50);
  const responses = await Promise.all(
    chunkedKeys.map((keys) =>
      apiClient.videos.list({
        id: keys.slice(),
        part: ["snippet", "contentDetails"],
      })
    )
  );
  const items = responses.flatMap((resp) => resp.data.items ?? []);

  const itemByKey = new Map(items.map((item) => [item.id!, item]));
  return keys.map((key) => itemByKey.get(key) ?? null);
});

const chunk = <T>(xs: readonly T[], size: number): T[][] => {
  const chunks: T[][] = [];

  xs.forEach((x, i) => {
    if (i === 0) {
      chunks.push([x]);
      return;
    }

    const lastChunk = chunks[chunks.length - 1];
    if (lastChunk.length >= size) {
      chunks.push([x]);
    } else {
      lastChunk.push(x);
    }
  });

  return chunks;
};
