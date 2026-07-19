import { computePosition, offset, flip, shift } from '@floating-ui/dom'
import { t } from '../i18n.js'

export function initSkillsWidget(root) {
  const tip = document.createElement('div')
  tip.className = 'skill-tooltip'
  tip.setAttribute('role', 'tooltip')
  tip.hidden = true
  document.body.appendChild(tip)
  let current = null

  const show = async (chip) => {
    current = chip
    tip.textContent = t(`skills.${chip.dataset.skill}.tip`)
    tip.hidden = false
    const { x, y } = await computePosition(chip, tip, {
      placement: 'top', middleware: [offset(8), flip(), shift({ padding: 8 })],
    })
    Object.assign(tip.style, { left: `${x}px`, top: `${y}px` })
  }
  const hide = () => { tip.hidden = true; current = null }

  root.querySelectorAll('[data-skill]').forEach((chip) => {
    chip.addEventListener('mouseenter', () => show(chip))
    chip.addEventListener('focus', () => show(chip))
    chip.addEventListener('click', () => (current === chip && !tip.hidden ? hide() : show(chip)))
    chip.addEventListener('mouseleave', hide)
    chip.addEventListener('blur', hide)
  })
  document.addEventListener('keydown', (e) => e.key === 'Escape' && hide())
}
