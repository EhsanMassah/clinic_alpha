import React from 'react'

type Props = { title: string; url: string }

const ICONS: Record<'x' | 'facebook' | 'instagram', JSX.Element> = {
  x: (
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M18.36 3H21l-6.52 7.4L21.5 21H15.5l-4.06-5.5L6.72 21H3.08l6.97-7.94L2.5 3h5.95l3.63 4.89L18.36 3Zm-2.14 16.13h1.18L7.88 4.8H6.6l9.62 14.33Z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M13.5 9H16l.5-3h-3V4.5c0-.86.17-1.5 1.5-1.5H16V.08C15.74.05 14.86 0 13.86 0 11.64 0 10 1.49 10 4.23V6H7v3h3v9h3.5V9Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5Zm0 8.2A3.2 3.2 0 1 1 15.2 12 3.2 3.2 0 0 1 12 15.2ZM17.45 6a1.17 1.17 0 1 0 1.17 1.17A1.17 1.17 0 0 0 17.45 6Z" />
      <path d="M20.5 3.5A4.49 4.49 0 0 0 17.4 1 29.94 29.94 0 0 0 12 1 29.94 29.94 0 0 0 6.6 1a4.49 4.49 0 0 0-3.1 2.5A28.3 28.3 0 0 0 3 12a28.3 28.3 0 0 0 .5 8.5 4.49 4.49 0 0 0 3.1 2.5A29.94 29.94 0 0 0 12 23a29.94 29.94 0 0 0 5.4-.5 4.49 4.49 0 0 0 3.1-2.5A28.3 28.3 0 0 0 21 12a28.3 28.3 0 0 0-.5-8.5Zm-1.74 15.36a2.64 2.64 0 0 1-1.5 1.5 19.37 19.37 0 0 1-5.26.44 19.37 19.37 0 0 1-5.26-.44 2.64 2.64 0 0 1-1.5-1.5 19.67 19.67 0 0 1-.42-5.36 19.67 19.67 0 0 1 .42-5.36 2.64 2.64 0 0 1 1.5-1.5A19.37 19.37 0 0 1 12 4.2a19.37 19.37 0 0 1 5.26.44 2.64 2.64 0 0 1 1.5 1.5 19.67 19.67 0 0 1 .42 5.36 19.67 19.67 0 0 1-.42 5.36Z" />
    </svg>
  ),
}

export default function SocialShare({ title, url }: Props) {
  const encodedUrl = encodeURIComponent(url)
  const text = encodeURIComponent(`${title} — ${url}`)

const handlers: Record<'x' | 'facebook' | 'instagram', () => void> = {
  x: () => window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer'),
    facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank', 'noopener,noreferrer'),
    instagram: () => window.open(`https://www.instagram.com/?url=${encodedUrl}`, '_blank', 'noopener,noreferrer'),
  }

  return (
    <div className="flex gap-3">
      {(Object.keys(handlers) as Array<keyof typeof handlers>).map((platform) => (
        <button
          key={platform}
          type="button"
          onClick={handlers[platform]}
          aria-label={`Share on ${platform === 'x' ? 'X (formerly Twitter)' : platform}`}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-tint/40 bg-white/90 text-brand-deep transition hover:-translate-y-1 hover:border-brand-sky/50 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40"
        >
          {ICONS[platform]}
          <span className="sr-only">{platform === 'x' ? 'X (formerly Twitter)' : platform}</span>
        </button>
      ))}
    </div>
  )
}
