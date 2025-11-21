import React from 'react'
import { useParams, Link } from 'react-router-dom'
import SocialShare from '../components/SocialShare'
import RelatedArticles from '../components/RelatedArticles'
import { CALENDLY_URL } from '../config/site'
import { openCalendlyPopup } from '../utils/openCalendly'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { useContentfulArticle } from '../hooks/useContentfulArticles'

export default function ArticleDetail() {
  const { slug } = useParams()
  const { article, loading, error } = useContentfulArticle(slug)
  const pageTitle = article ? `${article.title} | Clinic Alpha` : 'Article | Clinic Alpha'
  const pageDescription =
    article?.excerpt ?? "Explore evidence-led resources on women's hormone health from Clinic Alpha."
  const body = article?.body ?? article?.excerpt ?? ''
  const bodyParagraphs = body.split(/\n\s*\n/).filter((paragraph) => paragraph.trim().length > 0)

  usePageMetadata({
    title: pageTitle,
    description: pageDescription,
  })

  if (loading) {
    return (
      <main id="main" className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-[28px] p-8 text-sm text-brand-deep/70 luxe-card">
          Loading article…
        </div>
      </main>
    )
  }

  if (!article) {
    return (
      <main id="main" className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-[28px] p-8 luxe-card">
          <h2 className="text-2xl font-display text-brand-deep">Article not found</h2>
          <p className="mt-2 text-sm text-neutral-700">
            Try our <Link to="/articles" className="link-underline">articles</Link> list.
          </p>
          {error && <p className="mt-4 text-sm text-accent-bold">{error}</p>}
        </div>
      </main>
    )
  }

  return (
    <main id="main" className="mx-auto max-w-6xl px-6 py-20">
      <article className="relative overflow-hidden rounded-[36px] p-10 animate-fadeInUp luxe-shell">
        <div className="absolute inset-0 bg-hero-sheen opacity-55" aria-hidden />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.45em] text-brand luxe-chip">
              <span className="h-2 w-2 rounded-full bg-brand-sky" aria-hidden />
              In-depth
            </span>
            <h1 className="mt-4 text-4xl font-display text-brand-deep md:text-[2.8rem]">{article.title}</h1>
          </div>
          <div className="text-sm text-neutral-700">
            <div>By {article.author}</div>
            {article.tags && article.tags.length > 0 && (
              <div className="mt-1 uppercase tracking-[0.3em] text-brand/70">{article.tags.join(' • ')}</div>
            )}
          </div>
        </div>
        <p className="relative mt-6 text-lg text-neutral-700">{article.excerpt}</p>
        {article.image && (
          <figure className="relative mt-8 overflow-hidden rounded-[28px] border border-white/50 bg-white/70">
            <div className="absolute inset-0 bg-hero-sheen opacity-50" aria-hidden />
            <img
              src={article.image}
              alt={article.title}
              className="relative aspect-[16/9] w-full object-cover"
              loading="lazy"
            />
          </figure>
        )}
        <div className="relative mt-8 space-y-6 text-neutral-700 leading-relaxed">
          {bodyParagraphs.map((paragraph, idx) => (
            <p key={idx} className="text-base whitespace-pre-line">
              {paragraph.trim()}
            </p>
          ))}
        </div>
        <div className="relative mt-12 flex flex-col gap-6 border-t border-white/50 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-xs uppercase tracking-[0.4em] text-brand/70">Share</div>
            <SocialShare title={article.title} url={window.location.href} />
          </div>
          <div className="relative overflow-hidden rounded-[28px] p-6 md:flex md:items-center md:justify-between luxe-card">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-tint/25 via-white to-accent-soft/22 opacity-25" aria-hidden />
            <div className="relative">
              <h3 className="text-lg font-semibold text-brand-deep md:text-xl">Ready to personalise this guidance?</h3>
              <p className="mt-2 text-sm text-neutral-700">
                Book a complimentary discovery call to map your hormone goals and architect an action plan with our team.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openCalendlyPopup(CALENDLY_URL)}
              className="relative mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold btn-glow btn-primary md:mt-0"
            >
              Book 15-minute consult
            </button>
          </div>
        </div>
        <div className="relative">
          <RelatedArticles tags={article.tags} />
        </div>
      </article>
    </main>
  )
}
