import { useEffect, useRef } from 'react'

export function useAudio(path = '/notification-sound.mp3') {
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null)
  useEffect(() => {
    notificationSoundRef.current = new Audio(path)
    return () => {
      // Cleanup if needed
      if (notificationSoundRef.current) {
        notificationSoundRef.current.pause()
        notificationSoundRef.current = null
      }
    }
  }, [path])

  function playAudio() {
    if (notificationSoundRef.current) {
      notificationSoundRef.current.currentTime = 0
      notificationSoundRef.current.play()
    }
  }

  return { playAudio }
}
