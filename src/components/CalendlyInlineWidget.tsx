import React, { useEffect, useRef } from 'react'
import { CALENDLY_URL } from '../config/site'

const INLINE_URL = `${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1`

export default function CalendlyInlineWidget() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const parent = containerRef.current
    if (!parent) return

    parent.innerHTML = ''
    const wrapper = document.createElement('div')
    wrapper.className = 'calendly-inline-widget w-full'
    wrapper.style.minHeight = '680px'
    parent.appendChild(wrapper)

    if (window.Calendly?.initInlineWidget) {
      window.Calendly.initInlineWidget({ url: INLINE_URL, parentElement: wrapper })
    }
  }, [])

  return <div ref={containerRef} className="w-full" />
}
