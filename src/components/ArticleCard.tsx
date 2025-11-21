import React from 'react'
import useInView from '../hooks/useInView'

type Props = {
  title: string
  excerpt?: string
  image?: string
}

export default function ArticleCard({ title, excerpt, image }: Props) {
  const { ref, isInView } = useInView<HTMLDivElement>({ rootMargin: '0px 0px -80px 0px' })

  return (
    <article
      ref={ref}
      className={`group relative h-full overflow-hidden rounded-[28px] p-6 text-neutral-900 transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_40px_110px_rgba(16,38,74,0.18)] luxe-card ${
        isInView ? 'animate-fadeInUp' : 'opacity-0 translate-y-4'
      }`}
    >
      <span
        className="pointer-events-none absolute top-6 right-6 inline-flex h-2.5 w-2.5 animate-pulseGlow rounded-full bg-brand-sky/80"
        aria-hidden
      />
      {image ? (
        <div className="relative overflow-hidden rounded-[22px] border border-white/70 bg-white/70 aspect-[16/9]">
          <div className="absolute inset-0 bg-hero-sheen opacity-0 transition duration-300 group-hover:opacity-60" aria-hidden />
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="relative aspect-[16/9] overflow-hidden rounded-[22px] border border-white/60 bg-white/80">
          <div className="absolute inset-0 bg-hero-sheen opacity-60" aria-hidden />
          <div className="relative flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-neutral-500">
            Image loading
          </div>
        </div>
      )}
      <h3 className="mt-6 text-[1.35rem] font-semibold leading-snug text-brand-deep">{title}</h3>
      {excerpt && <p className="mt-3 text-sm text-neutral-700/90">{excerpt}</p>}
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-2 text-brand transition-colors group-hover:text-brand-sky">
          Read more
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M6 9h6m0 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <span className="text-xs uppercase tracking-[0.35em] text-neutral-500">journal</span>
      </div>
    </article>
  )
}
