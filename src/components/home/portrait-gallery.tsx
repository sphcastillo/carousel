import {SanityImage} from '@/components/sanity-image'

type Portrait = {
  alt?: string | null
  caption?: string | null
  asset?: unknown
}

export function PortraitGallery({
  block,
}: {
  block: {
    statement?: string | null
    statementAccent?: string | null
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
    <>
      {block.statement ? (
        <section className="statement-band">
          <div className="statement-frame">
            <p className="statement-copy">
              <AccentedText text={block.statement} accent={block.statementAccent} />
            </p>
          </div>
        </section>
      ) : null}

      <section className="dressing-room mx-auto max-w-[92rem]">
        {hasIntro ? (
          <div className="mb-12 grid items-end gap-8 md:mb-16 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] md:gap-16">
            <div>
              {block.eyebrow ? <p className="kicker">{block.eyebrow}</p> : null}
              {block.heading ? <h2 className="dressing-title">{block.heading}</h2> : null}
            </div>
            {block.body ? <p className="dressing-body md:mb-3">{block.body}</p> : null}
          </div>
        ) : null}

        <div className="dressing-collage">
          {featured.map((portrait, index) => (
            <PortraitFigure
              key={portrait.alt || index}
              portrait={portrait}
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
    </>
  )
}

function PortraitFigure({
  portrait,
  sizes,
}: {
  portrait: Portrait
  sizes: string
}) {
  return (
    <figure>
      <SanityImage
        image={portrait}
        alt={portrait.alt || 'Carousel portrait'}
        fill
        sizes={sizes}
        quality={90}
        className="object-cover"
      />
      {portrait.caption ? (
        <figcaption className="dressing-caption">{portrait.caption}</figcaption>
      ) : null}
    </figure>
  )
}

function AccentedText({text, accent}: {text: string; accent?: string | null}) {
  if (!accent) return text
  const index = text.toLowerCase().indexOf(accent.toLowerCase())
  if (index < 0) return text

  const before = text.slice(0, index)
  const match = text.slice(index, index + accent.length)
  const after = text.slice(index + accent.length)

  return (
    <>
      {before}
      <em className="statement-accent">{match}</em>
      {after}
    </>
  )
}
