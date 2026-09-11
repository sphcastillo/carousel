import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'About',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'headline', type: 'string'}),
    defineField({
      name: 'heroImage',
      type: 'altImage',
    }),
    defineField({
      name: 'story',
      title: 'Story',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'moments',
      title: 'Founder moments',
      type: 'array',
      of: [defineArrayMember({type: 'altImage'})],
    }),
    defineField({
      name: 'seo',
      type: 'seo',
    }),
  ],
})
