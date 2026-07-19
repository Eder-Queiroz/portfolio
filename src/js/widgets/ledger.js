import { t, onLangChange } from '../i18n.js'
import { prefersReducedMotion } from '../utils.js'

const BATCHES = [
  { points: 300, exp: '08/26' }, { points: 250, exp: '10/26' },
  { points: 200, exp: '12/26' }, { points: 150, exp: '02/27' },
]

export function initLedgerWidget(root) {
  const stage = root.querySelector('.ledger-stage')
  const count = root.querySelector('.ledger-count')
  let state, redeemed, timer

  const reset = () => { state = BATCHES.map((b) => ({ ...b, left: b.points })); redeemed = 0 }

  const render = () => {
    stage.innerHTML = ''
    const activeIdx = state.findIndex((b) => b.left > 0)
    state.forEach((b, i) => {
      const el = document.createElement('div')
      el.className = `ledger-batch${i === activeIdx ? ' active' : ''}${b.left === 0 ? ' empty' : ''}`
      el.innerHTML = `
        <div class="ledger-fill" style="transform: scaleX(${b.left / b.points})"></div>
        <div class="ledger-label"><span>${t('ledger.batch')} ${i + 1} · ${b.left} pts</span><span>${t('ledger.expires')} ${b.exp}</span></div>`
      stage.appendChild(el)
    })
    count.textContent = `↓ ${redeemed} ${t('ledger.redeemed')}`
  }

  const tick = () => {
    let amount = 40 + Math.floor(Math.random() * 41)
    let consumed = 0
    for (const b of state) {
      if (amount === 0) break
      const take = Math.min(b.left, amount)
      b.left -= take; amount -= take; consumed += take
    }
    redeemed += consumed
    render()
    const done = state.every((b) => b.left === 0)
    if (done) { timer = setTimeout(() => { reset(); render(); loop() }, 1500) } else loop()
  }
  const loop = () => { timer = setTimeout(tick, 1200) }

  reset()
  onLangChange(render)
  if (prefersReducedMotion()) { state[0].left = 150; redeemed = 150; render(); return }
  render(); loop()
}
