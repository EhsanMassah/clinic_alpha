import React, { useMemo, useState } from 'react'
import ArticleCard from './ArticleCard'
import { Link } from 'react-router-dom'
import { openCalendlyPopup } from '../utils/openCalendly'
import { CALENDLY_URL } from '../config/site'
import { useContentfulArticles } from '../hooks/useContentfulArticles'
import type { CmsArticle } from '../services/contentful'

type Props = {
  data?: CmsArticle[]
  loading?: boolean
  error?: string | null
}

export default function ArticleList({ data, loading: externalLoading, error: externalError }: Props) {
  const [query, setQuery] = useState('')
  const shouldFetch = typeof data === 'undefined'
  const { articles, loading: internalLoading, error: internalError } = useContentfulArticles({ enabled: shouldFetch })
  const loading = shouldFetch ? internalLoading : Boolean(externalLoading)
  const error = shouldFetch ? internalError : externalError ?? null
  const collection = data ?? articles
  const filtered = useMemo(
    () => collection.filter((a) => a.title.toLowerCase().includes(query.toLowerCase())),
    [collection, query]
  )

  const featured = collection.find((a) => a.featured)

  return (
    <section id="articles" aria-labelledby="articles-title">
      <h2 id="articles-title" className="sr-only">Articles</h2>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:gap-3">
          <input
            aria-label="Search articles"
            placeholder="Search articles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-white/70 bg-white/95 px-5 py-2.5 text-sm text-brand-deep shadow-[0_12px_28px_rgba(16,38,74,0.12)] placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 md:w-72"
          />
          <Link
            to="/articles"
            className="text-xs uppercase tracking-[0.4em] text-brand-deep/50 transition hover:text-brand"
          >
            See all
          </Link>
        </div>
        <button
          type="button"
          onClick={() => openCalendlyPopup(CALENDLY_URL)}
          className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-brand-deep transition hover:text-brand luxe-chip"
        >
          Book consult
        </button>
      </div>

      {loading && <div className="rounded-3xl p-10 text-sm text-brand-deep/70 luxe-card">Loading articles…</div>}
      {error && (
        <div className="rounded-3xl border border-accent-soft/50 bg-accent-soft/15 p-5 text-sm text-brand-deep">
          {error}
        </div>
      )}

      {featured && (
        <div className="relative mb-10 overflow-hidden rounded-[32px] p-10 animate-fadeInUp luxe-shell">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-tint/30 via-white to-accent-soft/22 opacity-25" aria-hidden />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-tint/45 bg-white/75 px-4 py-1 text-xs uppercase tracking-[0.45em] text-brand-deep/70">
                <span className="h-2 w-2 rounded-full bg-brand-sky" aria-hidden />
                Spotlight
              </div>
              <h3 className="mt-5 text-3xl font-display font-semibold text-brand-deep md:text-4xl">
                Featured: {featured.title}
              </h3>
              <p className="mt-4 max-w-2xl text-neutral-700">
                {featured.excerpt}
              </p>
            </div>
            <Link
              to={`/articles/${featured.slug}`}
              className="inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold btn-glow btn-primary shadow-glow"
            >
              Read featured
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M6 9h6m0 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <Link
            key={a.slug}
            to={`/articles/${a.slug}`}
            className="group block h-full rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
          >
            <ArticleCard title={a.title} excerpt={a.excerpt} image={a.image} />
          </Link>
        ))}
      </div>
    </section>
  )
}
