import React from 'react'

/** Decorative moving colour wash behind every page. Styles live in styles/tailwind.css. */
export default function LiquidBackground() {
  return (
    <div className="liquid-bg" aria-hidden>
      <div className="liquid-blob liquid-blob-1" />
      <div className="liquid-blob liquid-blob-2" />
      <div className="liquid-blob liquid-blob-3" />
      <div className="liquid-blob liquid-blob-4" />
    </div>
  )
}
