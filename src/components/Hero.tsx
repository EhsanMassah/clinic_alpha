import React, { useEffect, useRef } from 'react'
import { CALENDLY_URL } from '../config/site'
import { openCalendlyPopup } from '../utils/openCalendly'
import homepageImage from '../../images/homepage.avif'

export default function Hero() {
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const handler = () => {
      if (!imgRef.current) return
      const scrolled = window.scrollY
      imgRef.current.style.transform = `translateY(${scrolled * 0.12}px)`
    }
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <section aria-label="Hero" className="relative overflow-hidden bg-gradient-to-br from-cream-soft via-white to-brand-tint/60 pt-12 pb-28 text-brand-deep md:pt-20 md:pb-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[40px] border border-white/60 bg-white/85 shadow-[0_28px_90px_rgba(16,38,74,0.14)] backdrop-blur-lg">
          <div className="absolute inset-0 bg-hero-sheen opacity-55 mix-blend-screen" aria-hidden />
          <img
            ref={imgRef}
            src={homepageImage}
            alt="Clinic Alpha consultation scene"
            loading="eager"
            className="hero-img relative h-full w-full object-cover parallax"
          />
        </div>
      </div>

      <div className="relative mx-auto grid max-w-6xl items-start gap-12 px-6 pt-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-5 py-1.5 text-xs uppercase tracking-[0.5em] text-brand/80 backdrop-blur-sm animate-fadeInUp">
            Functional wellness studio
          </span>
          <h1 className="mt-7 text-4xl font-display font-semibold leading-[1.05] tracking-tight md:text-6xl animate-fadeInUp">
            Precision hormone care for grounded nervous systems.
          </h1>
          <p
            className="mt-6 text-lg text-neutral-700 md:text-xl animate-fadeInUp"
            style={{ animationDelay: '140ms' }}
          >
            Clinic Alpha blends precision diagnostics, rituals, and stories that honour every season of womanhood. Glide
            through immersive guides, layered protocols, and signature consultations.
          </p>
          <div
            className="mt-10 flex flex-wrap items-center gap-4 animate-fadeInUp"
            style={{ animationDelay: '220ms' }}
          >
            <a
              href="#articles"
              role="button"
              className="inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold btn-glow btn-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
            >
              <span>Explore the library</span>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 10h10m0 0-4-4m4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </a>
            <button
              type="button"
              onClick={() => openCalendlyPopup(CALENDLY_URL)}
              className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/90 px-6 py-3 text-sm font-semibold text-brand transition hover:border-brand-sky/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
            >
              Book a consult
            </button>
          </div>

          <div className="mt-12 grid max-w-xl gap-4 text-sm text-neutral-700 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/85 p-4 backdrop-blur-sm">
              <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-tint/80 text-xs font-semibold text-brand-deep">
                01
              </span>
              <p>Layered diagnostics and strategy pieces to unmask hidden patterns.</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/85 p-4 backdrop-blur-sm">
              <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-tint/80 text-xs font-semibold text-brand-deep">
                02
              </span>
              <p>Tactile rituals, nervous system hygiene, and nourishment frameworks.</p>
            </div>
          </div>
        </div>

        <div className="relative animate-rise">
          <div className="mt-6 rounded-3xl border border-white/65 bg-white/90 p-5 text-sm text-brand-deep shadow-[0_20px_60px_rgba(16,38,74,0.12)] backdrop-blur-lg md:mt-0">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.4em] text-brand/70">Clients reporting glow</div>
                <div className="mt-2 text-2xl font-semibold text-brand">92%</div>
              </div>
              <div className="text-xs uppercase tracking-[0.3em] text-brand/70">Real stories</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
