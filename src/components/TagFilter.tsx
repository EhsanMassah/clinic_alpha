import React from 'react'

type Props = {
  tags: string[]
  active?: string | null
  onSelect: (tag: string | null) => void
}

export default function TagFilter({ tags, active, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          active === null
            ? 'btn-primary shadow-[0_20px_50px_rgba(16,38,74,0.18)]'
            : 'border border-brand-tint/40 bg-white/95 text-brand-deep hover:border-brand-sky/50 hover:text-brand'
        }`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {tags.map((t) => (
        <button
          key={t}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            active === t
              ? 'btn-primary shadow-[0_20px_50px_rgba(16,38,74,0.18)]'
              : 'border border-brand-tint/40 bg-white/95 text-brand-deep hover:border-brand-sky/50 hover:text-brand'
          }`}
          onClick={() => onSelect(t)}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
