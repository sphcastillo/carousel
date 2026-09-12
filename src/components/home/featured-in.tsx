const DEFAULT_PUBLICATIONS = ['LA Weekly', 'The Village Voice', 'Irvine Weekly']
const HIDDEN_PUBLICATIONS = new Set([
  'gloss weekly',
  'crown magazine',
  'petal press',
  'ribbon & rouge',
  'vanity hour',
  'vanity house',
])

type PressItem = {
  _id: string
  publication?: string | null
  url?: string | null
}

export function FeaturedIn({
  heading,
  features,
}: {
  heading?: string | null
  features?: Array<PressItem | null> | null
}) {
  const fromCms = (features || []).filter((feature): feature is PressItem => {
    const name = feature?.publication?.trim()
    return Boolean(name) && !HIDDEN_PUBLICATIONS.has(name!.toLowerCase())
  })
  const byName = new Map(fromCms.map((feature) => [feature.publication!.toLowerCase(), feature]))
  const items = [
    ...DEFAULT_PUBLICATIONS.map(
      (publication) =>
        byName.get(publication.toLowerCase()) ?? {_id: `added-${publication}`, publication},
    ),
    ...fromCms.filter(
      (feature) =>
        !DEFAULT_PUBLICATIONS.some(
          (publication) => publication.toLowerCase() === feature.publication?.toLowerCase(),
        ),
    ),
  ]
  if (!items.length) return null

  const loop = marqueeLoop(items)

  return (
    <section className="overflow-hidden border-y border-ink/10 bg-canvas py-5 md:py-6">
      <div className="flex items-center gap-6 px-6 md:gap-10 md:px-10">
        {heading ? (
          <p className="shrink-0 font-mono text-[9px] tracking-[0.22em] text-ink/55 uppercase">
            {heading}
          </p>
        ) : null}
        <div className="min-w-0 flex-1 overflow-hidden mask-[linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
            {loop.map((item, index) => (
              <span
                key={`${item._id}-${index}`}
                className="font-display mx-7 text-[1.35rem] leading-none text-nav transition-opacity duration-300 hover:opacity-60 md:mx-10 md:text-[1.55rem]"
              >
                {item.publication}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function marqueeLoop(items: PressItem[]) {
  const copies = Math.max(3, Math.ceil(8 / items.length))
  const sequence = Array.from({length: copies}, () => items).flat()
  return [...sequence, ...sequence]
}
