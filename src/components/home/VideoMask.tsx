import {parseVideoUrl} from '@/lib/video'
import {AutoplayVideo} from './autoplay-video'

const CAROUSEL_FILM = '/videos/CarouselExtensions.mp4?v=faststart'

export function VideoMaskScroll({
  eyebrow,
  heading,
  subcopy,
  posterUrl,
}: {
  eyebrow?: string | null
  heading?: string | null
  subcopy?: string | null
  posterUrl?: string | null
}) {
  const parsed = parseVideoUrl(CAROUSEL_FILM)
  if (!parsed) return null

  return (
    <section className="bg-ink text-canvas pt-20 pb-60">
      {eyebrow || heading || subcopy ? (
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 md:px-8 md:pt-20 md:pb-12">
          {eyebrow ? (
            <p className="mb-3.5 font-mono text-[10px] tracking-[0.22em] text-canvas/72 uppercase">
              {eyebrow}
            </p>
          ) : null}
          {heading ? (
            <h2 className="font-display text-5xl leading-[0.78] tracking-[-0.04em] md:text-7xl">{heading}</h2>
          ) : null}
          {subcopy ? <p className="mt-5 max-w-xl text-sm leading-relaxed text-canvas/70">{subcopy}</p> : null}
        </div>
      ) : null}
      <div className="mx-auto aspect-video w-full max-w-6xl overflow-hidden bg-ink">
        {parsed.kind === 'file' ? (
          <AutoplayVideo
            key={posterUrl || parsed.src}
            className="h-full w-full object-cover"
            src={parsed.src}
            poster={posterUrl || undefined}
          />
        ) : (
          <iframe
            src={parsed.src}
            title={heading || 'Carousel film'}
            className="h-full w-full"
            allow="autoplay; fullscreen"
          />
        )}
      </div>
    </section>
  )
}
