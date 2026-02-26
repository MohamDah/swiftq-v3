import { apiUrl } from '@/utils/apiUrl'

export const getEventSource = (path: string) => new EventSource(`${apiUrl}${path}`)
