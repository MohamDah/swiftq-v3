import { useQueryClient } from "@tanstack/react-query";
import { useEventSource } from "./useEventSource";
import { useEffect } from "react";
import { QueryKeys } from "@/queries/queryKeys";
import { CustomerEventDto } from "@/types/api";

interface CustomerESProps {
  qrCode?: string,
  sessionToken?: string,
  onMessage?: (data: CustomerEventDto) => boolean
}

export function useCustomerES({ qrCode, sessionToken, onMessage }: CustomerESProps) {
  const enabled = !!qrCode && !!sessionToken
  const { data } = useEventSource<CustomerEventDto>(enabled ? `entries/updates/${qrCode}/${sessionToken}` : '')
  const queryClient = useQueryClient()

  useEffect(() => {
    if (onMessage && data) {
      const reval = onMessage(data)
      if (!reval) return
    }
    queryClient.invalidateQueries({ queryKey: [QueryKeys.CUSTOMER_STATUS, qrCode] })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, qrCode, queryClient])
}