import { t, onLangChange } from '../i18n.js'
import { prefersReducedMotion } from '../utils.js'

// 5 professores para 4 períodos deixa o problema mais apertado: o estado inicial
// costuma ter conflitos visíveis que a evolução vai resolvendo ao vivo.
const DAYS = 5, PERIODS = 4, TEACHERS = 5, CELLS = DAYS * PERIODS
// Cores de professor — pastéis que contrastam com o fundo escuro. Nenhuma é
// vermelha: o vermelho é exclusivo do conflito.
const COLORS = ['#80A1C1', '#FAD4C0', '#34D399', '#FBBF24', '#C4B5FD', '#A8A29B']
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

// genoma[i], com i = dia * PERIODS + período  → índice do professor naquela aula
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
const bestOf = (pop) => pop.reduce((a, b) => (conflicts(a) <= conflicts(b) ? a : b))
const randomGenome = () => Array.from({ length: CELLS }, () => Math.floor(Math.random() * TEACHERS))

export function initGeneticWidget(root) {
  const grid = root.querySelector('.ga-grid')
  const status = root.querySelector('.ga-status')
  let pop, gen, timer
  let cells = []

  const buildGrid = () => {
    grid.innerHTML = ''
    cells = []
    grid.appendChild(document.createElement('div')) // canto vazio
    const days = t('ga.days')
    for (let d = 0; d < DAYS; d++) {
      const h = document.createElement('div')
      h.className = 'ga-h'; h.textContent = days[d]
      grid.appendChild(h)
    }
    for (let p = 0; p < PERIODS; p++) {
      const rl = document.createElement('div')
      rl.className = 'ga-rowlabel'; rl.textContent = `${p + 1}º`
      grid.appendChild(rl)
      for (let d = 0; d < DAYS; d++) {
        const c = document.createElement('div')
        c.className = 'ga-cell'
        grid.appendChild(c)
        cells[d * PERIODS + p] = c
      }
    }
  }

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
    const best = bestOf(pop)
    const c = conflicts(best)
    for (let d = 0; d < DAYS; d++) {
      const counts = {}
      for (let p = 0; p < PERIODS; p++) {
        const teach = best[d * PERIODS + p]
        counts[teach] = (counts[teach] || 0) + 1
      }
      for (let p = 0; p < PERIODS; p++) {
        const teach = best[d * PERIODS + p]
        const cell = cells[d * PERIODS + p]
        cell.style.backgroundColor = COLORS[teach]
        cell.textContent = LETTERS[teach]
        cell.classList.toggle('conflict', counts[teach] > 1) // marca AMBAS as células do conflito
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
      while (gen < 5000 && conflicts(bestOf(pop)) > 0) step()
      draw()
      return
    }
    draw()
    timer = setInterval(() => { if (draw() === 0) clearInterval(timer); else step() }, 130)
  }

  buildGrid()
  root.querySelector('.ga-restart').addEventListener('click', start)
  onLangChange(() => { buildGrid(); draw() }) // reconstrói os rótulos de dia e repinta
  start()
}
