import { useEffect, useState } from 'react'

import { getEventSource } from '@/api/getEventSource'

export function useEventSource<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Event | null>(null)
  const [status, setStatus] = useState<'connecting' | 'error' | 'open' | 'closed'>('connecting')

  useEffect(() => {
    if (!url) return

    const eventSource = getEventSource(url)

    eventSource.addEventListener('open', () => {
      setStatus('open')
    })

    eventSource.addEventListener('message', event => {
      const parsedData = JSON.parse(event.data)
      setData(parsedData)
    })

    eventSource.addEventListener('error', err => {
      setError(err)
      setStatus('error')
      eventSource.close()
    })

    return () => {
      eventSource.close()
      setStatus('closed')
    }
  }, [url])

  return { data, error, status }
}
