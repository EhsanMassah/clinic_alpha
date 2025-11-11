import React from 'react'
import { CALENDLY_URL } from '../config/site'
import { openCalendlyPopup } from '../utils/openCalendly'

export default function Footer() {
  return (
    <footer className="border-t border-brand-tint/40 bg-white/90 py-10 text-sm text-brand-deep/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="font-sans text-brand-deep/70">
          © {new Date().getFullYear()} Clinic Alpha. All rights reserved.
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="/about" className="text-brand-deep/70 transition hover:text-brand">About</a>
          <a href="/contact" className="text-brand-deep/70 transition hover:text-brand">Contact</a>
          <a href="/articles" className="text-brand-deep/70 transition hover:text-brand">Articles</a>
          <button
            type="button"
            onClick={() => openCalendlyPopup(CALENDLY_URL)}
            className="rounded-full border border-brand-tint/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand transition hover:border-brand-sky/60 hover:text-brand"
          >
            Book consult
          </button>
        </div>
      </div>
    </footer>
  )
}
