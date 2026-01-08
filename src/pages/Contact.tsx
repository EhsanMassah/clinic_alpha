import React, { useState } from 'react'
import ContactForm from '../components/ContactForm'
import CalendlyInlineWidget from '../components/CalendlyInlineWidget'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { CALENDLY_URL } from '../config/site'
import { openCalendlyPopup } from '../utils/openCalendly'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  usePageMetadata({
    title: 'Book a Consultation | Clinic Alpha',
    description:
      'Contact Clinic Alpha to discuss personalised hormone health support. Submit the intake form or book a discovery call directly through Calendly.',
  })

  return (
    <main id="main" className="mx-auto max-w-6xl px-6 py-20">
      <div className="relative overflow-hidden rounded-[36px] px-10 py-12 luxe-shell">
        <div className="absolute inset-0 bg-hero-sheen opacity-55" aria-hidden />
        <div className="relative max-w-2xl text-brand-deep">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.45em] text-brand luxe-chip">
            <span className="h-2 w-2 rounded-full bg-brand-sky" aria-hidden />
            Let’s collaborate
          </span>
          <h2 className="mt-4 text-4xl font-display md:text-[2.7rem]">Contact</h2>
          {!submitted && (
            <p className="mt-4 text-sm text-neutral-700">
              Share a few details about what you’re exploring — appointments, partnerships, or media. We’ll reply within two
              business days.
            </p>
          )}
        </div>
        <ContactForm onSuccess={() => setSubmitted(true)} />
      </div>
      <section className="relative mt-12 overflow-hidden rounded-[32px] p-8 luxe-shell">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-tint/25 via-white to-accent-soft/22 opacity-65" aria-hidden />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl text-brand-deep">
            <h3 className="text-2xl font-display md:text-[2.2rem]">Prefer to book straight away?</h3>
            <p className="mt-3 text-sm text-neutral-700">
              Reserve a complimentary 15-minute discovery call to clarify your symptoms, map next steps, and confirm if
              our functional approach is the right fit.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openCalendlyPopup(CALENDLY_URL)}
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold btn-glow btn-primary"
          >
            Open booking popup
          </button>
        </div>
        <div className="relative mt-8 overflow-hidden rounded-[28px] p-4 luxe-card">
          <CalendlyInlineWidget />
        </div>
      </section>
    </main>
  )
}
