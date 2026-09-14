'use client'

import {useEffect, useRef} from 'react'
import {ProductCard, type ProductCardProduct} from './ProductCard'

export function ProductCarousel({
  heading,
  eyebrow,
  products,
}: {
  heading?: string | null
  eyebrow?: string | null
  products?: Array<ProductCardProduct | null> | null
}) {
  const items = (products || []).filter((product): product is ProductCardProduct => Boolean(product))
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)
  const resumeTimer = useRef<number>(0)

  useEffect(() => {
    if (!items.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let last = performance.now()

    const tick = (now: number) => {
      const elapsed = now - last
      last = now
      if (!pausedRef.current) {
        offsetRef.current += (32 * elapsed) / 1000
        applyOffset(trackRef.current, offsetRef)
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [items.length])

  if (!items.length) return null

  const copies = Math.max(1, Math.ceil(6 / items.length))
  const half = Array.from({length: copies}, () => items).flat()
  const loop = [...half, ...half]

  function pauseAuto(resumeAfter?: number) {
    pausedRef.current = true
    window.clearTimeout(resumeTimer.current)
    if (resumeAfter) {
      resumeTimer.current = window.setTimeout(() => {
        pausedRef.current = false
      }, resumeAfter)
    }
  }

  function resumeAuto() {
    window.clearTimeout(resumeTimer.current)
    pausedRef.current = false
  }

  function scrollByCard(direction: -1 | 1) {
    const track = trackRef.current
    if (!track) return
    pauseAuto(4000)
    const card = track.querySelector<HTMLElement>('[data-carousel-card]')
    const styles = getComputedStyle(track)
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0
    const amount = (card?.offsetWidth ?? 240) + gap
    offsetRef.current += direction * amount
    applyOffset(track, offsetRef)
  }

  return (
    <section className="overflow-hidden bg-canvas py-20 md:py-28">
      <div className="mx-auto mb-12 flex max-w-368 items-end justify-between gap-6 px-5 md:mb-16 md:px-10 gallery:px-20">
        <div>
          {eyebrow ? (
            <p className="mb-3.5 font-mono text-[10px] tracking-[0.22em] uppercase">{eyebrow}</p>
          ) : null}
          {heading ? (
            <h2 className="max-w-[9ch] font-display text-[clamp(3.8rem,9vw,7.2rem)] leading-[0.8] tracking-[-0.045em] text-ink">
              {heading}
            </h2>
          ) : null}
        </div>

        <div className="mb-1 flex shrink-0 gap-2">
          <CarouselArrow label="Previous products" onClick={() => scrollByCard(-1)}>
            ←
          </CarouselArrow>
          <CarouselArrow label="Next products" onClick={() => scrollByCard(1)}>
            →
          </CarouselArrow>
        </div>
      </div>

      <div
        className="overflow-hidden"
        onMouseEnter={() => pauseAuto()}
        onMouseLeave={resumeAuto}
      >
        <div ref={trackRef} className="flex w-max gap-5 px-5 will-change-transform md:px-10 gallery:px-20">
          {loop.map((product, index) => (
            <div
              key={`${product._id}-${index}`}
              data-carousel-card
              className="w-52 shrink-0 sm:w-56 md:w-60"
            >
              <ProductCard product={product} sizes="(min-width: 768px) 240px, 208px" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function applyOffset(
  track: HTMLDivElement | null,
  offsetRef: {current: number},
) {
  if (!track) return
  const loopWidth = track.scrollWidth / 2
  if (loopWidth > 0) {
    offsetRef.current = ((offsetRef.current % loopWidth) + loopWidth) % loopWidth
  }
  track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
}

function CarouselArrow({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-black font-mono text-sm text-black transition hover:bg-black hover:text-canvas"
    >
      {children}
    </button>
  )
}
