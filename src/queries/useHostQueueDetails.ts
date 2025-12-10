import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./queryKeys";
import axiosInstance from "@/api/axiosInstance";
import { HostQueueDetails } from "@/types/api";

export function useHostQueueDetailsQuery(queueId: string) {
  return useQuery({
    queryKey: [QueryKeys.HOST_QUEUE, queueId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<HostQueueDetails>(`queues/${queueId}/manage`)
      return data
    }
  })
}