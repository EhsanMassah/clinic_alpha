import React, { useState } from 'react'

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!isEmail(email)) {
      setError('Please provide a valid email address.')
      return
    }
    setStatus('submitting')
    setTimeout(() => {
      setStatus('success')
      setEmail('')
    }, 600)
  }

  return (
    <section id="newsletter" className="max-w-6xl mx-auto px-6 py-16">
      <div className="relative overflow-hidden rounded-[36px] px-10 py-12 md:flex md:items-center md:justify-between animate-fadeInUp luxe-shell">
        <div className="absolute inset-0 bg-hero-sheen opacity-60" aria-hidden />
        <div className="relative max-w-xl text-brand-deep">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.45em] text-brand luxe-chip">
            <span className="h-2 w-2 rounded-full bg-brand-sky" aria-hidden />
            Newsletter
          </span>
          <h3 className="mt-4 text-3xl font-display md:text-[2.4rem]">Receive the Hormone Reset Playbook</h3>
          <p className="mt-3 text-sm text-neutral-700">
            Join thousands recalibrating their hormones with seasonal protocols, rituals, and live workshop invitations.
          </p>
        </div>
        <form
          className="relative mt-6 flex w-full flex-col gap-3 md:mt-0 md:w-auto md:flex-row md:items-center"
          onSubmit={onSubmit}
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email
          </label>
          <input
            id="newsletter-email"
            aria-label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby={error ? 'newsletter-error' : undefined}
            className="w-full rounded-full border border-white/70 bg-white/95 px-5 py-3 text-sm text-brand-deep shadow-[0_14px_36px_rgba(16,38,74,0.14)] placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 md:w-64"
          />
          <button className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold btn-glow btn-primary shadow-glow">
            {status === 'submitting' ? 'Sending…' : 'Email me the playbook'}
          </button>
        </form>

        {error && (
          <div id="newsletter-error" role="alert" className="mt-3 w-full text-sm text-accent-bold">
            {error}
          </div>
        )}

        {status === 'success' && (
          <div role="status" className="mt-3 w-full text-sm text-brand-deep">
            Thanks — check your inbox for the playbook.
          </div>
        )}
      </div>
    </section>
  )
}
