import { inView, animate } from 'motion'

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function revealOnScroll(selector = '.card') {
  if (prefersReducedMotion()) return
  document.querySelectorAll(selector).forEach((el) => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(12px)'
    inView(el, () => {
      animate(el, { opacity: 1, transform: 'translateY(0)' }, { duration: 0.25 })
    }, { amount: 0.2 })
  })
}
