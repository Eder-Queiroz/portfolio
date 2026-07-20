export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Reveal via IntersectionObserver + classe CSS (.is-in). Não deixa transform
// inline no elemento, então o hover-lift dos cards continua funcionando.
export function revealOnScroll(selector = '[data-reveal]') {
  const els = document.querySelectorAll(selector)
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'))
    return
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in')
        io.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
  els.forEach((el) => io.observe(el))
}
