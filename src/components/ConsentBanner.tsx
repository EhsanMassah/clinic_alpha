import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'clinic-alpha-consent-banner-dismissed'

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const dismissed = window.localStorage.getItem(STORAGE_KEY)
    if (!dismissed) setVisible(true)
  }, [])

  const dismiss = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'true')
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-3 sm:px-6">
      <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-2xl border border-brand/10 bg-white/95 px-4 py-3 shadow-glow backdrop-blur">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-tint text-brand-deep shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-5 w-5"
            aria-hidden
          >
            <path d="M15.5 8.5a3 3 0 0 1-3-3c0-.53.14-1.03.38-1.45A4 4 0 0 0 8 8c-3 0-5 2.5-5 4.5S4 17 8 17h7c3 0 6-2 6-5.5 0-2-1-3.5-2.5-4.5a3 3 0 0 1-3 1.5Z" />
            <circle cx="9" cy="11" r="0.7" />
            <circle cx="12" cy="14" r="0.7" />
            <circle cx="14.5" cy="10.5" r="0.7" />
          </svg>
        </div>
        <div className="flex flex-1 flex-col gap-1 text-sm text-neutral-700">
          <span className="font-semibold text-brand-night">We use cookies</span>
          <span>
            We use essential cookies to keep Clinic Alpha running and measure how the site is used. You can adjust your
            preferences any time in your browser settings.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={dismiss}
            className="btn-primary inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex items-center rounded-full border border-brand/15 bg-white px-4 py-2 text-sm font-semibold text-brand-deep transition hover:border-brand/30 hover:text-brand-night"
          >
            Decide later
          </button>
        </div>
      </div>
    </div>
  )
}
