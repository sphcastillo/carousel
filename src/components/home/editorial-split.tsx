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
  const image = block.image as {asset?: unknown} | undefined

  if (!hasIntro && !hasPanel && !image?.asset) return null

  return (
    <section className="editorial-split">
      <div className="editorial-split-inner">
        {hasIntro ? (
          <div className="editorial-split-intro">
            <div>
              {block.eyebrow ? <p className="editorial-split-kicker">{block.eyebrow}</p> : null}
              {block.heading ? (
                <h2 className="editorial-split-title">
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
            {block.body ? <p className="editorial-split-body">{block.body}</p> : null}
          </div>
        ) : null}

        {hasPanel || image?.asset ? (
          <div className="editorial-shopfront">
            <div className="editorial-chrome">
              <span>{block.chromeLeft}</span>
              <span className="editorial-chrome-mark">Carousel</span>
              <span>{block.chromeRight}</span>
            </div>
            <div className="editorial-stage">
              {hasPanel ? (
                <div className="editorial-panel">
                  <div>
                    {block.panelEyebrow ? (
                      <p className="editorial-panel-kicker">{block.panelEyebrow}</p>
                    ) : null}
                    {block.panelHeadline ? (
                      <h3 className="editorial-panel-title">{block.panelHeadline}</h3>
                    ) : null}
                  </div>
                  <div className="editorial-panel-foot">
                    {block.panelSubcopy ? (
                      <p className="editorial-panel-sub">{block.panelSubcopy}</p>
                    ) : null}
                    {href && block.cta?.label ? (
                      <Link
                        href={href}
                        className="enter-orb"
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
                <div className="editorial-photo">
                  <SanityImage
                    image={block.image}
                    alt={block.panelHeadline || block.heading || 'Carousel campaign'}
                    fill
                    sizes="(min-width: 768px) 58vw, 100vw"
                    quality={90}
                    className="object-cover"
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
