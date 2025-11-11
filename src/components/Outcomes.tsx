import React from 'react'

const outcomes = [
  { label: 'Mood stability', stat: '92%', detail: 'reported steadier mood within 90 days' },
  { label: 'Cycle clarity', stat: '3x', detail: 'increase in understanding of symptom patterns' },
  { label: 'Energy restoration', stat: '78%', detail: 'experienced sustained energy improvements' },
]

export default function Outcomes() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="relative overflow-hidden rounded-[36px] px-10 py-14 luxe-shell">
        <div className="absolute inset-0 bg-hero-sheen opacity-[0.55]" aria-hidden />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.45em] text-brand luxe-chip">
              <span className="h-2 w-2 rounded-full bg-brand-sky" aria-hidden />
              Client outcomes
            </span>
            <h2 className="mt-4 text-3xl font-display text-brand-deep md:text-[2.3rem]">
              Results when the Alpha Method meets your rituals
            </h2>
          </div>
          <p className="max-w-xl text-sm text-neutral-700">
            Functional testing, nourishment layers, and somatic practices rebuild hormone resilience across a twelve-week
            cadence. Here’s how clients describe the shift.
          </p>
        </div>
        <div className="relative mt-10 grid gap-6 md:grid-cols-3">
          {outcomes.map((item) => (
            <div
              key={item.label}
              className="group relative overflow-hidden rounded-[28px] p-8 text-center transition duration-400 hover:-translate-y-2 hover:shadow-[0_40px_110px_rgba(16,38,74,0.16)] luxe-card"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-tint/22 via-white to-accent-soft/20 opacity-0 transition duration-400 group-hover:opacity-25" aria-hidden />
              <div className="relative">
                <div className="text-4xl font-semibold text-brand-deep md:text-[3rem]">{item.stat}</div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand/70">
                  {item.label}
                </div>
                <p className="mt-4 text-sm text-neutral-700">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="relative mt-12 flex flex-wrap items-center gap-4 text-sm text-brand">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 uppercase tracking-[0.3em] text-brand-deep/70 luxe-chip">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
            12-week orbit
          </span>
          <span className="text-neutral-700">Paired with biofeedback loops and nervous system calibration rituals.</span>
        </div>
      </div>
    </section>
  )
}
