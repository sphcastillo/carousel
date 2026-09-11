import {SanityImage} from '@/components/sanity-image'

export function TestimonialsBlock({
  heading,
  testimonials,
}: {
  heading?: string | null
  testimonials?: Array<{
    _id: string
    quote?: string | null
    name?: string | null
    role?: string | null
    photo?: unknown
  } | null> | null
}) {
  const items = (testimonials || []).filter(Boolean)
  if (!items.length) return null

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {heading ? <h2 className="display mb-12 text-5xl md:text-7xl">{heading}</h2> : null}
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((item) =>
            item ? (
              <blockquote key={item._id} className="testimonial-card">
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
            ) : null,
          )}
        </div>
      </div>
    </section>
  )
}
