import React, { useState } from 'react'
import type { Answers } from '../../data/menopauseAssessment'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const FALLBACK_ERROR = 'We could not send the email. Please try again in a moment.'

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}

/** Lets the patient email themselves the report. Nothing is sent until they submit this form. */
export default function EmailReport({ answers }: { answers: Answers }) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [contactOptIn, setContactOptIn] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [sentTo, setSentTo] = useState('')

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const address = email.trim()
    if (!isEmail(address)) {
      setStatus('error')
      setError('Please enter a valid email address.')
      return
    }
    if (!consent) {
      setStatus('error')
      setError('Please tick the box to confirm we can send your answers by email.')
      return
    }
    setStatus('sending')
    setError('')
    try {
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: address, consent, contactOptIn, answers }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(typeof data?.error === 'string' ? data.error : FALLBACK_ERROR)
      }
      setSentTo(address)
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error && err.message && err.message !== 'Failed to fetch' ? err.message : FALLBACK_ERROR)
    }
  }

  return (
    <section
      id="email-report"
      aria-labelledby="email-report-title"
      className="mx-auto mt-8 max-w-[794px] scroll-mt-28 rounded-[28px] bg-ca-deep p-7 text-white shadow-[0_30px_80px_rgba(16,38,74,0.25)] sm:p-9"
    >
      <h2 id="email-report-title" className="font-display text-2xl sm:text-[1.75rem]">
        Email me my report
      </h2>

      {status === 'sent' ? (
        <div role="status" className="mt-4 rounded-2xl bg-white/10 p-5 text-sm leading-relaxed">
          <strong className="block text-base">Your report is on its way.</strong>
          We have sent it to {sentTo}. It can take a minute or two to arrive; check your junk folder if you can’t see
          it.
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="mt-3 block font-semibold underline underline-offset-4"
          >
            Send to a different address
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-2">
          <p className="max-w-xl text-sm text-white/85">
            Enter your email address and we’ll send your full report straight away, to print or open on your phone at your appointment.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label className="flex-1">
              <span className="sr-only">Email address</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === 'error') setStatus('idle')
                }}
                aria-invalid={status === 'error'}
                aria-describedby={status === 'error' ? 'email-report-error' : undefined}
                className="w-full rounded-full border border-white/30 bg-white px-5 py-3 text-sm text-ca-deep placeholder:text-ca-ink500 focus:outline-none focus:ring-2 focus:ring-ca-accent"
              />
            </label>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center justify-center rounded-full bg-ca-accent px-7 py-3 text-sm font-semibold text-ca-deep transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send my report'}
            </button>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-white/90">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked)
                if (status === 'error') setStatus('idle')
              }}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[rgb(251,188,94)]"
            />
            <span>
              I’m happy for my answers to be sent to Clinic Alpha so this report can be emailed to me. They are used
              only to send the email and are not stored.
            </span>
          </label>
          <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm text-white/90">
            <input
              type="checkbox"
              checked={contactOptIn}
              onChange={(e) => setContactOptIn(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[rgb(251,188,94)]"
            />
            <span>
              Optional: Clinic Alpha may email me about menopause care and appointments. We keep only your name and
              email address for this, and you can ask us to stop at any time.
            </span>
          </label>

          {status === 'error' && (
            <p id="email-report-error" role="alert" className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  )
}
