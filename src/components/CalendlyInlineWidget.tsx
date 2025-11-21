import React from 'react'
import { CALENDLY_URL } from '../config/site'

export default function CalendlyInlineWidget() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-gradient-to-br from-cream-soft via-white to-brand-tint/20 p-8 shadow-[0_22px_60px_rgba(16,38,74,0.14)]">
      <div className="absolute inset-0 bg-hero-sheen opacity-45" aria-hidden />
      <div className="relative space-y-3 text-brand-deep">
        <p className="text-xs uppercase tracking-[0.35em] text-brand-deep/60">Book a consult</p>
        <h3 className="text-2xl font-display">Prefer WhatsApp? Message us directly.</h3>
        <p className="text-sm text-neutral-700">
          Our team will confirm your slot and share preparation steps. Send us a note and we will reply promptly.
        </p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold btn-glow btn-primary shadow-glow"
        >
          Message on WhatsApp
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M6 9h6m0 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </a>
      </div>
    </div>
  )
}
