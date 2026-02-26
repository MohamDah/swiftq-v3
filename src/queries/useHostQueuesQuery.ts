import { useQuery } from '@tanstack/react-query'

import axiosInstance from '@/api/axiosInstance'
import { QueueItem } from '@/types/api'
import { ApiError } from '@/types/ApiError'

import { QueryKeys } from './queryKeys'

export function useHostQueuesQuery() {
  return useQuery<QueueItem[], ApiError>({
    queryKey: [QueryKeys.QUEUES],
    queryFn: async () => {
      const { data } = await axiosInstance.get<QueueItem[]>('/queues')
      return data
    },
  })
}
