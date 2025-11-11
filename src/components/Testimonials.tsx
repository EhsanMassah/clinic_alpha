import React from 'react'

const data = [
  { name: 'Jane', quote: 'I feel like myself again — the personalised plan changed everything.' },
  { name: 'Ali', quote: 'Practical, compassionate, and evidence-led.' },
]

export default function Testimonials() {
  return (
    <section className="relative">
      <div className="relative mx-auto max-w-6xl px-6 py-20 text-brand-deep">
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.45em] text-brand luxe-chip">
          <span className="h-2 w-2 rounded-full bg-brand-sky" aria-hidden />
          Testimonials
        </span>
        <h2 className="mt-4 text-3xl font-display md:text-[2.4rem]">Voices from the Alpha community</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {data.map((d, idx) => (
            <blockquote
              key={d.name}
              className="relative overflow-hidden rounded-[28px] p-8 text-neutral-700 backdrop-blur-lg animate-fadeInUp luxe-card"
              style={{ animationDelay: `${idx * 140}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-tint/30 via-transparent to-accent-soft/25 opacity-25" aria-hidden />
              <div className="relative">
                <p className="text-lg leading-relaxed text-brand-deep">“{d.quote}”</p>
                <footer className="mt-6 text-sm uppercase tracking-[0.35em] text-brand/70">— {d.name}</footer>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
