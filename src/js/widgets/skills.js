import { computePosition, offset, flip, shift } from '@floating-ui/dom'
import { t, onLangChange } from '../i18n.js'

// Must match --transition duration in tokens.css
const HIDE_MS = 200

export function initSkillsWidget(root) {
  const tip = document.createElement('div')
  tip.className = 'skill-tooltip'
  tip.setAttribute('role', 'tooltip')
  tip.hidden = true
  document.body.appendChild(tip)

  let current = null
  let openedBy = null
  let hideTimer = null
  let showFrame = null

  const position = async (chip) => {
    const { x, y } = await computePosition(chip, tip, {
      placement: 'top', middleware: [offset(8), flip(), shift({ padding: 8 })],
    })
    if (chip !== current) return
    Object.assign(tip.style, { left: `${x}px`, top: `${y}px` })
  }

  const show = async (chip, by) => {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
    if (showFrame) { cancelAnimationFrame(showFrame); showFrame = null }
    current = chip
    openedBy = by
    tip.textContent = t(`skills.${chip.dataset.skill}.tip`)
    tip.hidden = false
    await position(chip)
    if (current !== chip) return
    showFrame = requestAnimationFrame(() => {
      tip.classList.add('is-visible')
      showFrame = null
    })
  }

  const hide = () => {
    if (showFrame) { cancelAnimationFrame(showFrame); showFrame = null }
    tip.classList.remove('is-visible')
    current = null
    openedBy = null
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      tip.hidden = true
      hideTimer = null
    }, HIDE_MS)
  }

  root.querySelectorAll('[data-skill]').forEach((chip) => {
    chip.addEventListener('mouseenter', () => show(chip, 'hover'))
    chip.addEventListener('focus', () => show(chip, 'focus'))
    chip.addEventListener('click', () => {
      if (current !== chip) {
        show(chip, 'click')
      } else if (openedBy === 'click') {
        hide()
      } else {
        openedBy = 'click'
      }
    })
    chip.addEventListener('mouseleave', hide)
    chip.addEventListener('blur', hide)
  })
  document.addEventListener('keydown', (e) => e.key === 'Escape' && hide())

  onLangChange(() => {
    if (!current) return
    tip.textContent = t(`skills.${current.dataset.skill}.tip`)
    position(current)
  })
}
