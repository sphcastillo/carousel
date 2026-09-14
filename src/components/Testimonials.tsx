import {SanityImage} from '@/components/sanity-image'

type Testimonial = {
  _id: string
  quote?: string | null
  name?: string | null
  role?: string | null
  photo?: unknown
}

export function Testimonials({
  eyebrow,
  heading,
  testimonials,
}: {
  eyebrow?: string | null
  heading?: string | null
  testimonials?: Array<Testimonial | null> | null
}) {
  const items = (testimonials || []).filter((item): item is Testimonial => Boolean(item))
  if (!items.length) return null

  const split = Math.ceil(items.length / 2)
  const topRow = items.slice(0, split)
  const bottomRow = items.slice(split)
  const rows = [topRow, bottomRow.length ? bottomRow : topRow]

  return (
    <section className="relative overflow-hidden bg-[color-mix(in_srgb,var(--secondary)_22%,var(--canvas))] py-24">
      <p
        aria-hidden="true"
        className="pointer-events-none absolute top-[-2.2rem] left-[4%] font-script text-[clamp(8rem,22vw,16rem)] leading-none text-primary/10"
      >
        “
      </p>
      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        {eyebrow || heading ? (
          <div className="mb-12 md:mb-16">
            {eyebrow ? (
              <p className="mb-3.5 font-mono text-[10px] tracking-[0.22em] uppercase">{eyebrow}</p>
            ) : null}
            {heading ? (
              <h2 className="max-w-[10ch] font-display text-5xl leading-[0.78] tracking-[-0.04em] md:text-7xl">
                {heading}
              </h2>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="relative hidden motion-reduce:block">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-2 lg:grid-cols-3 md:px-8">
          {items.map((item, index) => (
            <Note key={item._id} item={item} index={index} />
          ))}
        </div>
      </div>

      <div className="space-y-5 motion-reduce:hidden">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
          >
            <div
              className={`flex w-max gap-5 px-4 hover:[animation-play-state:paused] motion-reduce:animate-none ${
                rowIndex === 0 ? 'animate-testimonial-marquee' : 'animate-testimonial-marquee-rev'
              }`}
            >
              {[...row, ...row].map((item, index) => (
                <div
                  key={`${item._id}-${index}`}
                  aria-hidden={index >= row.length}
                  className="animate-testimonial-float w-[min(22rem,82vw)] shrink-0 py-2 md:w-[24rem]"
                  style={{animationDelay: `${(index % row.length) * 0.7 + rowIndex * 0.4}s`}}
                >
                  <Note item={item} index={index} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Note({item, index}: {item: Testimonial; index: number}) {
  const blush = index % 2 === 1
  const tilt = index % 2 === 0 ? '-rotate-[1.6deg]' : 'rotate-[1.8deg]'

  return (
    <blockquote
      className={`group relative h-full overflow-hidden border border-primary/14 p-[1.6rem] pt-[1.85rem] shadow-[0_18px_40px_-28px_rgba(42,18,22,0.45)] transition duration-500 hover:z-10 hover:rotate-0 hover:scale-[1.045] hover:border-primary/30 hover:shadow-[0_24px_50px_-24px_rgba(164,26,40,0.35)] ${tilt} ${
        blush ? 'bg-secondary' : 'bg-surface'
      }`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 -left-1 font-script text-[6.2rem] leading-none text-primary/18 transition duration-500 group-hover:text-primary/32"
      >
        “
      </span>
      <p className="relative font-display text-[1.2rem] leading-[1.12] text-ink md:text-[1.35rem]">
        {item.quote}
      </p>
      <div className="relative mt-8 flex items-center gap-3">
        {item.photo ? (
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <SanityImage image={item.photo} fill className="object-cover" sizes="40px" />
          </div>
        ) : (
          <span className="grid size-10 place-items-center rounded-full border border-ink/15 font-script text-lg text-primary">
            {(item.name || 'C').trim().charAt(0)}
          </span>
        )}
        <div>
          <p className="text-sm">{item.name}</p>
          {item.role ? (
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink/55">{item.role}</p>
          ) : null}
        </div>
      </div>
    </blockquote>
  )
}
