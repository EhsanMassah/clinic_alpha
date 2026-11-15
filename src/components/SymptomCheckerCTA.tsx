import React from 'react'
import { Link } from 'react-router-dom'
import { CALENDLY_URL } from '../config/site'
import { openCalendlyPopup } from '../utils/openCalendly'

export default function SymptomCheckerCTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="relative grid gap-10 overflow-hidden rounded-[36px] p-10 md:grid-cols-2 luxe-shell">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-tint/22 via-white to-accent-soft/22 opacity-25" aria-hidden />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.45em] text-brand luxe-chip">
            <span className="h-2 w-2 rounded-full bg-brand-sky" aria-hidden />
            Symptom snapshot
          </span>
          <h2 className="mt-4 text-3xl font-display text-brand-deep md:text-[2.3rem]">Not sure where to start?</h2>
          <p className="mt-4 text-sm text-neutral-700">
            Complete our five-minute menopause questionnaire, based on the Menopause Rating Scale and NICE guidance.
          </p>
          <p className="mt-3 text-sm text-neutral-700">
            You’ll get a clear two-page report of your symptoms and history to print, save or email to yourself and
            take to your GP.
          </p>
        </div>
        <div className="relative flex flex-col gap-4">
          <Link
            to="/menopause-assessment"
            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-brand transition hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 luxe-chip"
          >
            Take the symptom checker
          </Link>
        <button
          type="button"
          onClick={() => openCalendlyPopup(CALENDLY_URL)}
          className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold btn-glow btn-primary shadow-glow"
        >
          Speak with a clinician
        </button>
        </div>
      </div>
    </section>
  )
}
