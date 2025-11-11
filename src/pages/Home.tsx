import React from 'react'
import Hero from '../components/Hero'
import ArticleList from '../components/ArticleList'
import Services from '../components/Services'
import Outcomes from '../components/Outcomes'
import PartnersStrip from '../components/PartnersStrip'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'
import FAQSection from '../components/FAQSection'
import { usePageMetadata } from '../hooks/usePageMetadata'
import SymptomCheckerCTA from '../components/SymptomCheckerCTA'

export default function Home() {
  usePageMetadata({
    title: 'Clinic Alpha | Functional Hormone Health & Menopause Clinic',
    description:
      'Discover Clinic Alpha’s functional medicine approach to women’s hormone health, perimenopause, and menopause care. Explore resources and book a consultation.',
  })

  return (
    <main id="main">
      <Hero />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="relative overflow-hidden rounded-[36px] px-8 py-10 luxe-shell">
          <div className="absolute inset-0 bg-hero-sheen opacity-55" aria-hidden />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.45em] text-brand luxe-chip">
                <span className="h-2 w-2 rounded-full bg-brand-sky" aria-hidden />
                Resources
              </span>
              <h2 className="mt-4 text-3xl font-display text-brand-deep md:text-[2.3rem]">Latest articles</h2>
            </div>
            <p className="max-w-xl text-sm text-neutral-700">
              Curated reads on hormonal patterns, metabolic health, and the nervous system — refreshed every week with
              actionable rituals.
            </p>
          </div>
          <div className="relative mt-10">
            <ArticleList />
          </div>
        </div>
      </section>

      <Services />
      <Outcomes />
      <PartnersStrip />
      <Testimonials />
      <SymptomCheckerCTA />
      <Newsletter />
      <FAQSection />
    </main>
  )
}
