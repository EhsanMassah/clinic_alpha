import { useEffect } from 'react'

/**
 * Adds a JSON-LD block to the document head. Pass an id to reuse a block that the
 * build-time SEO script already wrote into the static HTML instead of duplicating it.
 */
export function useStructuredData(json: string | null, id?: string) {
  useEffect(() => {
    if (typeof document === 'undefined' || !json) return
    const existing = id ? (document.getElementById(id) as HTMLScriptElement | null) : null
    const script = existing ?? document.createElement('script')
    script.type = 'application/ld+json'
    if (id) script.id = id
    script.text = json
    if (!existing) document.head.appendChild(script)
    return () => {
      script.remove()
    }
  }, [json, id])
}
