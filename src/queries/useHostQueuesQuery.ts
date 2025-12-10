import { useQuery } from '@tanstack/react-query'
import { QueueItem } from '@/types/api'
import axiosInstance from '@/api/axiosInstance'
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
