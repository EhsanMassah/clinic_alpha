import React from 'react'

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-brand-tint/50 bg-white shadow-[0_12px_28px_rgba(16,38,74,0.1)]">
        <span className="text-sm font-semibold tracking-[0.25em] text-brand-deep">CA</span>
      </div>
      <div className="hidden leading-tight md:block">
        <div className="text-xs uppercase tracking-[0.4em] text-brand/60">Clinic</div>
        <div className="text-2xl font-display text-brand-deep">Alpha</div>
      </div>
    </div>
  )
}
