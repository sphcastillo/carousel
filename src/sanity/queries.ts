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

const shopifyVariantProjection = /* groq */ `
  "_key": _id,
  "length": select(
    store.option1 == "Default Title" => null,
    store.option1 == "18 inches" => "18",
    store.option1 == "20 inches" => "20",
    store.option1 == "22 inches" => "22",
    defined(store.option1) && store.option1 != "" => store.option1,
    null
  ),
  "hairType": select(
    defined(store.option2) && store.option2 != "" => store.option2,
    null
  ),
  "price": store.price,
  "compareAtPrice": store.compareAtPrice,
  "inStock": store.inventory.isAvailable,
  "sku": store.sku,
  "shopifyVariantId": store.gid
`

const productCardProjection = /* groq */ `
  _id,
  "name": store.title,
  "slug": store.slug.current,
  "href": "/shop/" + store.slug.current,
  shortPitch,
  featured,
  "shopifyProductId": store.gid,
  "gallery": gallery[0]{${imageProjection}},
  "imageUrl": select(defined(gallery[0].asset) => null, store.previewImageUrl),
  "imageAlt": store.title,
  "currencyCode": "USD",
  "variants": store.variants[]->{${shopifyVariantProjection}}
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
      _type == "brandStatement" => {
        statement,
        statementAccent
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
        "collectionSlug": coalesce(collection->store.slug.current, collection->slug.current),
        "products": coalesce(
          products[]->{${productCardProjection}},
          collection->products[]->{${productCardProjection}}
        )
      },
      _type == "personalCuration" => {
        image{${imageProjection}}
      },
      _type == "testimonialsBlock" => {
        "testimonials": array::compact(testimonials[]->{
          _id,
          quote,
          name,
          role,
          photo{${imageProjection}}
        }) + *[_type == "testimonial" && !(_id in ^.testimonials[]._ref)] | order(_createdAt asc) {
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
          kind,
          label,
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
    portrait{${imageProjection}},
    intro,
    note,
    seo
  }
`)

export const PRODUCTS_QUERY = defineQuery(/* groq */ `
  *[
    _type == "product" &&
    defined(store.gid) &&
    store.status == "active" &&
    store.isDeleted != true
  ] | order(store.title asc) {
    ${productCardProjection},
    category
  }
`)

export const COLLECTIONS_QUERY = defineQuery(/* groq */ `
  *[_type == "collection" && defined(coalesce(slug.current, store.slug.current))] | order(coalesce(title, store.title) asc) {
    _id,
    "title": coalesce(title, store.title),
    "slug": coalesce(slug.current, store.slug.current),
    description,
    products[]->{${productCardProjection}}
  }
`)

export const PRODUCT_SLUGS_QUERY = defineQuery(/* groq */ `
  *[
    _type == "product" &&
    defined(store.slug.current) &&
    store.status == "active" &&
    store.isDeleted != true
  ]{ "slug": store.slug.current }
`)

export const PRODUCT_QUERY = defineQuery(/* groq */ `
  *[
    _type == "product" &&
    store.slug.current == $slug &&
    store.status == "active" &&
    store.isDeleted != true
  ][0]{
    _id,
    "name": store.title,
    "slug": store.slug.current,
    shortPitch,
    description,
    featured,
    category,
    "shopifyProductId": store.gid,
    "previewImageUrl": store.previewImageUrl,
    "optionName": select(
      store.options[0].name == "Title" => null,
      store.options[0].name
    ),
    gallery[]{${imageProjection}},
    "variants": store.variants[]->{${shopifyVariantProjection}},
    seo
  }
`)
