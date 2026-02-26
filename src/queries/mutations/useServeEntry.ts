import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import axiosInstance from '@/api/axiosInstance'
import { displayError } from '@/utils/displayError'

import { QueryKeys } from '../queryKeys'

export function useServeEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ entryId }: { entryId: string }) =>
      axiosInstance.post(`entries/${entryId}/serve`),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKeys.CUSTOMER_STATUS] }),
        queryClient.invalidateQueries({ queryKey: [QueryKeys.HOST_QUEUE] }),
      ])
    },
    onError: error => {
      toast.error(displayError(error))
    },
  })
}
