import React from 'react'
import howItWorksImage from '../../images/how-it-works.avif'

const steps = [
  {
    stage: 'Start your journey',
    title: 'Request appointment',
    description:
      'Raise your hand when you are ready. Share a few essentials and we will confirm if this pathway is right for you or advise on alternatives that serve you better.',
  },
  {
    stage: 'Finding you the right service',
    title: 'Personalised intake',
    description:
      'We will ask a concise set of personalised questions so we can find the right service match. Expect thoughtful prompts about your current care, medications, and support preferences.',
  },
  {
    stage: 'Book an appointment',
    title: 'Receive your booking link',
    description:
      'Once suitability is confirmed, you will be provided with a secure booking link. Choose a slot that suits your rhythm and lock it in instantly.',
  },
  {
    stage: 'Gather a detailed history',
    title: 'Pre-consult preparation',
    description:
      'To make the most of our consultation time, we may ask you to collect a few key datapoints such as a recent blood pressure reading or up-to-date lab results.',
  },
  {
    stage: 'Consultation',
    title: '45-minute deep dive',
    description:
      'During your initial consultation we explore symptoms, history, and nervous system cues in a warm, calm environment. We will review relevant options, answer questions, and co-create a management plan tailored to your lifestyle.',
  },
  {
    stage: 'Report',
    title: 'Tailored management plan',
    description:
      'You will receive a thorough report summarising our analysis, suggested pathways, and any supplement or diagnostic recommendations so you can move forward with clarity.',
  },
  {
    stage: 'Follow up',
    title: 'Ongoing refinement',
    description:
      'We typically partner for three months. During that time we regroup to review progress, fine-tune your plan, and adjust support should new needs surface.',
  },
]

export default function HowItWorks() {
  return (
    <div className="bg-gradient-to-b from-cream-soft via-white to-brand-tint/15 text-brand-deep">
      <section className="relative overflow-hidden border-b border-brand-tint/30 py-24 shadow-[0_24px_80px_rgba(16,38,74,0.08)]">
        <div className="absolute inset-0">
          <img
            src={howItWorksImage}
            alt=""
            aria-hidden
            className="h-full w-full object-cover opacity-40"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-brand-tint/40" aria-hidden />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-hero-radial opacity-20" aria-hidden />
        <div className="relative mx-auto flex max-w-4xl flex-col gap-6 px-6 text-center md:px-10">
          <p className="text-xs uppercase tracking-[0.5em] text-brand/70">Your next steps</p>
          <h1 className="font-display text-4xl font-semibold md:text-5xl">How it works</h1>
          <p className="mx-auto max-w-3xl text-lg text-neutral-700">
            A transparent pathway that keeps you supported from first hello through long-term integration. Follow the
            timeline to see how we journey together.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="relative overflow-hidden rounded-[48px] border border-white/50 bg-white/80 p-6 shadow-[0_40px_120px_rgba(10,21,45,0.12)] backdrop-blur-xl md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-tint/20 via-transparent to-accent-soft/20" aria-hidden />
          <div className="pointer-events-none absolute left-16 top-0 hidden h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-brand-sky/30 via-brand/10 to-transparent md:block" aria-hidden />
          <ol className="relative space-y-10 md:space-y-14">
            {steps.map((step, idx) => (
              <li key={step.stage} className="relative flex flex-col gap-6 md:flex-row md:items-start">
                <div className="relative flex items-center md:block">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-deep shadow-[0_18px_45px_rgba(16,38,74,0.18)] ring-1 ring-white/70">
                    <span className="text-sm font-semibold">{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  {idx !== steps.length - 1 && (
                    <span
                      className="pointer-events-none absolute left-1/2 top-14 hidden h-[calc(100%+48px)] w-px -translate-x-1/2 bg-gradient-to-b from-brand/15 to-transparent md:block"
                      aria-hidden
                    />
                  )}
                </div>
                <div className="flex-1 rounded-[40px] border border-white/60 bg-gradient-to-br from-white via-cream-soft/70 to-brand-tint/25 p-6 text-brand-deep shadow-[0_32px_90px_rgba(16,38,74,0.12)] md:p-10">
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-brand/70">{step.stage}</div>
                  <h2 className="mt-4 text-3xl font-display md:text-[2.35rem]">{step.title}</h2>
                  <p className="mt-5 text-base text-neutral-700 md:text-lg">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}
