import Link from 'next/link'
import {SanityImage} from '@/components/sanity-image'

export function InstagramStrip({
  heading,
  ctaLabel,
  handle,
  profileUrl,
  posts,
}: {
  heading?: string | null
  ctaLabel?: string | null
  handle?: string | null
  profileUrl?: string | null
  posts?: Array<{
    _id: string
    caption?: string | null
    permalink?: string | null
    image?: unknown
  } | null> | null
}) {
  const items = (posts || []).filter(Boolean)

  return (
    <section className="border-t border-primary/10 py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="kicker">Instagram</p>
          {heading ? <h2 className="display text-5xl md:text-7xl">{heading}</h2> : null}
          {handle ? (
            <p className="mt-3 font-mono text-[10px] tracking-[0.19em] uppercase text-primary">@{handle}</p>
          ) : null}
        </div>
        {profileUrl ? (
          <Link href={profileUrl} target="_blank" className="btn-round">
            {ctaLabel || 'Follow along'}
          </Link>
        ) : null}
      </div>
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-3 px-4 md:grid-cols-4 md:px-8">
        {items.map((post) =>
          post ? (
            <Link
              key={post._id}
              href={post.permalink || profileUrl || '#'}
              className="photo-figure group"
            >
              <div className="relative aspect-square overflow-hidden">
                <SanityImage
                  image={post.image}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="25vw"
                />
              </div>
              {post.caption ? <p className="photo-caption">{post.caption}</p> : null}
            </Link>
          ) : null,
        )}
      </div>
    </section>
  )
}
