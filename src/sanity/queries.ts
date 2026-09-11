import {defineQuery} from 'next-sanity'

const imageProjection = /* groq */ `
  asset->{
    _id,
    url,
    metadata { lqip, dimensions }
  },
  alt,
  caption,
  hotspot,
  crop
`

const productCardProjection = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  shortPitch,
  featured,
  shopifyProductId,
  gallery[0]{${imageProjection}},
  variants[]{
    _key,
    length,
    price,
    compareAtPrice,
    sku,
    inStock,
    shopifyVariantId
  }
`

export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_id == "siteSettings"][0]{
    siteTitle,
    logo{${imageProjection}},
    footerBlurb,
    announcement,
    navigation[]{
      _key,
      label,
      linkType,
      internalPath,
      externalUrl
    },
    email,
    phone,
    address,
    hours,
    instagramHandle,
    instagramUrl,
    seo
  }
`)

export const HOME_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "homePage"][0]{
    title,
    seo,
    pageBuilder[]{
      _key,
      _type,
      ...,
      _type == "hero" => {
        image{${imageProjection}},
        cta
      },
      _type == "portraitGallery" => {
        statement,
        statementAccent,
        eyebrow,
        heading,
        body,
        portraits[]{${imageProjection}}
      },
      _type == "editorialSplit" => {
        eyebrow,
        heading,
        headingLine,
        body,
        chromeLeft,
        chromeRight,
        panelEyebrow,
        panelHeadline,
        panelSubcopy,
        image{${imageProjection}},
        cta
      },
      _type == "productCarousel" => {
        "products": coalesce(
          products[]->{${productCardProjection}},
          collection->products[]->{${productCardProjection}}
        )
      },
      _type == "testimonialsBlock" => {
        testimonials[]->{
          _id,
          quote,
          name,
          role,
          photo{${imageProjection}}
        }
      },
      _type == "featuredIn" => {
        features[]->{
          _id,
          publication,
          url,
          logo{${imageProjection}}
        }
      },
      _type == "videoMoment" => {
        poster{${imageProjection}}
      },
      _type == "instagramStrip" => {
        posts[]->{
          _id,
          caption,
          permalink,
          image{${imageProjection}}
        }
      }
    }
  }
`)

export const ABOUT_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "aboutPage"][0]{
    title,
    eyebrow,
    headline,
    heroImage{${imageProjection}},
    story,
    moments[]{${imageProjection}},
    seo
  }
`)

export const CONTACT_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "contactPage"][0]{
    title,
    eyebrow,
    headline,
    intro,
    note,
    seo
  }
`)

export const PRODUCTS_QUERY = defineQuery(/* groq */ `
  *[_type == "product" && defined(slug.current)] | order(name asc) {
    ${productCardProjection}
  }
`)

export const COLLECTIONS_QUERY = defineQuery(/* groq */ `
  *[_type == "collection" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    products[]->{${productCardProjection}}
  }
`)

export const PRODUCT_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "product" && defined(slug.current)]{ "slug": slug.current }
`)

export const PRODUCT_QUERY = defineQuery(/* groq */ `
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    shortPitch,
    description,
    featured,
    shopifyProductId,
    gallery[]{${imageProjection}},
    variants[]{
      _key,
      length,
      price,
      compareAtPrice,
      sku,
      inStock,
      shopifyVariantId
    },
    seo
  }
`)
