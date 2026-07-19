import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/grid.css'
import '../styles/header.css'
import '../styles/hero.css'
import { initI18n, setLang, getLang } from './i18n.js'
import { initTypingWidget } from './widgets/typing.js'
import { revealOnScroll } from './utils.js'

initI18n()
initTypingWidget(document.getElementById('typing'))
document.getElementById('lang-toggle').addEventListener('click', () =>
  setLang(getLang() === 'pt' ? 'en' : 'pt'))
revealOnScroll()
