import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const RSVP_URL = 'https://forms.gle/aKjkhZeSzswky8Le8'
const LEAFLET_IMAGE = '/images/menopause-leaflet.png'

export default function EventPromo() {
  const [hasImage, setHasImage] = useState(true)

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-cream-soft via-white to-brand-tint/15 shadow-[0_28px_80px_rgba(16,38,74,0.16)]">
        <div className="absolute inset-0 bg-hero-sheen opacity-55" aria-hidden />
        <div className="relative grid gap-10 p-8 md:grid-cols-2 md:p-10">
          <div className="flex flex-col justify-center gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-[11px] uppercase tracking-[0.32em] text-brand-deep shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brand-sky" aria-hidden />
              Free Live Session
            </span>
            <h2 className="text-3xl font-display text-brand-deep md:text-[2.4rem]">
              Struggling with menopause symptoms?
            </h2>
            <p className="text-sm text-neutral-700 md:text-base">
              Join our free live session on{' '}
              <strong className="font-semibold text-brand-deep">29th November at 10:00 AM</strong> to learn practical
              steps for hot flushes, sleep disruption, brain fog, and mood changes. Spaces are limited—reserve yours
              now.
            </p>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex items-start gap-2">
                <span aria-hidden className="mt-[3px] h-2 w-2 rounded-full bg-brand-sky" />
                How to map your symptoms and know what to test
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden className="mt-[3px] h-2 w-2 rounded-full bg-brand-sky" />
                Evidence-based HRT options and non-hormonal supports
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden className="mt-[3px] h-2 w-2 rounded-full bg-brand-sky" />
                Lifestyle resets for calmer nights and steadier energy
              </li>
            </ul>
            <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center">
              <a
                href={RSVP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold btn-glow btn-primary shadow-glow"
              >
                Reserve free place
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M6 9h6m0 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-brand-deep/60 transition hover:text-brand"
              >
                Need to ask a question?
              </Link>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Free to attend · Registration required</p>
          </div>
          <div className="relative">
            <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-brand-sky/10 blur-3xl" aria-hidden />
            {hasImage ? (
              <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-[0_22px_64px_rgba(20,46,92,0.18)]">
                <img
                  src={LEAFLET_IMAGE}
                  alt="Struggling with menopause symptoms? Free live session details."
                  className="w-full object-cover"
                  loading="lazy"
                  onError={() => setHasImage(false)}
                />
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-brand-sky/15 via-white to-cream-warm/60 p-6 shadow-[0_22px_64px_rgba(20,46,92,0.18)]">
                <div className="flex h-full flex-col justify-between gap-4 text-brand-deep">
                  <div className="space-y-2">
                    <p className="text-[0.7rem] uppercase tracking-[0.3em] text-brand-deep/65">Leaflet preview</p>
                    <h3 className="text-2xl font-display leading-snug">Struggling With Menopause Symptoms?</h3>
                    <p className="text-sm text-neutral-700">
                      Date: 29th November · Time: 10:00 AM · Free to attend. Register to secure your place.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-brand-sky/30 bg-white/70 px-4 py-3 text-sm text-neutral-700">
                    Spaces are limited -- register now to secure your free place.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
