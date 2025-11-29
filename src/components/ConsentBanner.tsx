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
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:p-8">
          <div className="relative mx-auto h-40 w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 via-white to-amber-50 md:mx-0 md:w-64">
            <div className="absolute inset-4 rounded-xl border border-slate-200/60 bg-white shadow-lg shadow-slate-200/50" />
            <div className="absolute left-6 top-6 h-20 w-12 rounded-full bg-gradient-to-b from-emerald-200 to-emerald-400 shadow-md shadow-emerald-200/60" />
            <div className="absolute right-8 bottom-5 h-16 w-28 rounded-2xl bg-gradient-to-r from-sky-100 via-white to-amber-100 shadow-md shadow-slate-200/70" />
            <div className="absolute left-1/2 top-1/2 flex h-14 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg shadow-slate-200/80">
              <span className="mx-2 h-2 w-2 rounded-full bg-emerald-400" />
              <span className="mx-2 h-2 w-2 rounded-full bg-amber-400" />
              <span className="mx-2 h-2 w-2 rounded-full bg-slate-300" />
            </div>
          </div>

          <div className="flex-1">
            <p className="text-lg font-semibold text-slate-900">About consent mode</p>
            <p className="mt-3 text-base leading-relaxed text-slate-700">
              Consent mode lets you gather consent from visitors in regions where regulations apply (like the EEA) so
              you can respect their choices while still measuring performance. Google tags adapt to use cookies only
              after consent is granted.
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-700">
              When direct consent is missing, Google&apos;s conversion modelling fills gaps so reporting stays useful.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="https://support.google.com/google-ads/answer/10000067"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Learn more about consent mode
              </a>
              <button
                type="button"
                onClick={dismiss}
                className="text-sm font-semibold text-sky-700 underline-offset-4 hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
