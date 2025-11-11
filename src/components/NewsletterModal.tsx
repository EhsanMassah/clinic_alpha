import React, { useEffect, useRef } from 'react'

export default function NewsletterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const el = panelRef.current
    const focusable = el
      ? Array.from(
          el.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        )
      : []
    if (focusable.length) focusable[0].focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
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
      if (prev && typeof prev.focus === 'function') prev.focus()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-night/80 px-4 backdrop-blur-sm"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-[520px] rounded-[32px] border border-brand-tint/40 bg-white/96 p-8 shadow-[0_32px_90px_rgba(16,38,74,0.24)]"
        role="dialog"
        aria-modal="true"
      >
        <h3 className="text-2xl font-display text-brand-deep md:text-[2.2rem]">Get the Hormone Reset Playbook</h3>
        <p className="mt-3 text-sm text-neutral-700">
          Access our hormone reset framework, seasonal protocols, and live workshop invitations straight to your inbox.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <NewsletterInlineForm onClose={onClose} />
        </form>
      </div>
    </div>
  )
}

function NewsletterInlineForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = React.useState('')
  const [error, setError] = React.useState('')
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success'>('idle')

  function isEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!isEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    setStatus('submitting')
    setTimeout(() => {
      setStatus('success')
      setEmail('')
      setTimeout(onClose, 800)
    }, 700)
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <input
          id="modal-newsletter-email"
          aria-label="Email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby={error ? 'modal-newsletter-error' : undefined}
          className="w-full rounded-2xl border border-brand-tint/40 bg-white px-4 py-3 text-brand-deep shadow-[0_16px_36px_rgba(16,38,74,0.14)] placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
        />
        <div className="flex-shrink-0">
          <button
            onClick={submit}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold btn-glow btn-primary shadow-glow"
            type="button"
            aria-disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending…' : 'Subscribe'}
          </button>
        </div>
      </div>
      {error && (
        <div id="modal-newsletter-error" role="alert" className="mt-2 text-sm text-accent-bold">
          {error}
        </div>
      )}
      {status === 'success' && (
        <div role="status" className="mt-2 text-sm text-brand-deep">
          Thanks — check your inbox.
        </div>
      )}
    </>
  )
}
