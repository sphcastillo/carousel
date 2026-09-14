import {defineArrayMember, defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'

export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Contact',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Contact',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'headline', type: 'string'}),
    defineField({
      name: 'portrait',
      title: 'Portrait',
      type: 'altImage',
      description: 'Shown beside the contact note. Use the hotspot to keep the face in frame.',
    }),
    defineField({name: 'intro', type: 'text', rows: 4}),
    defineField({
      name: 'note',
      title: 'Studio note',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'seo',
      type: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'headline', media: 'portrait'},
  },
})
