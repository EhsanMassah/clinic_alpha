import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import janWebinarLeaflet from '../../images/jan_webinar_free.jpeg'

const RSVP_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfLqsztHyaGJjGsmaTohlLTb0Nl7ixHGg5NwnfohETVqUj0-A/viewform'
const LEAFLET_IMAGE = janWebinarLeaflet

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
              Menopause Webinar
            </span>
            <h2 className="text-3xl font-display text-brand-deep md:text-[2.4rem]">
              Sleep &amp; Menopause: a live session
            </h2>
            <p className="text-sm text-neutral-700 md:text-base">
              Join me on{' '}
              <strong className="font-semibold text-brand-deep">Saturday 24th January at 10:00am</strong> for a focused
              session on why sleep becomes so disrupted during perimenopause &amp; menopause, and what actually helps.
            </p>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex items-start gap-2">
                <span aria-hidden className="mt-[3px] h-2 w-2 rounded-full bg-brand-sky" />
                The hormone–sleep connection (and what’s actually waking you up)
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden className="mt-[3px] h-2 w-2 rounded-full bg-brand-sky" />
                Practical, realistic lifestyle changes to improve sleep quality
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden className="mt-[3px] h-2 w-2 rounded-full bg-brand-sky" />
                When treatments like HRT or supplements may help with sleep
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden className="mt-[3px] h-2 w-2 rounded-full bg-brand-sky" />
                Time at the end for your questions
              </li>
            </ul>
            <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center">
              <a
                href={RSVP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold btn-glow btn-primary shadow-glow"
              >
                Register here
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
                  alt="Menopause webinar focused on sleep details."
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
                    <h3 className="text-2xl font-display leading-snug">Sleep &amp; Menopause Webinar</h3>
                    <p className="text-sm text-neutral-700">
                      Date: Saturday 24th January · Time: 10:00am · Free to attend. Register to secure your place.
                    </p>
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
