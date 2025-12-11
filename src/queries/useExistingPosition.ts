import { getPositionToken } from "@/utils/customerStorage";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./queryKeys";
import axiosInstance from "@/api/axiosInstance";
import { ExistingPosResponse } from "@/types/api";

export function useExistingPositionQuery(qrCode = '') {
  const sessionId = getPositionToken(qrCode)
  console.log(sessionId)
  return useQuery({
    queryKey: [QueryKeys.EXISTING_POS, qrCode],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ExistingPosResponse>(
        `queues/${qrCode}/check-entry?token=${sessionId}`
      )
      return data
    }
  })
}