import { prefersReducedMotion } from '../utils.js'

export function initSqsWidget(root) {
  const slots = root.querySelector('.sqs-slots')
  const processing = root.querySelector('.sqs-processing')
  const counters = {
    delivered: root.querySelector('.c-delivered'),
    retried: root.querySelector('.c-retried'),
    dlq: root.querySelector('.c-dlq'),
  }
  let queue = []
  const totals = { delivered: 0, retried: 0, dlq: 0 }

  const renderQueue = () => {
    slots.innerHTML = ''
    queue.slice(0, 6).forEach((m) => {
      const el = document.createElement('div')
      el.className = `sqs-msg${m.tries > 0 ? ' retry' : ''}`
      el.textContent = m.tries > 0 ? m.tries + 1 : ''
      slots.appendChild(el)
    })
  }
  const bump = (key) => { totals[key]++; counters[key].textContent = totals[key] }

  if (prefersReducedMotion()) {
    queue = [{ tries: 0 }, { tries: 1 }, { tries: 0 }]
    renderQueue()
    processing.innerHTML = '<div class="sqs-msg"></div>'
    counters.delivered.textContent = '128'; counters.retried.textContent = '9'; counters.dlq.textContent = '1'
    return
  }

  setInterval(() => { if (queue.length < 8) { queue.push({ tries: 0 }); renderQueue() } }, 900)

  setInterval(() => {
    const msg = queue.shift()
    if (!msg) return
    renderQueue()
    const el = document.createElement('div')
    el.className = `sqs-msg pop${msg.tries > 0 ? ' retry' : ''}`
    processing.innerHTML = ''
    processing.appendChild(el)
    setTimeout(() => {
      processing.innerHTML = ''
      const roll = Math.random()
      if (roll < 0.62) bump('delivered')
      else if (roll < 0.9) {
        msg.tries++
        bump('retried')
        if (msg.tries >= 3) bump('dlq')
        else { queue.push(msg); renderQueue() }
      } /* else: falha permanente — descartada em silêncio */
    }, 600)
  }, 1100)
}
