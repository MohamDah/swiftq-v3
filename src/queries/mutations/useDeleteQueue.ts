import axiosInstance from "@/api/axiosInstance";
import { displayError } from "@/utils/displayError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { QueryKeys } from "../queryKeys";


export function useDeleteQueueMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string }) => {
      return axiosInstance.delete(`queues/${id}`)
    },
    onError: (error) => {
      toast.error(displayError(error))
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.QUEUES]
        }),
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.HOST_QUEUE]
        }),
      ])
    }
  })
}