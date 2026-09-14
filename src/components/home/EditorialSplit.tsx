import type {CSSProperties} from 'react'
import Link from 'next/link'
import {SanityImage} from '@/components/sanity-image'
import {resolveHref} from '@/lib/links'

type Cta = {
  label?: string | null
  linkType?: string | null
  internalPath?: string | null
  externalUrl?: string | null
}

export function EditorialSplit({
  block,
}: {
  block: {
    eyebrow?: string | null
    heading?: string | null
    headingLine?: string | null
    body?: string | null
    chromeLeft?: string | null
    chromeRight?: string | null
    panelEyebrow?: string | null
    panelHeadline?: string | null
    panelSubcopy?: string | null
    cta?: Cta | null
    image?: unknown
  }
}) {
  const href = resolveHref(block.cta)
  const hasIntro = Boolean(block.eyebrow || block.heading || block.body)
  const hasPanel = Boolean(block.panelEyebrow || block.panelHeadline || block.panelSubcopy || href)
  const image = block.image as {
    asset?: {metadata?: {dimensions?: {width?: number; height?: number} | null} | null}
  } | undefined
  const photoWidth = image?.asset?.metadata?.dimensions?.width
  const photoHeight = image?.asset?.metadata?.dimensions?.height
  const photoAspect =
    photoWidth && photoHeight ? `${photoWidth} / ${photoHeight}` : '3 / 4'

  if (!hasIntro && !hasPanel && !image?.asset) return null

  return (
    <section className="bg-[color-mix(in_srgb,var(--ink)_68%,var(--primary))] px-5 pt-17 pb-19 md:px-12 md:pt-22 md:pb-24">
      <div className="mx-auto max-w-6xl">
        {hasIntro ? (
          <div className="mb-[2.35rem] grid gap-7 md:mb-[2.85rem] md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.7fr)] md:items-start md:gap-12">
            <div>
              {block.eyebrow ? (
                <p className="mb-[1.15rem] font-mono text-[0.6rem] tracking-[0.22em] text-canvas/72 uppercase">
                  {block.eyebrow}
                </p>
              ) : null}
              {block.heading ? (
                <h2 className="max-w-[14ch] font-display text-[clamp(3.8rem,9.4vw,7.4rem)] leading-[0.86] tracking-[-0.045em] text-canvas">
                  {block.heading}
                  {block.headingLine ? (
                    <>
                      <br />
                      {block.headingLine}
                    </>
                  ) : null}
                </h2>
              ) : null}
            </div>
            {block.body ? (
              <p className="max-w-74 text-[0.88rem] leading-[1.6] text-canvas/78 md:mt-[2.6rem] md:justify-self-end">
                {block.body}
              </p>
            ) : null}
          </div>
        ) : null}

        {hasPanel || image?.asset ? (
          <div className="overflow-hidden bg-secondary">

            <div className="grid sm:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
              {hasPanel ? (
                <div className="flex flex-col gap-8 bg-secondary px-[1.6rem] pt-[2.6rem] pb-[2.35rem] text-ink sm:min-h-0 sm:justify-between sm:gap-0 md:px-[2.4rem] md:pt-[3.1rem] md:pb-[2.7rem]">
                  <div>
                    {block.panelEyebrow ? (
                      <p className="mb-4 font-mono text-[0.58rem] tracking-[0.2em] text-ink/62 uppercase">
                        {block.panelEyebrow}
                      </p>
                    ) : null}
                    {block.panelHeadline ? (
                      <h3 className="max-w-[8ch] font-display text-[clamp(3.4rem,7.4vw,6.4rem)] leading-[0.84] tracking-[-0.045em]">
                        {block.panelHeadline}
                      </h3>
                    ) : null}
                  </div>
                  <div className="max-w-66 sm:pt-18">
                    {block.panelSubcopy ? (
                      <p className="mb-6 text-[0.86rem] leading-[1.55] text-ink/78">{block.panelSubcopy}</p>
                    ) : null}
                    {href && block.cta?.label ? (
                      <Link
                        href={href}
                        className="grid size-[8.6rem] place-items-center rounded-full border border-ink text-center font-mono text-[0.62rem] leading-[1.35] tracking-[0.16em] text-ink uppercase transition hover:bg-ink hover:text-canvas"
                        target={block.cta.linkType === 'external' ? '_blank' : undefined}
                        rel={block.cta.linkType === 'external' ? 'noreferrer' : undefined}
                      >
                        <OrbLabel label={block.cta.label} />
                      </Link>
                    ) : null}
                  </div>
                </div>
              ) : null}
              {image?.asset ? (
                <div
                  className="relative min-h-112 bg-[color-mix(in_srgb,var(--ink)_18%,var(--secondary))] min-[460px]:aspect-(--split-aspect) min-[460px]:min-h-0 sm:aspect-auto sm:h-full"
                  style={{['--split-aspect']: photoAspect} as CSSProperties}
                >
                  <SanityImage
                    image={block.image}
                    alt={block.panelHeadline || block.heading || 'Carousel campaign'}
                    fill
                    fit="max"
                    sizes="(min-width: 640px) 58vw, 100vw"
                    quality={90}
                    className="object-cover object-center"
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function OrbLabel({label}: {label: string}) {
  const words = label.trim().split(/\s+/)
  if (words.length < 3) return label

  return (
    <>
      {words.slice(0, -1).join(' ')}
      <br />
      {words.at(-1)}
    </>
  )
}
