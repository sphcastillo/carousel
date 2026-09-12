import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlockElementIcon} from '@sanity/icons'

export const heroType = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({
      name: 'headline',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'scriptAccent',
      title: 'Script accent',
      type: 'string',
      description: 'Optional script flourish shown above or beside the headline',
    }),
    defineField({name: 'subcopy', type: 'text', rows: 3}),
    defineField({
      name: 'scrollCue',
      title: 'Scroll cue',
      type: 'string',
      description: 'Vertical label on the right edge of the hero, e.g. “Scroll to enter”.',
    }),
    defineField({name: 'cta', type: 'cta'}),
    defineField({
      name: 'image',
      type: 'altImage',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'headline', media: 'image'},
    prepare({title, media}) {
      return {title: title || 'Hero', subtitle: 'Hero', media}
    },
  },
})

export const productCarouselType = defineType({
  name: 'productCarousel',
  title: 'Product carousel',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({
      name: 'heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'collection',
      type: 'reference',
      to: [{type: 'collection'}],
    }),
    defineField({
      name: 'products',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
      description: 'Optional manual product list. If empty, the collection is used.',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Product carousel', subtitle: 'Product carousel'}
    },
  },
})

export const personalCurationType = defineType({
  name: 'personalCuration',
  title: 'Personal curation',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small kicker above the heading, e.g. “The Carousel Signature”.',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headingLine',
      title: 'Heading second line',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'image',
      type: 'altImage',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'eyebrow', media: 'image'},
    prepare({title, subtitle, media}) {
      return {title: title || 'Personal curation', subtitle: subtitle || 'Personal curation', media}
    },
  },
})

export const testimonialsBlockType = defineType({
  name: 'testimonialsBlock',
  title: 'Testimonials',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({name: 'heading', type: 'string'}),
    defineField({
      name: 'testimonials',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'testimonial'}]})],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Testimonials', subtitle: 'Testimonials'}
    },
  },
})

export const featuredInType = defineType({
  name: 'featuredIn',
  title: 'Featured in',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({name: 'heading', type: 'string'}),
    defineField({
      name: 'features',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'pressFeature'}]})],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Featured in', subtitle: 'Press bar'}
    },
  },
})

export const videoMomentType = defineType({
  name: 'videoMoment',
  title: 'Video moment',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'subcopy', type: 'text', rows: 2}),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube, Vimeo, or a streaming mp4 URL. Do not upload video files to Sanity.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'poster',
      type: 'altImage',
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'poster'},
    prepare({title, media}) {
      return {title: title || 'Video moment', subtitle: 'SVG mask video', media}
    },
  },
})

export const instagramStripType = defineType({
  name: 'instagramStrip',
  title: 'Instagram strip',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      type: 'string',
      description: 'Small kicker above the heading, e.g. “Follow the feeling”.',
    }),
    defineField({name: 'heading', type: 'string'}),
    defineField({
      name: 'body',
      type: 'text',
      rows: 3,
      description: 'Quiet copy opposite the heading.',
    }),
    defineField({
      name: 'posts',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'instagramPost'}]})],
    }),
    defineField({
      name: 'ctaLabel',
      type: 'string',
      initialValue: 'Open Instagram',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Instagram', subtitle: 'Instagram strip'}
    },
  },
})

export const brandStatementType = defineType({
  name: 'brandStatement',
  title: 'Brand statement',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'statement',
      title: 'Statement',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'statementAccent',
      title: 'Statement accent',
      type: 'string',
      description: 'Italic burgundy phrase inside the statement.',
    }),
  ],
  preview: {
    select: {title: 'statement'},
    prepare({title}) {
      return {title: title || 'Brand statement', subtitle: 'Brand statement'}
    },
  },
})

export const portraitGalleryType = defineType({
  name: 'portraitGallery',
  title: 'Portrait gallery',
  type: 'object',
  icon: BlockElementIcon,
  groups: [
    {name: 'copy', title: 'Copy', default: true},
    {name: 'photos', title: 'Photographs'},
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'copy',
      description: 'Full kicker line, e.g. “01 / Image world”.',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      group: 'copy',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      group: 'copy',
      description: 'Quiet copy beside the heading.',
    }),
    defineField({
      name: 'portraits',
      title: 'Portraits',
      type: 'array',
      group: 'photos',
      of: [defineArrayMember({type: 'altImage'})],
      description:
        'The first four photographs make the collage: large left, two along the top right, one wide below.',
      validation: (rule) => rule.min(4).max(8),
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'portraits.0'},
    prepare({title, media}) {
      return {title: title || 'Portrait gallery', subtitle: 'Portrait gallery', media}
    },
  },
})

export const editorialSplitType = defineType({
  name: 'editorialSplit',
  title: 'Editorial split',
  type: 'object',
  icon: BlockElementIcon,
  groups: [
    {name: 'intro', title: 'Intro', default: true},
    {name: 'panel', title: 'Shop panel'},
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'intro',
      description: 'Full kicker line, e.g. “02 / Website direction”.',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      group: 'intro',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headingLine',
      title: 'Heading second line',
      type: 'string',
      group: 'intro',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
      group: 'intro',
      description: 'Quiet copy opposite the heading.',
    }),
    defineField({
      name: 'chromeLeft',
      title: 'Panel bar left',
      type: 'string',
      group: 'panel',
      description: 'Decorative frame label. This is not the live site navigation.',
    }),
    defineField({
      name: 'chromeRight',
      title: 'Panel bar right',
      type: 'string',
      group: 'panel',
      description: 'Decorative frame label. This is not the live site navigation.',
    }),
    defineField({
      name: 'panelEyebrow',
      title: 'Panel eyebrow',
      type: 'string',
      group: 'panel',
    }),
    defineField({
      name: 'panelHeadline',
      title: 'Panel headline',
      type: 'string',
      group: 'panel',
    }),
    defineField({
      name: 'panelSubcopy',
      title: 'Panel subcopy',
      type: 'text',
      rows: 3,
      group: 'panel',
    }),
    defineField({
      name: 'cta',
      title: 'Call to action',
      type: 'cta',
      group: 'panel',
    }),
    defineField({
      name: 'image',
      type: 'altImage',
      group: 'panel',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'panelHeadline', media: 'image'},
    prepare({title, subtitle, media}) {
      return {title: title || 'Editorial split', subtitle: subtitle || 'Editorial split', media}
    },
  },
})
