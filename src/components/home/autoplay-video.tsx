'use client'

import {useEffect, useRef} from 'react'

export function AutoplayVideo({
  src,
  poster,
  className,
}: {
  src: string
  poster?: string
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true

    const tryPlay = () => {
      if (video.paused) {
        void video.play().catch(() => {})
      }
    }

    tryPlay()

    if (poster) {
      video.setAttribute('poster', poster)
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay()
      },
      {threshold: 0.2},
    )
    observer.observe(video)

    document.addEventListener('visibilitychange', onVisibility)
    document.addEventListener('touchstart', tryPlay, {passive: true, once: true})
    document.addEventListener('click', tryPlay, {once: true})

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      document.removeEventListener('touchstart', tryPlay)
      document.removeEventListener('click', tryPlay)
    }
  }, [src, poster])

  const mediaSrc = poster
    ? `${src}${src.includes('?') ? '&' : '?'}poster=${encodeURIComponent(poster)}`
    : src

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      src={mediaSrc}
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
    />
  )
}
