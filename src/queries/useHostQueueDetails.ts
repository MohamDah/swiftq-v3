import { useQuery } from '@tanstack/react-query'

import axiosInstance from '@/api/axiosInstance'
import { HostQueueDetails } from '@/types/api'

import { QueryKeys } from './queryKeys'

export function useHostQueueDetailsQuery(queueId: string) {
  return useQuery({
    queryKey: [QueryKeys.HOST_QUEUE, queueId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<HostQueueDetails>(`queues/${queueId}/manage`)
      return data
    },
  })
}
