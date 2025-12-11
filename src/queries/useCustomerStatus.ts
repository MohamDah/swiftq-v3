import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./queryKeys";
import { CustomerStatus } from "@/types/api";
import { getPositionToken } from "@/utils/customerStorage";
import axiosInstance from "@/api/axiosInstance";

export function useCustomerStatus(qrCode: string | null) {
  return useQuery({
    queryKey: [QueryKeys.CUSTOMER_STATUS, qrCode],
    queryFn: async () => {
      const posToken = getPositionToken(qrCode || '')
      const { data } = await axiosInstance.get<CustomerStatus>(`queues/entry-status/${posToken}`)
      return data
    },
    enabled: !!qrCode
  })
}