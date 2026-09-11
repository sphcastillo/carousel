import Link from 'next/link'

export function Wordmark({
  className = '',
  inverted = false,
}: {
  className?: string
  inverted?: boolean
}) {
  return (
    <span className={`wordmark ${inverted ? 'wordmark-light' : ''} ${className}`}>
      <span className="wordmark-title">Carousel</span>
      <span className="wordmark-sub">Hair Extensions</span>
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
