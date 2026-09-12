import {getCliClient} from 'sanity/cli'

function key() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12)
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const client = getCliClient({apiVersion: '2026-09-11'})

async function uploadImage(url: string, filename: string, alt: string) {
  const fallback = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&q=80'
  const response = await fetch(url)
  const source = response.ok ? response : await fetch(fallback)
  if (!source.ok) {
    throw new Error(`Failed to download ${url}`)
  }
  const buffer = Buffer.from(await source.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, {filename, contentType: 'image/jpeg'})
  return {
    _type: 'altImage' as const,
    _key: key(),
    asset: {_type: 'reference' as const, _ref: asset._id},
    alt,
  }
}

const productSeeds = [
  {
    name: 'Cloud Nine Clip-Ins',
    pitch: 'Featherlight clips with a cloud-soft finish.',
    lengths: ['18', '20'],
    price: 168,
    compare: 198,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&q=80',
  },
  {
    name: 'Ballet Pink Weft',
    pitch: 'A blush-kissed weft for romantic volume.',
    lengths: ['18'],
    price: 142,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=80',
  },
  {
    name: 'Champagne Blonde Seamless',
    pitch: 'Seamless wefts that melt into champagne light.',
    lengths: ['18', '20'],
    price: 188,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1400&q=80',
  },
  {
    name: 'Espresso Tape-Ins',
    pitch: 'Rich espresso length with a glossy pour.',
    lengths: ['20'],
    price: 176,
    image: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=1400&q=80',
  },
  {
    name: 'Honey Wave',
    pitch: 'Sunlit honey waves, ready for the carousel.',
    lengths: ['18'],
    price: 154,
    image: 'https://images.unsplash.com/photo-1522337094846-8a818192de1f?w=1400&q=80',
  },
  {
    name: 'Midnight Volume Weft',
    pitch: 'Inky volume with a velvet shine.',
    lengths: ['18', '20'],
    price: 196,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1400&q=80',
  },
  {
    name: 'Rosewater Highlights',
    pitch: 'Whisper-pink ribbons through soft brunette.',
    lengths: ['20'],
    price: 210,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1400&q=80',
  },
  {
    name: 'Silk Ribbon Clip-Ins',
    pitch: 'Silk-smooth clips with a ribbon-tied feel.',
    lengths: ['18', '20'],
    price: 164,
    image: 'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=1400&q=80',
  },
  {
    name: 'Vanilla Cream Seamless',
    pitch: 'Creamy vanilla length that never feels heavy.',
    lengths: ['18'],
    price: 172,
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&q=80',
  },
  {
    name: 'Cherry Cola Tape-Ins',
    pitch: 'A cola-gloss brunette with a cherry wink.',
    lengths: ['20'],
    price: 182,
    image: 'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=1400&q=80',
  },
  {
    name: 'Buttercream Beach Waves',
    pitch: 'Buttery beach waves for weekend twirls.',
    lengths: ['18', '20'],
    price: 190,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1400&q=80',
  },
  {
    name: 'Ink Black Luxe Weft',
    pitch: 'A luxe black weft with mirror shine.',
    lengths: ['18'],
    price: 158,
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1400&q=80',
  },
  {
    name: 'Strawberry Blonde Clip-Ins',
    pitch: 'Strawberry light through golden clip-ins.',
    lengths: ['18', '20'],
    price: 174,
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1400&q=80',
  },
  {
    name: 'Carousel Classic',
    pitch: 'The house signature — soft, shiny, endlessly twirly.',
    lengths: ['18', '20'],
    price: 204,
    compare: 228,
    image: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d7?w=1400&q=80',
  },
  {
    name: 'Pearl Ash Seamless',
    pitch: 'Cool pearl ash for a porcelain finish.',
    lengths: ['20'],
    price: 198,
    image: 'https://images.unsplash.com/photo-1488427946603-c6a7a2e70b0e?w=1400&q=80',
  },
  {
    name: 'Cocoa Swirl Weft',
    pitch: 'Warm cocoa swirls with salon-level bounce.',
    lengths: ['18'],
    price: 149,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1400&q=80',
  },
]

const portraitUrls = [
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1000&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1000&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1000&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=80',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1000&q=80',
]

async function run() {
  console.log('Uploading product images...')
  const existing = await client.fetch<Array<{_id: string; name: string; 'slug': string}>>(
    `*[_type == "product"]{_id, name, "slug": slug.current}`,
  )
  const products = [...existing]
  for (const seed of productSeeds) {
    const slug = slugify(seed.name)
    if (products.some((product) => product.slug === slug)) {
      console.log('Skipping existing', seed.name)
      continue
    }
    const image = await uploadImage(seed.image, `${slug}.jpg`, seed.name)
    const doc = await client.create({
      _type: 'product',
      name: seed.name,
      slug: {_type: 'slug', current: slugify(seed.name)},
      shortPitch: seed.pitch,
      featured: seed.name.includes('Carousel') || seed.name.includes('Cloud'),
      description: [
        {
          _type: 'block',
          _key: key(),
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: key(),
              text: `${seed.pitch} Hand-aligned cuticles, a salon-soft finish, and enough movement to feel like a carnival at dusk.`,
              marks: [],
            },
          ],
        },
      ],
      gallery: [{...image, _key: key()}],
      variants: seed.lengths.map((length) => ({
        _type: 'productVariant',
        _key: key(),
        length,
        hairType: 'remy',
        price: length === '20' ? seed.price + 18 : seed.price,
        compareAtPrice: seed.compare,
        sku: `CHE-${slugify(seed.name).slice(0, 8)}-${length}`,
        inStock: true,
      })),
    })
    products.push({_id: doc._id, name: doc.name, slug})
    console.log('Created', doc.name)
  }

  const bestsellers = products.slice(0, 8)
  const newArrivals = products.slice(8)

  async function upsertCollection(title: string, slug: string, description: string, items: Array<{_id: string}>) {
    const existingId = await client.fetch<string | null>(
      `*[_type == "collection" && slug.current == $slug][0]._id`,
      {slug},
    )
    const doc = {
      _type: 'collection',
      title,
      slug: {_type: 'slug', current: slug},
      description,
      products: items.map((product) => ({
        _type: 'reference',
        _key: key(),
        _ref: product._id,
      })),
    }
    return existingId
      ? client.patch(existingId).set(doc).commit()
      : client.create(doc)
  }

  const [bestCollection, newCollection] = await Promise.all([
    upsertCollection(
      'Carousel Bestsellers',
      'bestsellers',
      'The sets everyone asks for after the first twirl.',
      bestsellers,
    ),
    upsertCollection(
      'New Arrivals',
      'new-arrivals',
      'Fresh lengths, just stepped off the carousel.',
      newArrivals,
    ),
  ])

  const existingTestimonials = await client.fetch<Array<{_id: string}>>(`*[_type == "testimonial"]{_id}`)
  const testimonials =
    existingTestimonials.length >= 3
      ? existingTestimonials
      : await Promise.all(
    [
      {
        name: 'Maya R.',
        role: 'Miami, FL',
        quote: 'I felt like I walked out of a perfume commercial. The 20" set is ridiculous in the best way.',
      },
      {
        name: 'Sloane P.',
        role: 'Bride-to-be',
        quote: 'Soft, shiny, and nobody could tell they were extensions. My vanity is officially converted.',
      },
      {
        name: 'Imani J.',
        role: 'Stylist, Brooklyn',
        quote: 'The blend is chef’s kiss. I keep sending clients to Carousel for the color match alone.',
      },
    ].map((item) => client.create({_type: 'testimonial', ...item})),
  )

  const existingPress = await client.fetch<Array<{_id: string}>>(`*[_type == "pressFeature"]{_id}`)
  const press =
    existingPress.length >= 3
      ? existingPress
      : await Promise.all(
          ['LA Weekly', 'The Village Voice', 'Irvine Weekly'].map((publication) =>
            client.create({_type: 'pressFeature', publication}),
          ),
        )

  console.log('Uploading portraits and Instagram stills...')
  const portraits = []
  for (const [index, url] of portraitUrls.entries()) {
    portraits.push(await uploadImage(url, `portrait-${index + 1}.jpg`, `Carousel portrait ${index + 1}`))
  }

  const existingPosts = await client.fetch<Array<{_id: string}>>(`*[_type == "instagramPost"]{_id}`)
  const instagramPosts = existingPosts.length >= 6 ? [...existingPosts] : []
  if (!instagramPosts.length) {
    for (const [index, portrait] of portraits.slice(0, 6).entries()) {
      const post = await client.create({
        _type: 'instagramPost',
        image: portrait,
        caption: ['silk light', 'carousel dusk', 'vanity hour', 'blush swirl', 'soft set', 'twirl ready'][index],
        permalink: 'https://instagram.com/carouselhair',
      })
      instagramPosts.push(post)
    }
  }

  const heroImage = await uploadImage(
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800&q=80',
    'hero.jpg',
    'Carousel Hair hero',
  )
  const videoPoster = await uploadImage(
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80',
    'video-poster.jpg',
    'Carousel film still',
  )
  const aboutHero = await uploadImage(
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1600&q=80',
    'about-hero.jpg',
    'Founder portrait',
  )

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteTitle: 'Carousel Hair Extensions',
    announcement: 'Free ribbon wrapping on every set · 18" and 20" in stock',
    footerBlurb:
      'Hand-selected hair extensions for girls who want a little more swirl, shine, and carousel magic.',
    navigation: [
      {_type: 'navLink', _key: key(), label: 'Home', linkType: 'internal', internalPath: '/'},
      {_type: 'navLink', _key: key(), label: 'Shop', linkType: 'internal', internalPath: '/shop'},
      {_type: 'navLink', _key: key(), label: 'About', linkType: 'internal', internalPath: '/about'},
      {_type: 'navLink', _key: key(), label: 'Contact', linkType: 'internal', internalPath: '/contact'},
    ],
    email: 'hello@carouselhair.com',
    phone: '(305) 555-0188',
    address: 'The Carousel Atelier\n1422 Palmetto Lane\nMiami, FL',
    hours: 'Tue–Sat, 11–6\nPrivate fittings by appointment',
    instagramHandle: 'carouselhair',
    instagramUrl: 'https://instagram.com/carouselhair',
    seo: {
      _type: 'seo',
      title: 'Carousel Hair Extensions',
      description: 'Whimsical, feminine hair extensions in 18" and 20".',
    },
  })

  await client.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
    title: 'Home',
    pageBuilder: [
      {
        _type: 'hero',
        _key: key(),
        eyebrow: 'A theatrical beauty world',
        scriptAccent: 'Love,',
        headline: 'loudly.',
        subcopy:
          'Carousel is an invitation to make the getting-ready moment feel like the main event.',
        scrollCue: 'Scroll to enter',
        cta: {_type: 'cta', label: 'Shop the boutique', linkType: 'internal', internalPath: '/shop'},
        image: heroImage,
      },
      {
        _type: 'brandStatement',
        _key: key(),
        statement:
          'A beauty identity with the nerve to be romantic — heirloom sweetness punctuated by a rich theatrical red.',
        statementAccent: 'the nerve to be romantic',
      },
      {
        _type: 'featuredIn',
        _key: key(),
        heading: 'As seen on',
        features: press.map((item) => ({_type: 'reference', _key: key(), _ref: item._id})),
      },
      {
        _type: 'portraitGallery',
        _key: key(),
        eyebrow: '01 / Image world',
        heading: 'The dressing room',
        body: 'The photography belongs to one spirited private universe: boudoir light, decadent texture, flirty colour, and an intimate point of view. Let the sets carry the romance; typography arrives quietly and never competes.',
        portraits: portraits.map((portrait, index) => ({
          ...portrait,
          caption: ['Rich tone', undefined, 'Soft focus', 'Object of affection'][index],
        })),
      },
      {
        _type: 'editorialSplit',
        _key: key(),
        eyebrow: '02 / Website direction',
        heading: 'Romance,',
        headingLine: 'with a pulse.',
        body: 'An editorial shopfront where large imagery acts as the room, and each composition is allowed a little air.',
        chromeLeft: 'Menu',
        chromeRight: 'Journal / Bag',
        panelEyebrow: 'The hair story, continued',
        panelHeadline: 'Take up space.',
        panelSubcopy:
          'Soft volume. Grand entrances. A little extra, exactly where you want it.',
        cta: {_type: 'cta', label: 'Enter the collection', linkType: 'internal', internalPath: '/shop'},
        image: portraits[6] || portraits[0],
      },
      {
        _type: 'productCarousel',
        _key: key(),
        eyebrow: 'the favorites',
        heading: 'Bestsellers with a bow',
        collection: {_type: 'reference', _ref: bestCollection._id},
      },
      {
        _type: 'personalCuration',
        _key: key(),
        eyebrow: 'The Carousel Signature',
        heading: 'Not a look.',
        headingLine: 'A scene.',
        body: 'Velvet curtains bring the drama, tulle and powder-blue rooms turn it tender. The visual language is expressive but never noisy: a keepsake theatre for hair that wants its own spotlight.',
        image: portraits[3] || portraits[0],
      },
      {
        _type: 'videoMoment',
        _key: key(),
        heading: 'A film from the fitting room',
        subcopy: 'Scroll and the mask blooms open — a little carousel magic for the homepage.',
        videoUrl: 'https://videos.pexels.com/video-files/3067600/3067600-uhd_2560_1440_24fps.mp4',
        poster: videoPoster,
      },
      {
        _type: 'productCarousel',
        _key: key(),
        eyebrow: 'just arrived',
        heading: 'New lengths on the ride',
        collection: {_type: 'reference', _ref: newCollection._id},
      },
      {
        _type: 'testimonialsBlock',
        _key: key(),
        heading: 'Notes from the girls',
        testimonials: testimonials.map((item) => ({_type: 'reference', _key: key(), _ref: item._id})),
      },
      {
        _type: 'instagramStrip',
        _key: key(),
        eyebrow: 'Follow the feeling',
        heading: 'Come backstage',
        body: 'Snapshots, set lists, and the occasional grand entrance. Tag your transformation for a chance to take center stage.',
        ctaLabel: 'Open Instagram',
        posts: instagramPosts.map((item) => ({_type: 'reference', _key: key(), _ref: item._id})),
      },
    ],
  })

  await client.createOrReplace({
    _id: 'aboutPage',
    _type: 'aboutPage',
    title: 'About',
    eyebrow: 'the girl behind the swirl',
    headline: 'Built in a pink studio, for hair that wants a plot twist',
    heroImage: aboutHero,
    story: [
      {
        _type: 'block',
        _key: key(),
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: key(),
            marks: [],
            text: 'Carousel Hair Extensions started as a vanity experiment: silkier lengths, softer pink light, and a shop that felt like a jewelry box instead of a catalog. Every set is chosen for movement, shine, and that little theatrical lift when you turn your head.',
          },
        ],
      },
      {
        _type: 'block',
        _key: key(),
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: key(),
            marks: [],
            text: 'We keep the collection tight — 18" for a bounce, 20" for drama, and a handful of styles that come in both. The studio is small on purpose. The bows are not.',
          },
        ],
      },
    ],
    moments: portraits.slice(0, 3),
  })

  await client.createOrReplace({
    _id: 'contactPage',
    _type: 'contactPage',
    title: 'Contact',
    eyebrow: 'a note from the vanity',
    headline: 'Write the studio',
    intro:
      'Fittings, color questions, and custom bows — send a note. The contact details live in Site Settings so they stay in one pretty place.',
    note: [
      {
        _type: 'block',
        _key: key(),
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: key(),
            marks: [],
            text: 'Private appointments are Tuesday through Saturday. If you are sending a vanity-bag order, include your preferred length and a photo in natural light.',
          },
        ],
      },
    ],
  })

  console.log('Seed complete.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
