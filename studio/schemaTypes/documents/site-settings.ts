import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'brand', title: 'Brand', default: true},
    {name: 'header', title: 'Header'},
    {name: 'contact', title: 'Contact'},
    {name: 'social', title: 'Social'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'siteTitle',
      type: 'string',
      group: 'brand',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      type: 'altImage',
      group: 'brand',
    }),
    defineField({
      name: 'footerBlurb',
      type: 'text',
      rows: 3,
      group: 'brand',
    }),
    defineField({
      name: 'announcement',
      type: 'string',
      group: 'header',
      description: 'Optional ribbon shown above the header',
    }),
    defineField({
      name: 'navigation',
      type: 'array',
      group: 'header',
      of: [defineArrayMember({type: 'navLink'})],
    }),
    defineField({name: 'email', type: 'string', group: 'contact'}),
    defineField({name: 'phone', type: 'string', group: 'contact'}),
    defineField({name: 'address', type: 'text', rows: 2, group: 'contact'}),
    defineField({name: 'hours', type: 'text', rows: 3, group: 'contact'}),
    defineField({
      name: 'instagramHandle',
      type: 'string',
      group: 'social',
      description: 'Without the @',
    }),
    defineField({
      name: 'instagramUrl',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'siteTitle', media: 'logo'},
  },
})
