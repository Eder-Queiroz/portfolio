import { t, onLangChange } from '../i18n.js'
import { prefersReducedMotion } from '../utils.js'

const DAYS = 5, PERIODS = 4, TEACHERS = 6, CELLS = DAYS * PERIODS
// Cores de professor — espelham os tokens (secondary, primary, success, warning
// + dois tons de apoio). Nenhuma é vermelha: o vermelho é exclusivo do conflito.
const COLORS = ['#80A1C1', '#FAD4C0', '#34D399', '#FBBF24', '#C4B5FD', '#A8A29B']
const CONFLICT = '#F87171' // = --color-danger

const conflicts = (g) => {
  let c = 0
  for (let d = 0; d < DAYS; d++) {
    const seen = {}
    for (let p = 0; p < PERIODS; p++) {
      const teach = g[d * PERIODS + p]
      if (seen[teach] !== undefined) c++
      seen[teach] = true
    }
  }
  return c
}
const randomGenome = () => Array.from({ length: CELLS }, () => Math.floor(Math.random() * TEACHERS))

export function initGeneticWidget(root) {
  const canvas = root.querySelector('.ga-canvas')
  const ctx = canvas.getContext('2d')
  const status = root.querySelector('.ga-status')
  let pop, gen, timer

  const step = () => {
    pop.sort((a, b) => conflicts(a) - conflicts(b))
    const next = pop.slice(0, 2)
    while (next.length < 40) {
      const pick = () => {
        let best = pop[Math.floor(Math.random() * pop.length)]
        for (let i = 0; i < 2; i++) {
          const c = pop[Math.floor(Math.random() * pop.length)]
          if (conflicts(c) < conflicts(best)) best = c
        }
        return best
      }
      const [a, b] = [pick(), pick()]
      const cut = Math.floor(Math.random() * CELLS)
      const child = a.slice(0, cut).concat(b.slice(cut))
      for (let i = 0; i < CELLS; i++) if (Math.random() < 0.08) child[i] = Math.floor(Math.random() * TEACHERS)
      next.push(child)
    }
    pop = next; gen++
  }

  const draw = () => {
    const best = pop.reduce((a, b) => (conflicts(a) <= conflicts(b) ? a : b))
    const c = conflicts(best)
    const w = canvas.width / DAYS, h = canvas.height / PERIODS
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let d = 0; d < DAYS; d++) {
      const counts = {}
      for (let p = 0; p < PERIODS; p++) {
        const teach = best[d * PERIODS + p]
        counts[teach] = (counts[teach] || 0) + 1
      }
      for (let p = 0; p < PERIODS; p++) {
        const teach = best[d * PERIODS + p]
        ctx.fillStyle = COLORS[teach]
        ctx.beginPath()
        ctx.roundRect(d * w + 3, p * h + 3, w - 6, h - 6, 6)
        ctx.fill()
        if (counts[teach] > 1) { // marca AMBAS as células em conflito no dia
          ctx.strokeStyle = CONFLICT; ctx.lineWidth = 3
          ctx.stroke()
        }
      }
    }
    status.textContent = c === 0
      ? `${t('ga.generation')} ${gen} — ${t('ga.solved')}`
      : `${t('ga.generation')} ${gen} · ${c} ${t('ga.conflicts')}`
    return c
  }

  const start = () => {
    clearInterval(timer)
    pop = Array.from({ length: 40 }, randomGenome); gen = 0
    if (prefersReducedMotion()) {
      while (gen < 5000 && conflicts(pop.reduce((a,b)=>conflicts(a)<=conflicts(b)?a:b)) > 0) step()
      draw()
      return
    }
    draw()
    timer = setInterval(() => { if (draw() === 0) clearInterval(timer); else step() }, 90)
  }

  root.querySelector('.ga-restart').addEventListener('click', start)
  onLangChange(() => draw())
  start()
}
