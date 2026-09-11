export type ParsedVideo =
  | {kind: 'file'; src: string}
  | {kind: 'youtube'; id: string; src: string}
  | {kind: 'vimeo'; id: string; src: string}

export function parseVideoUrl(url?: string | null): ParsedVideo | null {
  if (!url) return null

  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  )
  if (youtube?.[1]) {
    return {
      kind: 'youtube',
      id: youtube[1],
      src: `https://www.youtube-nocookie.com/embed/${youtube[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtube[1]}`,
    }
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo?.[1]) {
    return {
      kind: 'vimeo',
      id: vimeo[1],
      src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&muted=1&loop=1&background=1`,
    }
  }

  return {kind: 'file', src: url}
}
