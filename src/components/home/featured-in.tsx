export function FeaturedIn({
  heading,
  features,
}: {
  heading?: string | null
  features?: Array<{
    _id: string
    publication?: string | null
    url?: string | null
  } | null> | null
}) {
  const items = (features || []).filter((feature): feature is {_id: string; publication?: string | null; url?: string | null} =>
    Boolean(feature?.publication),
  )
  if (!items.length) return null
  const loop = [...items, ...items]

  return (
    <section className="overflow-hidden border-y border-primary/10 bg-accent/35 py-12">
      {heading ? <p className="kicker mb-6 text-center">{heading}</p> : null}
      <div className="marquee">
        <div className="marquee-track">
          {loop.map((item, index) => (
            <span key={`${item._id}-${index}`} className="font-display mx-8 text-3xl text-ink/80">
              {item.publication}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
