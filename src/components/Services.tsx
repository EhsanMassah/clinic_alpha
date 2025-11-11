import React from 'react'

const items = [
  { title: 'Personalised Plans', desc: 'Root cause analysis and tailored programs.' },
  { title: 'Hormone Testing', desc: 'Comprehensive labs and interpretation.' },
  { title: 'Lifestyle Coaching', desc: 'Nutrition, movement and sleep support.' },
]

export default function Services() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/60 to-white/10 opacity-30 blur-3xl" aria-hidden />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.45em] text-brand luxe-chip">
            <span className="h-2 w-2 rounded-full bg-brand-sky" aria-hidden />
            Care pathways
          </span>
          <h2 className="mt-4 text-3xl font-display text-brand-deep md:text-[2.3rem]">
            Sculpted services for luminous hormone health
          </h2>
        </div>
        <p className="max-w-xl text-sm text-neutral-700">
          We blend functional medicine, bio-individual testing, and compassionate coaching so your physiology, habits,
          and nervous system move in sync.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((it, idx) => (
          <div
            key={it.title}
            className="group relative overflow-hidden rounded-[28px] p-8 text-brand-deep transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_40px_120px_rgba(16,38,74,0.18)] animate-fadeInUp luxe-card"
            style={{ animationDelay: `${idx * 120}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-tint/18 via-transparent to-accent-soft/20 opacity-0 transition duration-500 group-hover:opacity-80" aria-hidden />
            <div className="relative">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-tint/40 text-sm font-semibold text-brand">
                0{idx + 1}
              </span>
              <h3 className="mt-6 text-xl font-semibold text-brand-deep">{it.title}</h3>
              <p className="mt-3 text-sm text-neutral-700">{it.desc}</p>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 text-sm text-brand transition group-hover:text-brand-sky">
              Explore
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M6 9h6m0 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
