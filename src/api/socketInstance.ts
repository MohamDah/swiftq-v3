import { io } from 'socket.io-client'

import { apiUrl } from '@/utils/apiUrl'
import { getAuthToken } from '@/utils/auth'

export const createQueueSocket = (queueId: string) =>
  io(`${apiUrl}/queue`, {
    autoConnect: false,
    auth: { token: getAuthToken(), queueId },
  })

export const createEntrySocket = (qrCode: string, sessionToken: string) =>
  io(`${apiUrl}/entry`, {
    autoConnect: false,
    auth: { qrCode, sessionToken },
  })
