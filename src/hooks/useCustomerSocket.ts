import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

import { createEntrySocket } from '@/api/socketInstance'
import { QueryKeys } from '@/queries/queryKeys'
import { EntryUpdatePayload } from '@/types/api'

interface CustomerSocketProps {
  qrCode?: string
  sessionToken?: string
  onMessage?: (data: EntryUpdatePayload) => boolean
}

export function useCustomerSocket({ qrCode, sessionToken, onMessage }: CustomerSocketProps) {
  const queryClient = useQueryClient()
  const onMessageRef = useRef(onMessage)

  useEffect(() => {
    onMessageRef.current = onMessage
  })

  useEffect(() => {
    if (!qrCode || !sessionToken) return

    const socket = createEntrySocket(qrCode, sessionToken)
    socket.connect()

    socket.on('entry-update', (data: EntryUpdatePayload) => {
      if (onMessageRef.current) {
        const shouldInvalidate = onMessageRef.current(data)
        if (!shouldInvalidate) return
      }
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CUSTOMER_STATUS, qrCode] })
    })

    return () => {
      socket.disconnect()
    }
  }, [qrCode, sessionToken, queryClient])
}
