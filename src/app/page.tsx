import type {Metadata} from 'next'
import {PageBuilder} from '@/components/home/page-builder'
import {sanityFetch} from '@/sanity/live'
import {HOME_PAGE_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/queries'
import {getCarouselFavorites, getCarouselPonytails} from '@/lib/shopify'

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({query: HOME_PAGE_QUERY})
  return {
    title: data?.seo?.title || 'Home',
    description: data?.seo?.description || 'Feminine, whimsical hair extensions with a carousel swirl.',
  }
}

export default async function HomePage() {
  const [{data: page}, {data: settings}, favorites, ponytails] = await Promise.all([
    sanityFetch({query: HOME_PAGE_QUERY}),
    sanityFetch({query: SITE_SETTINGS_QUERY}),
    getCarouselFavorites(),
    getCarouselPonytails(),
  ])

  return (
    <PageBuilder
      blocks={page?.pageBuilder as never}
      favorites={favorites}
      ponytails={ponytails}
      instagramHandle={settings?.instagramHandle}
      instagramUrl={settings?.instagramUrl}
    />
  )
}
