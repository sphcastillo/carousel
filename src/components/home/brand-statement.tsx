export function BrandStatement({
  block,
}: {
  block: {
    statement?: string | null
    statementAccent?: string | null
  }
}) {
  if (!block.statement) return null

  return (
    <section className="bg-[color-mix(in_srgb,var(--accent)_78%,white)] px-5 py-11 md:px-12 md:py-18">
      <div className="mx-auto max-w-344 border border-ink/18 px-7 py-13 md:px-26 md:py-22">
        <p className="max-w-[14.5em] font-display text-[clamp(2.05rem,4.2vw,3.35rem)] leading-[1.18] tracking-[-0.03em] text-ink">
          <AccentedText text={block.statement} accent={block.statementAccent} />
        </p>
      </div>
    </section>
  )
}

function AccentedText({text, accent}: {text: string; accent?: string | null}) {
  if (!accent) return text
  const index = text.toLowerCase().indexOf(accent.toLowerCase())
  if (index < 0) return text

  const before = text.slice(0, index)
  const match = text.slice(index, index + accent.length)
  const after = text.slice(index + accent.length)

  return (
    <>
      {before}
      <em className="text-primary italic">{match}</em>
      {after}
    </>
  )
}
