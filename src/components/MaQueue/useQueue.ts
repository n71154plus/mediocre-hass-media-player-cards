import { useEffect, useMemo, useState } from "preact/hooks";
import { getHass } from "@utils";
import { MaQueueItem, MaQueueResponse } from "./types";

export const useQueue = (entityId: string) => {
  const [queue, setQueue] = useState<MaQueueResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!entityId) return;

    const fetchQueue = async () => {
      setLoading(true);

      const hass = getHass();
      try {
        const message = {
          type: "call_service",
          domain: "music_assistant",
          service: "get_queue",
          service_data: { entity_id: entityId },
          return_response: true,
        };

        const res = await hass.connection.sendMessagePromise(message);
        const response = res as {
          response: { [key: string]: Omit<MaQueueResponse, "items"> };
        };
        const queueResponse = response.response?.[entityId];
        if (!queueResponse) return;

        const { queue_id } = queueResponse;
        let items: MaQueueItem[] = [];

        try {
          const itemsMessage = {
            type: "call_service",
            domain: "music_assistant",
            service: "get_queue_items",
            service_data: {
              queue_id,
              limit: 1000,
            },
            return_response: true,
          };
          const itemsRes = await hass.connection.sendMessagePromise(itemsMessage);
          const itemsResponse = itemsRes as {
            response: Record<string, unknown>;
          };
          items =
            (itemsResponse.response?.items as MaQueueItem[] | undefined) ??
            (
              (itemsResponse.response?.[queue_id] as { items?: MaQueueItem[] } | undefined)
                ?.items
            ) ??
            [];
        } catch (e) {
          console.error("Error fetching queue items:", e);
        }

        setQueue({ ...queueResponse, items });
      } catch (e) {
        console.error("Error fetching queue:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, [entityId]);

  return useMemo(() => ({ queue, loading }), [queue, loading]);
};

