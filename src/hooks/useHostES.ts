import { useQueryClient } from "@tanstack/react-query";
import { useEventSource } from "./useEventSource";
import { useEffect, useMemo } from "react";
import { QueryKeys } from "@/queries/queryKeys";
import { getAuthToken } from "@/utils/auth";

export function useHostES({ queueId }: { queueId?: string }) {
  const token = useMemo(() => getAuthToken(), [])
  const { data } = useEventSource(queueId ? `queues/updates/${queueId}?token=${token}` : '')
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [QueryKeys.HOST_QUEUE, queueId] })
  }, [data, queueId, queryClient])
}