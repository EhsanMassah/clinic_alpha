import { useEffect, useRef, useState } from 'react'

export default function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setIsInView(true)
      })
    }, options)

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref.current])

  return { ref, isInView }
}
