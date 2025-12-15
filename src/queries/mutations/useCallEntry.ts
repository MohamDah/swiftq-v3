import axiosInstance from "@/api/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../queryKeys";
import { toast } from "react-toastify";
import { displayError } from "@/utils/displayError";

export function useCallEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ entryId }: { entryId: string }) => {
      return axiosInstance.post(`entries/${entryId}/call`)
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKeys.CUSTOMER_STATUS] }),
        queryClient.invalidateQueries({ queryKey: [QueryKeys.HOST_QUEUE] }),
      ])
    },
    onError: error => {
      toast.error(displayError(error))
    }
  })
}