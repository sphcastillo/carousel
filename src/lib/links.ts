export function resolveHref(link?: {
  linkType?: string | null
  internalPath?: string | null
  externalUrl?: string | null
} | null) {
  if (!link) return undefined
  if (link.linkType === 'external') return link.externalUrl || undefined
  return link.internalPath || undefined
}
