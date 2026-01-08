import React, { useState } from 'react'

type FormState = {
  name: string
  email: string
  focus: string
  message: string
  consent: boolean
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

type ContactFormProps = {
  onSuccess?: () => void
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [form, setForm] = useState<FormState>({ name: '', email: '', focus: '', message: '', consent: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Please enter your name.'
    if (!form.email.trim() || !isEmail(form.email)) e.email = 'Please enter a valid email address.'
    if (!form.consent) e.consent = 'Please consent to receive communications.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setStatus('submitting')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error('Request failed')
      setStatus('success')
      setForm({ name: '', email: '', focus: '', message: '', consent: false })
      setErrors({})
      onSuccess?.()
    } catch (err) {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="mt-10 max-w-xl rounded-[32px] p-6 text-sm text-brand animate-fadeInUp luxe-card">
        Thanks — we received your message and will be in touch.
      </div>
    )
  }

  return (
    <form
      className="mt-10 max-w-xl space-y-5 rounded-[32px] p-8 animate-fadeInUp luxe-card"
      onSubmit={onSubmit}
      noValidate
      aria-live="polite"
    >
      <label htmlFor="contact-name" className="flex flex-col text-brand-deep">
        <span className="text-xs uppercase tracking-[0.35em] text-brand/70">Name</span>
        <input
          id="contact-name"
          className="mt-2 rounded-2xl border border-white/70 bg-white px-4 py-3 text-brand-deep shadow-[0_12px_30px_rgba(16,38,74,0.12)] placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
          name="name"
          value={form.name}
          onChange={(ev) => setForm((s) => ({ ...s, name: ev.target.value }))}
          required
          aria-required="true"
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
        />
        {errors.name && (
          <div id="contact-name-error" className="mt-2 text-sm text-accent-bold">
            {errors.name}
          </div>
        )}
      </label>

      <label htmlFor="contact-email" className="flex flex-col text-brand-deep">
        <span className="text-xs uppercase tracking-[0.35em] text-brand/70">Email</span>
        <input
          id="contact-email"
          type="email"
          className="mt-2 rounded-2xl border border-white/70 bg-white px-4 py-3 text-brand-deep shadow-[0_12px_30px_rgba(16,38,74,0.12)] placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
          name="email"
          value={form.email}
          onChange={(ev) => setForm((s) => ({ ...s, email: ev.target.value }))}
          required
          aria-required="true"
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
        />
        {errors.email && (
          <div id="contact-email-error" className="mt-2 text-sm text-accent-bold">
            {errors.email}
          </div>
        )}
      </label>

      <label className="flex flex-col text-brand-deep">
        <span className="text-xs uppercase tracking-[0.35em] text-brand/70">Primary focus</span>
        <select
          name="focus"
          className="mt-2 rounded-2xl border border-white/70 bg-white px-4 py-3 text-brand-deep shadow-[0_12px_30px_rgba(16,38,74,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
          value={form.focus}
          onChange={(ev) => setForm((s) => ({ ...s, focus: ev.target.value }))}
          defaultValue=""
        >
          <option value="" disabled>
            Select an area of support
          </option>
          <option value="perimenopause">Perimenopause symptom relief</option>
          <option value="menopause">Menopause transition support</option>
          <option value="pcos">Cycle irregularities / PCOS</option>
          <option value="thyroid">Thyroid & adrenal balance</option>
          <option value="other">Something else</option>
        </select>
      </label>

      <label className="flex flex-col text-brand-deep">
        <span className="text-xs uppercase tracking-[0.35em] text-brand/70">Message</span>
        <textarea
          className="mt-2 rounded-2xl border border-white/70 bg-white px-4 py-3 text-brand-deep placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
          name="message"
          rows={5}
          value={form.message}
          onChange={(ev) => setForm((s) => ({ ...s, message: ev.target.value }))}
        />
      </label>

      <label className="flex items-start gap-3 text-sm text-neutral-700">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-brand-tint/60 text-brand focus:ring-brand-sky/40"
          checked={form.consent}
          onChange={(ev) => setForm((s) => ({ ...s, consent: ev.target.checked }))}
          required
          aria-required="true"
          aria-describedby={errors.consent ? 'contact-consent-error' : undefined}
        />
        <span>
          I consent to receive communication about Clinic Alpha programmes and understand I can unsubscribe anytime.
        </span>
      </label>
      {errors.consent && (
        <div id="contact-consent-error" className="text-sm text-accent-bold">
          {errors.consent}
        </div>
      )}

      <div>
        <button
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold btn-glow btn-primary shadow-glow"
          type="submit"
          aria-disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending…' : 'Send'}
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M4 14 14 9 4 4v3l7 2-7 2v3Z" fill="currentColor" />
          </svg>
        </button>
      </div>

      {status === 'error' && (
        <div role="alert" className="mt-4 rounded-2xl border border-accent-soft/60 bg-accent-soft/15 p-3 text-sm text-accent-bold">
          Sorry — something went wrong. Please try again later.
        </div>
      )}
    </form>
  )
}
