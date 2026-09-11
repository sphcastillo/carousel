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
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(55,7,16,0.61),rgba(55,7,16,0.04)_63%,rgba(30,3,7,0.22))]" />
      </div>

      <div className="relative flex h-full flex-col justify-end px-5 pb-16 pt-28 md:px-10 md:pb-20 lg:px-12">
        <div className="max-w-xl">
          {block.eyebrow ? (
            <p className="mb-[1.15rem] font-mono text-[0.625rem] tracking-[0.22em] uppercase text-canvas/88">
              {block.eyebrow}
            </p>
          ) : null}
          <h1 className="max-w-[9.5ch] font-display text-[clamp(4.4rem,12vw,8.8rem)] leading-[0.82] tracking-[-0.045em] text-canvas">
            {block.scriptAccent ? (
              <>
                {block.scriptAccent}
                <br />
              </>
            ) : null}
            {block.headline ? <em className="italic">{block.headline}</em> : null}
          </h1>
          {block.subcopy ? (
            <p className="mt-[1.6rem] max-w-[22rem] text-[0.92rem] leading-[1.55] text-canvas/82">
              {block.subcopy}
            </p>
          ) : null}
        </div>
      </div>

      {block.scrollCue ? (
        <p className="absolute right-[1.15rem] bottom-16 font-mono text-[0.58rem] tracking-[0.34em] text-canvas/86 uppercase [writing-mode:vertical-rl] md:right-6 md:bottom-20">
          {block.scrollCue}
        </p>
      ) : null}
    </section>
  )
}
