'use client'

import {useEffect, useRef} from 'react'
import {parseVideoUrl} from '@/lib/video'

export function VideoMaskScroll({
  heading,
  subcopy,
  videoUrl,
  posterUrl,
}: {
  heading?: string | null
  subcopy?: string | null
  videoUrl?: string | null
  posterUrl?: string | null
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)
  const parsed = parseVideoUrl(videoUrl)

  useEffect(() => {
    let frame = 0
    const animate = () => {
      const container = containerRef.current
      const mask = maskRef.current
      if (container && mask) {
        const distance = container.offsetHeight - window.innerHeight
        const progress = distance > 0 ? Math.min(Math.max(mask.offsetTop / distance, 0), 1) : 0
        const size = 0.55 + progress * 28
        mask.style.maskSize = `${size * 100}%`
        mask.style.webkitMaskSize = `${size * 100}%`
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  if (!parsed) return null

  return (
    <section className="bg-ink text-canvas">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] text-secondary uppercase">Scroll to enter</p>
        {heading ? (
          <h2 className="font-display text-5xl leading-[0.78] tracking-[-0.04em] md:text-7xl">{heading}</h2>
        ) : null}
        {subcopy ? <p className="mt-5 max-w-xl text-sm leading-relaxed text-canvas/70">{subcopy}</p> : null}
      </div>
      <div ref={containerRef} className="relative h-[280vh]">
        <div
          ref={maskRef}
          className="sticky top-0 h-screen w-full overflow-hidden [mask-image:url('/masks/bloom.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:55%] [-webkit-mask-image:url('/masks/bloom.svg')] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:55%]"
        >
          {parsed.kind === 'file' ? (
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={posterUrl || undefined}
              src={parsed.src}
            />
          ) : (
            <iframe
              src={parsed.src}
              title={heading || 'Carousel film'}
              className="h-full w-full scale-125"
              allow="autoplay; fullscreen"
            />
          )}
        </div>
      </div>
    </section>
  )
}
