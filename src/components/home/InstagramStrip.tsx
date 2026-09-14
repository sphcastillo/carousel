import Link from 'next/link'
import {SanityImage} from '@/components/sanity-image'

type InstagramPost = {
  _id: string
  kind?: string | null
  label?: string | null
  caption?: string | null
  permalink?: string | null
  image?: {asset?: unknown} | null
}

const DEFAULT_LABELS = ['LOOK', 'OBJECT', 'NOTE', 'SCENE']

export function InstagramStrip({
  eyebrow,
  heading,
  body,
  ctaLabel,
  handle,
  profileUrl,
  posts,
}: {
  eyebrow?: string | null
  heading?: string | null
  body?: string | null
  ctaLabel?: string | null
  handle?: string | null
  profileUrl?: string | null
  posts?: Array<InstagramPost | null> | null
}) {
  const items = (posts || []).filter((post): post is InstagramPost => Boolean(post)).slice(0, 4)
  if (!items.length && !heading) return null

  return (
    <section className="bg-secondary px-5 py-20 md:px-10 md:py-28 gallery:px-20">
      <div className="mx-auto max-w-368">
        <div className="mb-12 grid items-end gap-8 md:mb-16 md:grid-cols-[minmax(0,1.2fr)_minmax(14rem,0.75fr)] md:gap-16">
          <div>
            {eyebrow ? (
              <p className="mb-3.5 font-mono text-[10px] tracking-[0.22em] text-ink/55 uppercase">
                {eyebrow}
              </p>
            ) : null}
            {heading ? (
              <h2 className="max-w-[12ch] font-display text-[clamp(3.6rem,8vw,6.8rem)] leading-[0.82] tracking-[-0.045em] text-ink">
                {heading}
                {handle ? (
                  <>
                    <br />
                    <span>@{handle}</span>
                  </>
                ) : null}
              </h2>
            ) : null}
          </div>
          {body ? (
            <p className="max-w-80 text-[0.9rem] leading-[1.6] text-ink/72 md:mb-2 md:justify-self-end md:text-right">
              {body}
            </p>
          ) : null}
        </div>

        <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((post, index) => (
            <InstagramTile
              key={post._id}
              post={post}
              index={index}
              handle={handle}
              profileUrl={profileUrl}
            />
          ))}
        </div>

        {profileUrl ? (
          <Link
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-12 flex items-center justify-between border-t border-ink/18 pt-4 font-mono text-[10px] tracking-[0.2em] text-ink/60 uppercase transition hover:text-ink"
          >
            <span>{ctaLabel || 'Open Instagram'}</span>
            <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
    </section>
  )
}

function InstagramTile({
  post,
  index,
  handle,
  profileUrl,
}: {
  post: InstagramPost
  index: number
  handle?: string | null
  profileUrl?: string | null
}) {
  const href = post.permalink || profileUrl || '#'
  const label = post.label || DEFAULT_LABELS[index] || 'POST'
  const isNote = post.kind === 'note' || (index === 2 && post.kind !== 'photo')
  const kicker = `0${index + 1} / ${label}`

  if (isNote) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`relative flex min-h-64 flex-col justify-between bg-nav px-5 py-6 text-canvas md:min-h-72 ${index === 0 ? 'sm:min-h-120 md:min-h-140' : ''}`}
      >
        {handle ? <p className="font-mono text-[10px] tracking-[0.18em] text-canvas/70">@{handle}</p> : null}
        {post.caption ? (
          <p className="my-8 max-w-[10ch] font-display text-[clamp(1.8rem,3vw,2.7rem)] leading-[0.95] tracking-[-0.03em]">
            “{post.caption}”
          </p>
        ) : null}
        <p className="font-mono text-[9px] tracking-[0.18em] text-canvas/55 uppercase">{kicker}</p>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative block overflow-hidden bg-canvas"
    >
      <div className={`relative overflow-hidden ${index === 0 ? 'aspect-3/4' : 'aspect-4/5'}`}>
        <SanityImage
          image={post.image}
          alt={post.caption || label}
          fill
          sizes={index === 0 ? '(min-width: 1024px) 28vw, 90vw' : '(min-width: 1024px) 22vw, 50vw'}
          quality={90}
          srcWidth={1400}
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <p className="absolute bottom-3 left-3 font-mono text-[9px] tracking-[0.18em] text-canvas uppercase">
          {kicker}
        </p>
      </div>
    </Link>
  )
}
