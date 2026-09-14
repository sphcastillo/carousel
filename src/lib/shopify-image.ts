export function shopifySrc(url: string, width = 1600) {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.endsWith('shopify.com')) return url
    parsed.searchParams.set('width', String(width))
    return parsed.toString()
  } catch {
    return url
  }
}
