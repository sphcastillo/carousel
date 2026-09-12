import {SanityImage} from '@/components/sanity-image'

export function PersonalCuration({
  block,
}: {
  block: {
    eyebrow?: string | null
    heading?: string | null
    headingLine?: string | null
    body?: string | null
    image?: unknown
  }
}) {
  const image = block.image as {asset?: unknown} | undefined
  const hasCopy = Boolean(block.eyebrow || block.heading || block.body)
  if (!hasCopy && !image?.asset) return null

  return (
    <section className="bg-nav">
      <div className="grid md:grid-cols-2">
        <div className="relative min-h-[70vw] bg-[color-mix(in_srgb,var(--nav)_80%,black)] md:min-h-[min(88vh,46rem)]">
          {image?.asset ? (
            <SanityImage
              image={block.image}
              alt={block.heading || 'Carousel personal curation'}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              quality={90}
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-col justify-center px-8 py-16 text-canvas md:px-16 md:py-24 lg:px-20">
          {block.eyebrow ? (
            <p className="mb-6 font-mono text-[0.58rem] tracking-[0.22em] text-canvas/70 uppercase">
              {block.eyebrow}
            </p>
          ) : null}
          {block.heading ? (
            <h2 className="max-w-[9ch] font-display text-[clamp(3.4rem,7vw,5.6rem)] leading-[0.9] tracking-[-0.04em]">
              {block.heading}
              {block.headingLine ? (
                <>
                  <br />
                  {block.headingLine}
                </>
              ) : null}
            </h2>
          ) : null}
          {block.body ? (
            <p className="mt-8 max-w-88 text-[0.92rem] leading-[1.65] text-canvas/78">{block.body}</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
