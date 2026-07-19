import pt from '../i18n/pt.json'
import en from '../i18n/en.json'

const dicts = { pt, en }
let lang = 'pt'
const listeners = new Set()

export const t = (key) => dicts[lang][key] ?? dicts.pt[key] ?? key
export const getLang = () => lang

export function setLang(next) {
  if (!dicts[next] || next === lang) return
  lang = next
  localStorage.setItem('lang', next)
  apply()
  listeners.forEach((cb) => cb(lang))
}

export const onLangChange = (cb) => listeners.add(cb)

export function initI18n() {
  const stored = localStorage.getItem('lang')
  const detected = navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
  lang = dicts[stored] ? stored : detected
  apply()
}

function apply() {
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  document.title = t('meta.title')
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'))
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n) })
}
