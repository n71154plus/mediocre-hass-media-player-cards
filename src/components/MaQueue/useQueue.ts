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
          target: { entity_id: entityId },
          service_data: {},
          return_response: true,
        };

        const res = await hass.connection.sendMessagePromise(message);
        const response = res as { response: Omit<MaQueueResponse, "items"> };
        if (!response.response) return;

        const { queue_id } = response.response;
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
          const itemsResponse = itemsRes as { response: { items: MaQueueItem[] } };
          items = itemsResponse.response?.items ?? [];
        } catch (e) {
          console.error("Error fetching queue items:", e);
        }

        setQueue({ ...response.response, items });
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

