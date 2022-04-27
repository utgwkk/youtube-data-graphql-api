export type Channel = {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnail: {
      default: Thumbnail;
      medium: Thumbnail;
      high: Thumbnail;
    };
  };
};

export type Thumbnail = {
  url: string;
  width: number;
  height: number;
};
