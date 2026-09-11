import type {Metadata} from 'next'
import {PageBuilder} from '@/components/home/page-builder'
import {sanityFetch} from '@/sanity/live'
import {HOME_PAGE_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/queries'

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({query: HOME_PAGE_QUERY})
  return {
    title: data?.seo?.title || 'Home',
    description: data?.seo?.description || 'Feminine, whimsical hair extensions with a carousel swirl.',
  }
}

export default async function HomePage() {
  const [{data: page}, {data: settings}] = await Promise.all([
    sanityFetch({query: HOME_PAGE_QUERY}),
    sanityFetch({query: SITE_SETTINGS_QUERY}),
  ])

  return (
    <PageBuilder
      blocks={page?.pageBuilder as never}
      instagramHandle={settings?.instagramHandle}
      instagramUrl={settings?.instagramUrl}
    />
  )
}
