import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { createQueueSocket } from '@/api/socketInstance'
import { QueryKeys } from '@/queries/queryKeys'

export function useHostSocket({ queueId }: { queueId?: string }) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!queueId) return

    const socket = createQueueSocket(queueId)
    socket.connect()

    socket.on('queue-update', () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.HOST_QUEUE, queueId] })
    })

    return () => {
      socket.disconnect()
    }
  }, [queueId, queryClient])
}
