import {SanityImage} from '@/components/sanity-image'

export function HeroBlock({
  block,
}: {
  block: {
    eyebrow?: string | null
    headline?: string | null
    scriptAccent?: string | null
    subcopy?: string | null
    scrollCue?: string | null
    image?: unknown
  }
}) {
  return (
    <section id="home-hero" className="relative h-svh min-h-168 overflow-hidden">
      <div className="absolute inset-0">
        <SanityImage
          image={block.image}
          alt={block.headline || 'Carousel Hair'}
          fill
          priority
          sizes="100vw"
          quality={90}
          srcWidth={3840}
          className="object-cover"
        />
      </div>

      <div className="relative flex h-full flex-col justify-end px-5 pb-16 pt-28 md:px-10 md:pb-20 lg:px-12">
        <div className="max-w-xl">
          {block.eyebrow ? <p className="hero-kicker">{block.eyebrow}</p> : null}
          <h1 className="hero-display">
            {block.scriptAccent ? (
              <>
                {block.scriptAccent}
                <br />
              </>
            ) : null}
            {block.headline}
          </h1>
          {block.subcopy ? <p className="hero-subcopy">{block.subcopy}</p> : null}
        </div>
      </div>

      {block.scrollCue ? <p className="hero-scroll">{block.scrollCue}</p> : null}
    </section>
  )
}
