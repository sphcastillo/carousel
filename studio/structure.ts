import type {StructureResolver} from 'sanity/structure'
import {
  BasketIcon,
  CogIcon,
  EnvelopeIcon,
  HeartIcon,
  HomeIcon,
  ImageIcon,
  StarIcon,
  TagIcon,
  UsersIcon,
} from '@sanity/icons'
import {PRODUCT_CATEGORIES} from './schemaTypes/documents/product'

const SINGLETONS = ['siteSettings', 'homePage', 'aboutPage', 'contactPage']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Carousel Hair')
    .items([
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.listItem()
        .title('Home')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem()
        .title('About')
        .icon(UsersIcon)
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .title('Contact')
        .icon(EnvelopeIcon)
        .child(S.document().schemaType('contactPage').documentId('contactPage')),
      S.divider(),
      S.listItem()
        .title('Products')
        .icon(BasketIcon)
        .child(
          S.list()
            .title('Products')
            .items([
              S.listItem()
                .title('All products')
                .icon(BasketIcon)
                .child(S.documentTypeList('product').title('All products')),
              ...PRODUCT_CATEGORIES.map((category) =>
                S.listItem()
                  .title(category.title)
                  .child(
                    S.documentTypeList('product')
                      .title(category.title)
                      .filter('_type == "product" && category == $category')
                      .params({category: category.value}),
                  ),
              ),
            ]),
        ),
      S.documentTypeListItem('collection').title('Collections').icon(TagIcon),
      S.divider(),
      S.documentTypeListItem('testimonial').title('Testimonials').icon(HeartIcon),
      S.documentTypeListItem('pressFeature').title('Press Features').icon(StarIcon),
      S.documentTypeListItem('instagramPost').title('Instagram Posts').icon(ImageIcon),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !SINGLETONS.includes(item.getId() as string) &&
          !['product', 'collection', 'testimonial', 'pressFeature', 'instagramPost'].includes(
            item.getId() as string,
          ),
      ),
    ])
