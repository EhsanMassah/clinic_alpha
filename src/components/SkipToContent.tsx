import React from 'react'

export default function SkipToContent() {
  return (
    <a
      href="#main"
      className="sr-only rounded-full p-3 text-sm font-semibold focus:absolute focus:left-4 focus:top-4 focus:not-sr-only focus:bg-white focus:text-brand-night focus:shadow-[0_16px_36px_rgba(16,38,74,0.2)]"
    >
      Skip to content
    </a>
  )
}
