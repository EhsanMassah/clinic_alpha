
import React, { useMemo, useState } from 'react'
import ArticleList from '../components/ArticleList'
import TagFilter from '../components/TagFilter'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { useContentfulArticles } from '../hooks/useContentfulArticles'
import type { CmsArticle } from '../services/contentful'

const PAGE_SIZE = 6

export default function Articles() {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  usePageMetadata({
    title: 'Hormone Health Articles & Menopause Guides | Clinic Alpha',
    description:
      'Browse Clinic Alpha’s library of women’s hormone health insights, menopause guides, and functional medicine protocols.',
  })

  const { articles, loading, error } = useContentfulArticles()
  const tags = useMemo(() => Array.from(new Set(articles.flatMap((a) => a.tags || []))), [articles])
  const filtered = useMemo(
    () => (activeTag ? articles.filter((a) => a.tags?.includes(activeTag)) : articles),
    [activeTag, articles]
  )

  const start = (page - 1) * PAGE_SIZE
  const paged: CmsArticle[] = filtered.slice(start, start + PAGE_SIZE)

  return (
    <main id="main" className="mx-auto max-w-6xl px-6 py-20">
      <div className="relative overflow-hidden rounded-[36px] px-10 py-12 luxe-shell">
        <div className="absolute inset-0 bg-hero-sheen opacity-55" aria-hidden />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.45em] text-brand luxe-chip">
              <span className="h-2 w-2 rounded-full bg-brand-sky" aria-hidden />
              Library
            </span>
            <h2 className="mt-4 text-4xl font-display text-brand-deep md:text-[2.6rem]">Articles</h2>
          </div>
          <p className="max-w-xl text-sm text-neutral-700">
            Filter by topic or move sequentially — each article blends research-grade insight with lived practice pearls.
          </p>
        </div>

        <div className="relative mt-8">
          <TagFilter
            tags={tags}
            active={activeTag}
            onSelect={(t) => {
              setActiveTag(t)
              setPage(1)
            }}
          />
        </div>

        <div className="relative mt-4">
          <ArticleList data={paged} loading={loading} error={error ?? null} />
        </div>

        <div className="relative mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-neutral-700">
            Page {page} of {Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
          </div>
          <div className="flex gap-3">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-brand transition disabled:pointer-events-none disabled:opacity-40 hover:text-brand luxe-chip"
            >
              Prev
            </button>
          <button
            disabled={start + PAGE_SIZE >= filtered.length}
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold btn-glow btn-primary disabled:pointer-events-none disabled:opacity-40"
          >
            Next
          </button>
          </div>
        </div>
      </div>
    </main>
  )
}
