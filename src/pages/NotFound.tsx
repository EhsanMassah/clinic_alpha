import React from 'react'
import { Link } from 'react-router-dom'
import { usePageMetadata } from '../hooks/usePageMetadata'

export default function NotFound() {
  usePageMetadata({
    title: 'Page not found | Clinic Alpha',
    description: 'Sorry, we could not find that page.',
    noindex: true,
  })

  return (
    <div id="main" className="mx-auto max-w-3xl px-6 py-24">
      <div className="rounded-[36px] p-10 luxe-shell">
        <h1 className="font-display text-4xl text-ca-deep">Page not found</h1>
        <p className="mt-4 text-sm text-ca-ink700">
          The page you are looking for has moved or no longer exists. These may help instead:
        </p>
        <ul className="mt-6 space-y-2 text-sm font-semibold text-ca-brand">
          <li>
            <Link to="/" className="link-underline">Clinic Alpha home</Link>
          </li>
          <li>
            <Link to="/menopause-assessment" className="link-underline">Free menopause symptom checker</Link>
          </li>
          <li>
            <Link to="/articles" className="link-underline">Menopause and hormone health articles</Link>
          </li>
          <li>
            <Link to="/contact" className="link-underline">Contact us</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
