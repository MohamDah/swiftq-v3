import axiosInstance from "@/api/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { displayError } from "@/utils/displayError";
import { invalidateEntryQueries } from "./helpers";

export function useCallEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ entryId }: { entryId: string }) => {
      return axiosInstance.post(`entries/${entryId}/call`)
    },
    onSuccess: async () => {
      await invalidateEntryQueries(queryClient)
    },
    onError: error => {
      toast.error(displayError(error))
    }
  })
}