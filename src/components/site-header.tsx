import {sanityFetch} from '@/sanity/live'
import {SITE_SETTINGS_QUERY} from '@/sanity/queries'
import {SiteHeaderFrame} from './site-header-frame'

export async function SiteHeader() {
  const {data} = await sanityFetch({query: SITE_SETTINGS_QUERY})

  return <SiteHeaderFrame data={data} />
}
