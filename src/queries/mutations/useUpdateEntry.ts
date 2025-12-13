import axiosInstance from "@/api/axiosInstance";
import { UpdateEntryDto } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../queryKeys";
import { toast } from "react-toastify";
import { displayError } from "@/utils/displayError";

export function useUpdateEntryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ entryId, ...dto }: UpdateEntryDto & { entryId: string }) => {
      return axiosInstance.patch(`entries/${entryId}`, dto)
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