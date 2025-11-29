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
      <div className="mx-auto flex max-w-4xl items-start gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-lg shadow-slate-200/70 backdrop-blur">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-700">
          <span className="text-lg" aria-hidden>
            🍪
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-1 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">We use cookies</span>
          <span>
            We rely on cookies for basic site functions and to measure how people use Clinic Alpha. Review your choices
            anytime in your browser settings.
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex items-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Accept cookies
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              Decide later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
