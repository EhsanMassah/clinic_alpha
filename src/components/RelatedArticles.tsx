import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useContentfulArticles } from '../hooks/useContentfulArticles'
import type { CmsArticle } from '../services/contentful'

export default function RelatedArticles({ tags }: { tags?: string[] }) {
  const { articles } = useContentfulArticles({ enabled: Boolean(tags && tags.length) })
  if (!tags || tags.length === 0) return null
  const related = useMemo(() => selectRelated(articles, tags), [articles, tags])
  if (related.length === 0) return null

  return (
    <aside className="mt-12 rounded-[28px] border border-brand-tint/35 bg-white/98 p-8 shadow-[0_24px_60px_rgba(16,38,74,0.12)]">
      <h4 className="text-lg font-display font-semibold text-brand-deep">Related articles</h4>
      <ul className="mt-4 space-y-3 text-sm text-neutral-700">
        {related.map((r) => (
          <li key={r.slug}>
            <Link to={`/articles/${r.slug}`} className="link-underline">
              {r.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

function selectRelated(all: CmsArticle[], tags: string[]) {
  return all.filter((article) => article.tags && article.tags.some((tag) => tags.includes(tag))).slice(0, 3)
}
