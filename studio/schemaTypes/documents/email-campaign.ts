import {EnvelopeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const emailCampaignType = defineType({
  name: 'emailCampaign',
  title: 'Email Campaign',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'settings', title: 'Settings'},
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
      group: 'settings',
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
      name: 'subject',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'previewText',
      title: 'Preview text',
      type: 'string',
      description: 'Short inbox preview shown after the subject.',
      group: 'content',
      validation: (rule) => rule.max(140),
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
    }),
    defineField({
      name: 'heading',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cta',
      title: 'Button',
      type: 'cta',
      group: 'content',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subject: 'subject',
      status: 'status',
      media: 'image',
    },
    prepare({title, subject, status, media}) {
      return {
        title: title || 'Untitled email campaign',
        subtitle: `${status === 'active' ? 'Active' : 'Inactive'} · ${subject || 'No subject'}`,
        media,
      }
    },
  },
})
