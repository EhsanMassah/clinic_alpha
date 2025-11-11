import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CALENDLY_URL } from '../config/site'
import { openCalendlyPopup } from '../utils/openCalendly'
import Logo from './Logo'
import MobileMenu from './MobileMenu'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Contact', to: '/contact' },
  { label: 'About us', to: '/about' },
  { label: 'Free Endo Guide', to: '/articles' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/90 backdrop-blur-md text-brand-deep shadow-[0_12px_32px_rgba(16,38,74,0.08)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
          aria-label="Clinic Alpha home"
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 text-sm uppercase tracking-[0.28em] text-brand-deep/70 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative overflow-hidden text-sm font-medium uppercase tracking-[0.28em] text-brand-deep/70 transition duration-300 after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-0 after:content-[''] after:rounded-full after:bg-gradient-to-r after:from-brand-sky after:to-accent after:opacity-0 after:transition-all after:duration-300 hover:text-brand-deep hover:after:w-full hover:after:opacity-100 ${
                  isActive ? 'text-brand-deep after:w-full after:opacity-100' : ''
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            onClick={() => openCalendlyPopup(CALENDLY_URL)}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold btn-glow btn-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
          >
            Book a consult
          </button>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-full border border-brand-tint/50 bg-white/90 p-2 text-brand transition hover:border-brand-sky/60 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen(true)}
        >
          <span className="sr-only">Open menu</span>
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" className="text-current">
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  )
}
