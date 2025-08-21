import { useEffect, useMemo, useState } from "preact/hooks";
import { getHass } from "@utils";
import { MaQueueResponse } from "./types";

export const useQueue = (entityId: string) => {
  const [queue, setQueue] = useState<MaQueueResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!entityId) return;

    const fetchQueue = async () => {
      setLoading(true);
      const message = {
        type: "call_service",
        domain: "music_assistant",
        service: "get_queue",
        target: { entity_id: entityId },
        service_data: {},
        return_response: true,
      };

      const hass = getHass();
      try {
        const res = await hass.connection.sendMessagePromise(message);
        const response = res as { response: MaQueueResponse };
        if (response.response) {
          setQueue(response.response);
        }
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

