import { io } from 'socket.io-client'

import { apiUrl } from '@/utils/apiUrl'
import { getAuthToken } from '@/utils/auth'

const baseUrl = apiUrl.replace(/\/$/, '')

export const createQueueSocket = (queueId: string) =>
  io(`${baseUrl}/queue`, {
    autoConnect: false,
    auth: { token: getAuthToken(), queueId },
  })

export const createEntrySocket = (qrCode: string, sessionToken: string) =>
  io(`${baseUrl}/entry`, {
    autoConnect: false,
    auth: { qrCode, sessionToken },
  })
