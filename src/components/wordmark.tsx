import Link from 'next/link'

export function Wordmark({
  className = '',
  inverted = false,
}: {
  className?: string
  inverted?: boolean
}) {
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span className={`font-display text-[2rem] tracking-[-0.03em] ${inverted ? 'text-canvas' : ''}`}>
        Carousel
      </span>
      <span
        className={`mt-[0.35rem] font-mono text-[0.58rem] tracking-[0.28em] uppercase ${
          inverted ? 'text-canvas/72' : ''
        }`}
      >
        Hair Extensions
      </span>
    </span>
  )
}

export function WordmarkLink({
  className = '',
  inverted = false,
}: {
  className?: string
  inverted?: boolean
}) {
  return (
    <Link href="/" className={`group ${className}`}>
      <Wordmark inverted={inverted} />
    </Link>
  )
}
