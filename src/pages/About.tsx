import React from 'react'
import { usePageMetadata } from '../hooks/usePageMetadata'

export default function About() {
  usePageMetadata({
    title: 'About Clinic Alpha | Functional Hormone Specialists',
    description:
      'Learn about Clinic Alpha’s functional medicine team, our ethos, and how we support women through perimenopause and menopause.',
  })

  return (
    <main id="main" className="mx-auto max-w-6xl px-6 py-20">
      <div className="relative overflow-hidden rounded-[36px] px-10 py-12 luxe-shell">
        <div className="absolute inset-0 bg-hero-sheen opacity-55" aria-hidden />
        <div className="relative max-w-3xl text-brand-deep">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.45em] text-brand luxe-chip">
            <span className="h-2 w-2 rounded-full bg-brand-sky" aria-hidden />
            Our ethos
          </span>
          <h2 className="mt-4 text-4xl font-display md:text-[2.7rem]">About</h2>
          <p className="mt-4 text-sm text-neutral-700 leading-relaxed">
            Clinic Alpha reimagines the hormonal care journey with design-led storytelling, science-backed guidance, and
            accessible tools. We believe in slow, intentional practices that empower patients to become collaborators in
            their wellbeing.
          </p>
          <p className="mt-4 text-sm text-neutral-700 leading-relaxed">
            From immersive education to custom sequencing of testing, rituals, and nourishment, every touchpoint is crafted
            to feel elegant, grounding, and deeply human.
          </p>
        </div>
      </div>
    </main>
  )
}
