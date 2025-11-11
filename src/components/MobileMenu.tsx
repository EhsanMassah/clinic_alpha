import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { CALENDLY_URL } from '../config/site'
import { openCalendlyPopup } from '../utils/openCalendly'

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'How it works', to: '/how-it-works' },
    { label: 'Contact', to: '/contact' },
    { label: 'About us', to: '/about' },
    { label: 'Free Endo Guide', to: '/articles' },
  ]

  const panelRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    const prevActive = document.activeElement as HTMLElement | null
    const el = panelRef.current
    const focusable = el
      ? Array.from(
          el.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        )
      : []

    // focus first item
    if (focusable.length) focusable[0].focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'Tab' && focusable.length) {
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (prevActive && typeof prevActive.focus === 'function') prevActive.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-brand-night/20 backdrop-blur-md"
      role="presentation"
      onClick={(e) => {
        // only close when clicking the backdrop (not the panel)
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <section
        ref={panelRef}
        id="mobile-menu"
        className="ml-auto h-full w-[78%] max-w-xs border-l border-brand-tint/40 bg-white/95 p-6 text-left text-brand-deep"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div>
          <div className="flex items-center justify-between mb-8">
          <div id="mobile-menu-title" className="text-xs uppercase tracking-[0.35em] text-brand/60">Menu</div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full border border-brand-tint/50 px-3 py-1 text-brand transition hover:border-brand-sky/60 hover:text-brand"
          >
            Close
          </button>
  </div>

  <ul className="space-y-4 text-lg text-brand-deep">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link to={item.to} onClick={onClose} className="transition-colors duration-200 hover:text-brand">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => {
              openCalendlyPopup(CALENDLY_URL)
              onClose()
            }}
            className="inline-flex w-full justify-center rounded-full px-4 py-2 text-sm font-semibold btn-glow btn-primary"
          >
            Book a consult
          </button>
        </div>
        </div>
      </section>
    </div>
  )
}
