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

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {eyebrow ? (
          <p className="mb-3.5 font-mono text-[10px] tracking-[0.22em] uppercase">{eyebrow}</p>
        ) : null}
        {heading ? (
          <h2 className="mb-12 font-display text-5xl leading-[0.78] tracking-[-0.04em] md:text-7xl">
            {heading}
          </h2>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <blockquote
              key={item._id}
              className={`border border-primary/14 p-[1.6rem] ${index % 2 === 1 ? 'bg-secondary' : 'bg-surface'}`}
            >
              <p className="font-display text-3xl leading-[1.05] text-ink">“{item.quote}”</p>
              <div className="mt-8 flex items-center gap-3">
                {item.photo ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <SanityImage image={item.photo} fill className="object-cover" sizes="40px" />
                  </div>
                ) : null}
                <div>
                  <p className="text-sm">{item.name}</p>
                  {item.role ? (
                    <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink/55">{item.role}</p>
                  ) : null}
                </div>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
