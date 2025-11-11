import { useEffect } from 'react'

export function useStructuredData(json: string) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = json
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [json])
}
