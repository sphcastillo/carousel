import {PortableText, type PortableTextComponents} from 'next-sanity'

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="mb-4 text-pretty leading-relaxed">{children}</p>,
    h2: ({children}) => (
      <h2 className="mb-4 font-display text-3xl leading-[0.78] tracking-[-0.04em] text-ink">{children}</h2>
    ),
    h3: ({children}) => (
      <h3 className="font-display mb-3 text-2xl tracking-tight text-ink">{children}</h3>
    ),
  },
}

export function RichText({value}: {value?: unknown}) {
  if (!Array.isArray(value) || value.length === 0) return null
  return <PortableText value={value} components={components} />
}
