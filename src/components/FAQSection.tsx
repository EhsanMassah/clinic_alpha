import React, { useMemo, useState } from 'react'
import { useStructuredData } from '../hooks/useStructuredData'

const FAQ_ITEMS = [
  {
    question: 'What happens during the discovery consultation?',
    answer:
      'We review your symptom history, current labs or medications, and your goals. You’ll leave the 15-minute call with a personalised roadmap and clarity on whether our 12-week programme is the right fit.',
  },
  {
    question: 'Do I need lab work before working with Clinic Alpha?',
    answer:
      'Initial labs are not required. If we proceed, we arrange a functional hormone panel and any additional tests needed to uncover root causes like thyroid, adrenal, or nutrient imbalances.',
  },
  {
    question: 'Can I join the programme if I am already on HRT?',
    answer:
      'Yes. We work alongside your existing prescriber to optimise dosage, layering in nutrition, movement, and nervous system support to stabilise symptoms and improve resilience.',
  },
  {
    question: 'Is the care plan available outside the UK?',
    answer:
      'We offer virtual consultations globally. Lab testing availability varies by country, so we confirm logistics during your discovery call and recommend alternatives when necessary.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqJson = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }),
    []
  )

  useStructuredData(faqJson)

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="relative overflow-hidden rounded-[36px] px-10 py-12 luxe-shell">
        <div className="absolute inset-0 bg-hero-sheen opacity-55" aria-hidden />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.45em] text-brand luxe-chip">
              <span className="h-2 w-2 rounded-full bg-brand-sky" aria-hidden />
              FAQ
            </span>
            <h2 className="mt-4 text-3xl font-display text-brand-deep md:text-[2.3rem]">
              Common questions about Clinic Alpha care
            </h2>
          </div>
          <p className="max-w-xl text-sm text-neutral-700">
            Everything you need to know about our functional medicine approach, testing, and how we collaborate with your
            existing clinicians.
          </p>
        </div>

        <div className="relative mt-10 space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div key={item.question} className="rounded-[24px] p-6 transition hover:-translate-y-1 luxe-card">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between text-left text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                >
                  <span className="flex items-center gap-3 text-lg font-semibold">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-tint/30 text-xs uppercase tracking-[0.3em] text-brand">
                      0{index + 1}
                    </span>
                    {item.question}
                  </span>
                  <span className="ml-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 text-brand bg-white/70">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <p id={`faq-panel-${index}`} className="mt-4 text-sm leading-relaxed text-neutral-700">
                    {item.answer}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
