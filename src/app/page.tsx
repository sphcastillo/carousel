import type {Metadata} from 'next'
import {PageBuilder} from '@/components/home/PageBuilder'
import {WebsiteCampaignModal} from '@/components/WebsiteCampaignModal'
import {sanityFetch} from '@/sanity/live'
import {
  ACTIVE_WEBSITE_CAMPAIGN_QUERY,
  HOME_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/queries'
import {getCarouselFavorites, getCarouselPonytails} from '@/lib/shopify'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({query: HOME_PAGE_QUERY})
  return {
    title: data?.seo?.title || 'Home',
    description: data?.seo?.description || 'Feminine, whimsical hair extensions with a carousel swirl.',
  }
}

export default async function HomePage() {
  const [{data: page}, {data: settings}, {data: campaign}, favorites, ponytails] = await Promise.all([
    sanityFetch({query: HOME_PAGE_QUERY}),
    sanityFetch({query: SITE_SETTINGS_QUERY}),
    sanityFetch({query: ACTIVE_WEBSITE_CAMPAIGN_QUERY}),
    getCarouselFavorites(),
    getCarouselPonytails(),
  ])

  return (
    <>
      <PageBuilder
        blocks={page?.pageBuilder as never}
        favorites={favorites}
        ponytails={ponytails}
        instagramHandle={settings?.instagramHandle}
        instagramUrl={settings?.instagramUrl}
      />
      <WebsiteCampaignModal campaign={campaign as never} />
    </>
  )
}
