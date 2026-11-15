import React from 'react'
import { Link } from 'react-router-dom'

const previewRows = [
  ['Hot flushes, sweating', 4],
  ['Sleep problems', 3],
  ['Anxiety', 2],
  ['Exhaustion, brain fog', 3],
  ['Joint discomfort', 1],
] as const

/** Front-of-site entry point to the menopause questionnaire and GP report. */
export default function AssessmentPromo() {
  return (
    <section aria-labelledby="assessment-promo-title" className="pt-8 md:pt-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative grid items-center gap-10 overflow-hidden rounded-[36px] bg-ca-deep p-8 text-white shadow-[0_34px_90px_rgba(16,38,74,0.28)] md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] md:p-12">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ca-sky/20 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-white/90">
              <span className="h-2 w-2 rounded-full bg-ca-accent" aria-hidden />
              Free · 5 minutes
            </span>
            <h2 id="assessment-promo-title" className="mt-5 font-display text-3xl font-semibold leading-tight md:text-[2.7rem]">
              Get your menopause symptom report to take to your GP
            </h2>
            <p className="mt-4 max-w-xl text-base text-white/85">
              Answer a short questionnaire built on the Menopause Rating Scale and NICE guidance. You’ll get a clear
              two-page summary of your symptoms, history and questions, so your appointment covers what matters.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                to="/menopause-assessment"
                className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-ca-deep shadow-glow-soft transition hover:bg-ca-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ca-accent"
              >
                Start the questionnaire
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path d="M5 10h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </Link>
              <p className="text-sm text-white/75">Private: your answers never leave your device.</p>
            </div>
          </div>

          {/* Decorative miniature of the report */}
          <div className="relative hidden md:block" aria-hidden>
            <div className="rotate-2 rounded-xl bg-white p-5 text-ca-deep shadow-[0_24px_60px_rgba(0,0,0,0.3)]">
              <div className="flex items-end justify-between border-b-2 border-ca-deep pb-2">
                <span className="font-display text-sm font-semibold">Menopause Symptom Report</span>
                <span className="text-[9px] text-ca-ink500">Page 1 of 2</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="col-span-2 rounded-md bg-ca-deep px-2.5 py-2 text-white">
                  <span className="block text-[7px] uppercase tracking-widest text-white/70">Cycle stage</span>
                  <span className="font-display text-xs">Early perimenopause</span>
                </div>
                <div className="rounded-md border border-ca-line px-2.5 py-2">
                  <span className="block text-[7px] uppercase tracking-widest text-ca-ink500">MRS total</span>
                  <span className="font-display text-xs">18 / 44</span>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                {previewRows.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 border-b border-ca-wash pb-1.5">
                    <span className="text-[10px] font-medium">{label}</span>
                    <span className="flex gap-0.5">
                      {[0, 1, 2, 3].map((i) => (
                        <span key={i} className={`h-1.5 w-4 rounded-sm ${i < value ? 'bg-ca-brand' : 'bg-ca-line'}`} />
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
