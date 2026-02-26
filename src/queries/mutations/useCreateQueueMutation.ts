import { useMutation, useQueryClient } from '@tanstack/react-query'

import axiosInstance from '@/api/axiosInstance'
import { QueueItem } from '@/types/api'

export interface CreateQueueProps {
  name: string
  requireNames?: boolean
}
async function createQueue(body: CreateQueueProps) {
  const { data } = await axiosInstance.post('/queues', body)
  return data as QueueItem
}

export function useCreateQueueMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createQueue,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['queues'] })
    },
  })
}
