import {CalendarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const websiteCampaignType = defineType({
  name: 'websiteCampaign',
  title: 'Website Modal',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'publishing', title: 'Publishing'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Campaign name',
      type: 'string',
      description: 'Used inside Studio only.',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      type: 'string',
      group: 'publishing',
      initialValue: 'inactive',
      options: {
        list: [
          {title: 'Inactive', value: 'inactive'},
          {title: 'Active', value: 'active'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startsAt',
      title: 'Starts at',
      type: 'datetime',
      group: 'publishing',
      description: 'Optional. Leave empty to begin immediately when active.',
    }),
    defineField({
      name: 'endsAt',
      title: 'Ends at',
      type: 'datetime',
      group: 'publishing',
      description: 'Optional. Leave empty to keep running until made inactive.',
      validation: (rule) =>
        rule.custom((endsAt, context) => {
          const startsAt = context.document?.startsAt
          if (!endsAt || typeof startsAt !== 'string') return true
          return new Date(endsAt as string) > new Date(startsAt)
            ? true
            : 'The end date must be after the start date.'
        }),
    }),
    defineField({
      name: 'image',
      type: 'altImage',
      group: 'content',
    }),
    defineField({
      name: 'eyebrow',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heading',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      type: 'text',
      rows: 4,
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cta',
      title: 'Button',
      type: 'cta',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      startsAt: 'startsAt',
      media: 'image',
    },
    prepare({title, status, startsAt, media}) {
      const schedule = startsAt
        ? ` · starts ${new Date(startsAt).toLocaleDateString()}`
        : ''
      return {
        title: title || 'Untitled website modal',
        subtitle: `${status === 'active' ? 'Active' : 'Inactive'}${schedule}`,
        media,
      }
    },
  },
})
