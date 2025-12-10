import { useQuery } from '@tanstack/react-query'
import { QueueItem } from '@/types/api'
import axiosInstance from '@/api/axiosInstance'
import { ApiError } from '@/types/ApiError'

export function useHostQueuesQuery() {
  return useQuery<QueueItem[], ApiError>({
    queryKey: ['queues'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<QueueItem[]>('/queues')
      return data
    },
  })
}
