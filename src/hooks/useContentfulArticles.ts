import { useEffect, useMemo, useState } from 'react'
import { hasContentfulConfig, fetchArticlesFromContentful, fetchArticleBySlugFromContentful, type CmsArticle } from '../services/contentful'
import { articles as fallbackArticles, type Article as StaticArticle } from '../data/articles'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function useContentfulArticles(options: { enabled?: boolean } = {}) {
  const enabled = options.enabled ?? true
  const [status, setStatus] = useState<Status>(hasContentfulConfig && enabled ? 'loading' : 'success')
  const [articles, setArticles] = useState<CmsArticle[]>(() =>
    hasContentfulConfig ? [] : fallbackArticles.map(convertStaticArticle)
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!enabled) return
      if (!hasContentfulConfig) return
      try {
        setStatus('loading')
        const cmsArticles = await fetchArticlesFromContentful()
        if (!cancelled) {
          setArticles(cmsArticles)
          setStatus('success')
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err)
          setError(err instanceof Error ? err.message : 'Unable to load articles')
          setArticles(fallbackArticles.map(convertStaticArticle))
          setStatus('error')
        }
      }
    }
    if (enabled) load()
    return () => {
      cancelled = true
    }
  }, [enabled])

  return useMemo(
    () => ({
      articles,
      loading: status === 'loading',
      error,
      isUsingFallback: !hasContentfulConfig || status === 'error',
    }),
    [articles, error, status]
  )
}

export function useContentfulArticle(slug: string | undefined) {
  const [article, setArticle] = useState<CmsArticle | undefined>(() =>
    slug ? findFallbackArticle(slug) : undefined
  )
  const [status, setStatus] = useState<Status>(slug && hasContentfulConfig ? 'loading' : 'success')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!slug) return
      if (!hasContentfulConfig) {
        setArticle(findFallbackArticle(slug))
        return
      }
      try {
        setStatus('loading')
        const cmsArticle = await fetchArticleBySlugFromContentful(slug)
        if (!cancelled) {
          if (cmsArticle) {
            setArticle(cmsArticle)
            setStatus('success')
          } else {
            setArticle(undefined)
            setStatus('error')
            setError('Article not found')
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err)
          setArticle(findFallbackArticle(slug))
          setStatus('error')
          setError(err instanceof Error ? err.message : 'Unable to load article')
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  return {
    article,
    loading: status === 'loading',
    error,
    isUsingFallback: !hasContentfulConfig || status === 'error',
  }
}

function convertStaticArticle(article: StaticArticle): CmsArticle {
  return {
    id: article.slug,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    body: article.content,
    image: article.image?.startsWith('//') ? `https:${article.image}` : article.image,
    tags: article.tags,
    featured: article.featured,
    publishDate: article.publishDate,
  }
}

function findFallbackArticle(slug: string) {
  const match = fallbackArticles.find((item) => item.slug === slug)
  return match ? convertStaticArticle(match) : undefined
}
