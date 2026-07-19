import { t, onLangChange } from '../i18n.js'
import { prefersReducedMotion } from '../utils.js'

export function initTypingWidget(el) {
  let timer, word = 0, char = 0, deleting = false
  const tick = () => {
    const words = t('hero.roles')
    const current = words[word % words.length]
    char += deleting ? -1 : 1
    el.textContent = current.slice(0, char)
    let delay = deleting ? 35 : 70
    if (!deleting && char === current.length) { deleting = true; delay = 1600 }
    else if (deleting && char === 0) { deleting = false; word++; delay = 300 }
    timer = setTimeout(tick, delay)
  }
  const start = () => {
    clearTimeout(timer)
    if (prefersReducedMotion()) { el.textContent = t('hero.roles')[0]; return }
    word = 0; char = 0; deleting = false; tick()
  }
  onLangChange(start)
  start()
}
