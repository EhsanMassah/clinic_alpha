import { createClient, type EntrySkeletonType } from 'contentful'

type ArticleEntryFields = {
  title: string
  slug: string
  excerpt?: string
  body?: string
  coverImage?: {
    sys: { id: string }
    fields: {
      title: string
      file: {
        url: string
        details?: {
          image?: {
            width: number
            height: number
          }
        }
        contentType?: string
      }
    }
  }
  heroImage?: ArticleEntryFields['coverImage']
  tags?: string[]
  featured?: boolean
  publishDate?: string
}

export type CmsArticle = {
  id: string
  title: string
  slug: string
  excerpt?: string
  body?: string
  image?: string
  tags?: string[]
  featured?: boolean
  publishDate?: string
}

const space = import.meta.env.VITE_CONTENTFUL_SPACE_ID
const environment = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT ?? 'master'
const token = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN
const previewToken = import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN

export const hasContentfulConfig = Boolean(space && token)

function getClient(usePreview = false) {
  if (!hasContentfulConfig) {
    throw new Error('Contentful credentials not configured')
  }

  return createClient({
    space,
    environment,
    accessToken: usePreview && previewToken ? previewToken : token,
    host: usePreview && previewToken ? 'preview.contentful.com' : 'cdn.contentful.com',
  })
}

function mapArticle(entry: EntrySkeletonType<ArticleEntryFields>): CmsArticle {
  const fields = entry.fields as ArticleEntryFields
  const imageAsset = fields.coverImage ?? fields.heroImage
  const image = imageAsset?.fields?.file?.url ? `https:${imageAsset.fields.file.url}` : undefined

  return {
    id: entry.sys?.id ?? fields.slug ?? '',
    title: fields.title,
    slug: fields.slug,
    excerpt: fields.excerpt,
    body: fields.body,
    image,
    tags: fields.tags ?? [],
    featured: fields.featured ?? false,
    publishDate: fields.publishDate,
  }
}

export async function fetchArticlesFromContentful(options: { preview?: boolean } = {}) {
  if (!hasContentfulConfig) return []
  const client = getClient(options.preview)

  const response = await client.getEntries<ArticleEntryFields>({
    content_type: 'article',
    order: '-fields.publishDate,-sys.createdAt',
  })

  return response.items.map(mapArticle)
}

export async function fetchArticleBySlugFromContentful(slug: string, options: { preview?: boolean } = {}) {
  if (!hasContentfulConfig) return undefined
  const client = getClient(options.preview)
  const response = await client.getEntries<ArticleEntryFields>({
    content_type: 'article',
    limit: 1,
    'fields.slug': slug,
  })
  const [entry] = response.items
  return entry ? mapArticle(entry) : undefined
}
