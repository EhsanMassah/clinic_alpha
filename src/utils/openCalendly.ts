export function openCalendlyPopup(calendlyUrl: string) {
  if (typeof window === 'undefined') return
  if (window.Calendly?.initPopupWidget) {
    window.Calendly.initPopupWidget({ url: calendlyUrl })
  } else {
    window.open(calendlyUrl, '_blank', 'noopener,noreferrer')
  }
}
