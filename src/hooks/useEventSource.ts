import { getEventSource } from "@/api/getEventSource";
import { useEffect, useState } from "react";

export function useEventSource<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Event | null>(null);
  const [status, setStatus] = useState<'connecting' | 'error' | 'open' | 'closed'>("connecting");

  useEffect(() => {
    if (!url) return

    const eventSource = getEventSource(url);

    eventSource.onopen = () => {
      setStatus("open")
    };

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setData(parsedData);
    };

    eventSource.onerror = (err) => {
      setError(err);
      setStatus("error");
      eventSource.close();
    };

    return () => {
      eventSource.close();
      setStatus("closed");
    };
  }, [url]);

  return { data, error, status };
}