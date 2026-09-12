import {defineArrayMember, defineType} from 'sanity'

export const pageBuilderType = defineType({
  name: 'pageBuilder',
  title: 'Page builder',
  type: 'array',
  of: [
    defineArrayMember({type: 'hero'}),
    defineArrayMember({type: 'brandStatement'}),
    defineArrayMember({type: 'featuredIn'}),
    defineArrayMember({type: 'portraitGallery'}),
    defineArrayMember({type: 'editorialSplit'}),
    defineArrayMember({type: 'productCarousel'}),
    defineArrayMember({type: 'personalCuration'}),
    defineArrayMember({type: 'testimonialsBlock'}),
    defineArrayMember({type: 'videoMoment'}),
    defineArrayMember({type: 'instagramStrip'}),
  ],
  options: {
    insertMenu: {
      views: [{name: 'grid'}],
    },
  },
})
