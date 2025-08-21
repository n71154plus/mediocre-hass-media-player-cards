export interface MaQueueItem {
  queue_item_id: string;
  name: string;
  media_item: {
    name: string;
    image?: string | null;
    album?: { image?: string | null };
    artists?: { name: string }[];
  };
}

export interface MaQueueResponse {
  queue_id: string;
  current_item: MaQueueItem | null;
  next_item: MaQueueItem | null;
  items?: MaQueueItem[];
}

