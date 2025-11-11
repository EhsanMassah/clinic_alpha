import React from 'react'
import bmsLogo from '../../images/preview-card-BMS.png'
import gphcLogo from '../../images/GPHC logo.webp'
import ifmLogo from '../../images/IFM logo.svg'

const partners = [
  {
    name: 'British Menopause Society',
    logo: bmsLogo,
    url: 'https://thebms.org.uk/',
  },
  {
    name: 'General Pharmaceutical Council',
    logo: gphcLogo,
    url: 'https://www.pharmacyregulation.org/',
  },
  {
    name: 'Institute for Functional Medicine',
    logo: ifmLogo,
    url: 'https://www.ifm.org/',
  },
]

export default function PartnersStrip() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="relative overflow-hidden rounded-[36px] px-8 py-12 luxe-shell">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-tint/25 via-white to-accent-soft/18 opacity-25" aria-hidden />
        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.45em] text-brand luxe-chip">
              <span className="h-2 w-2 rounded-full bg-brand-sky" aria-hidden />
              Supporting partners
            </span>
            <h2 className="mt-4 text-3xl font-display text-brand-deep md:text-[2.3rem]">
              Clinically-aligned, globally trusted
            </h2>
          </div>
          <p className="max-w-xl text-sm text-neutral-700">
            We collaborate with bodies that champion rigorous hormone care, ensuring each assessment and ritual aligns with
            the highest standards.
          </p>
        </div>
        <div className="relative mt-10 grid gap-6 sm:grid-cols-3 sm:items-center">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-center rounded-[24px] p-6 transition hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/60 luxe-card"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-24 w-auto opacity-80 transition group-hover:opacity-100"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
