import { useEffect, useMemo, useState } from "preact/hooks";
import { getHass } from "@utils";
import { MaQueueItem, MaQueueResponse } from "./types";

export const useQueue = (entityId: string) => {
  const [queue, setQueue] = useState<MaQueueResponse>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!entityId) return;

    const fetchQueue = async () => {
      setLoading(true);

      const hass = getHass();
      try {
        if (!hass.services?.mass_queue?.get_queue_items) {
          throw new Error("Service mass_queue.get_queue_items not found");
        }

        const message = {
          type: "call_service",
          domain: "mass_queue",
          service: "get_queue_items",
          service_data: {
            entity: entityId,
          },
          return_response: true,
        };

        const res = await hass.connection.sendMessagePromise(message);
        const response = res as { response: Record<string, MaQueueItem[]> };
        const items = response.response?.[entityId] ?? [];
        setQueue(items);
      } catch (e) {
        console.error("Error fetching queue items:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, [entityId]);

  return useMemo(() => ({ queue, loading }), [queue, loading]);
};

