import {SanityImage} from '@/components/sanity-image'

type Portrait = {
  alt?: string | null
  caption?: string | null
  asset?: unknown
}

const collagePlacement = [
  'md:row-span-2 max-md:aspect-[4/5]',
  'md:col-start-2 md:row-start-1 max-md:aspect-[4/3]',
  'md:col-start-3 md:row-start-1 max-md:aspect-[4/3]',
  'md:col-span-2 md:col-start-2 md:row-start-2 max-md:aspect-[4/3]',
]

export function PortraitGallery({
  block,
}: {
  block: {
    eyebrow?: string | null
    heading?: string | null
    body?: string | null
    portraits?: Array<Portrait | null> | null
  }
}) {
  const portraits = (block.portraits || []).filter((portrait): portrait is Portrait =>
    Boolean(portrait?.asset),
  )
  if (!portraits.length) return null

  const featured = portraits.slice(0, 4)
  const hasIntro = Boolean(block.eyebrow || block.heading || block.body)

  return (
    <section className="mx-auto max-w-7xl px-5 pt-18 pb-22 md:px-10 md:pt-22 md:pb-28 gallery:px-20 lg:px-24">
        {hasIntro ? (
          <div className="mb-12 grid items-end gap-8 md:mb-16 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] md:gap-16">
            <div>
              {block.eyebrow ? (
                <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] uppercase">
                  {block.eyebrow}
                </p>
              ) : null}
              {block.heading ? (
                <h2 className="font-display text-[clamp(4.4rem,11vw,8.4rem)] leading-[0.8] tracking-[-0.045em] text-ink">
                  {headingLines(block.heading)}
                </h2>
              ) : null}
            </div>
            {block.body ? (
              <p className="max-w-md text-[0.92rem] leading-[1.65] text-ink/78 md:mb-3">{block.body}</p>
            ) : null}
          </div>
        ) : null}

        <div className="grid min-h-[min(52vh,34rem)] grid-cols-[1.05fr_1fr_0.82fr] grid-rows-2 gap-[0.85rem] max-md:min-h-0 max-md:grid-cols-1 max-md:grid-rows-none">
          {featured.map((portrait, index) => (
            <PortraitFigure
              key={portrait.alt || index}
              portrait={portrait}
              className={collagePlacement[index]}
              sizes={
                index === 0
                  ? '(min-width: 768px) 38vw, 100vw'
                  : index === 3
                    ? '(min-width: 768px) 48vw, 100vw'
                    : '(min-width: 768px) 28vw, 100vw'
              }
            />
          ))}
        </div>
    </section>
  )
}

function PortraitFigure({
  portrait,
  sizes,
  className = '',
}: {
  portrait: Portrait
  sizes: string
  className?: string
}) {
  return (
    <figure
      className={`relative h-full min-h-0 overflow-hidden bg-[color-mix(in_srgb,var(--secondary)_35%,var(--canvas))] max-md:h-auto ${className}`}
    >
      <SanityImage
        image={portrait}
        alt={portrait.alt || 'Carousel portrait'}
        fill
        sizes={sizes}
        quality={90}
        className="object-cover"
      />
      {portrait.caption ? (
        <figcaption className="absolute bottom-[0.7rem] left-3 font-mono text-[0.55rem] tracking-[0.2em] text-canvas/92 uppercase">
          {portrait.caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

function headingLines(value: string) {
  return firstWordCapital(value)
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => (
      <span key={`${word}-${index}`}>
        {index > 0 ? <br /> : null}
        {word}
      </span>
    ))
}

function firstWordCapital(value: string) {
  const [first, ...rest] = value.trim().split(/\s+/)
  if (!first) return value

  return [
    first.charAt(0).toUpperCase() + first.slice(1).toLowerCase(),
    ...rest.map((word) => word.toLowerCase()),
  ].join(' ')
}
