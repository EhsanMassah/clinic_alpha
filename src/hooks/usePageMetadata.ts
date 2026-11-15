import { useEffect } from 'react'
import seo from '../config/seo.json'

type Options = {
  title: string
  description?: string
  /** Canonical path, e.g. "/about". Defaults to the current pathname. */
  path?: string
  /** Absolute URL or site-relative path of the social sharing image. */
  image?: string
  type?: 'website' | 'article'
  /** Keep this page out of search results (not-found and error states). */
  noindex?: boolean
}

type StaticRoute = keyof typeof seo.routes

/** Title and description for a static route, shared with the build-time SEO script. */
export function routeMeta(path: StaticRoute) {
  const { title, description } = seo.routes[path]
  return { title, description, path }
}

export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl
  return `${seo.siteUrl}${pathOrUrl === '/' ? '/' : pathOrUrl.replace(/\/+$/, '')}`
}

function upsert(selector: string, create: () => HTMLElement, attribute: string, value: string) {
  let element = document.head.querySelector<HTMLElement>(selector)
  if (!element) {
    element = create()
    document.head.appendChild(element)
  }
  element.setAttribute(attribute, value)
}

function setMeta(key: 'name' | 'property', id: string, content: string) {
  upsert(
    `meta[${key}="${id}"]`,
    () => {
      const meta = document.createElement('meta')
      meta.setAttribute(key, id)
      return meta
    },
    'content',
    content
  )
}

export function usePageMetadata({ title, description, path, image, type = 'website', noindex = false }: Options) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    const url = absoluteUrl(path ?? window.location.pathname)
    const imageUrl = absoluteUrl(image ?? seo.defaultImage)

    document.title = title
    setMeta('property', 'og:title', title)
    setMeta('name', 'twitter:title', title)
    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
      setMeta('name', 'twitter:description', description)
    }
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:image', imageUrl)
    setMeta('name', 'twitter:image', imageUrl)
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large')
    upsert(
      'link[rel="canonical"]',
      () => {
        const link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        return link
      },
      'href',
      url
    )
  }, [title, description, path, image, type, noindex])
}
