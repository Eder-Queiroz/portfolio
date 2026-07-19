import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/grid.css'
import '../styles/header.css'
import '../styles/hero.css'
import '../styles/skills.css'
import '../styles/ledger.css'
import '../styles/sqs.css'
import '../styles/genetic.css'
import '../styles/sections.css'
import { initI18n, setLang, getLang } from './i18n.js'
import { initTypingWidget } from './widgets/typing.js'
import { initSkillsWidget } from './widgets/skills.js'
import { initLedgerWidget } from './widgets/ledger.js'
import { initSqsWidget } from './widgets/sqs.js'
import { initGeneticWidget } from './widgets/genetic.js'
import { revealOnScroll } from './utils.js'

initI18n()
initTypingWidget(document.getElementById('typing'))
initSkillsWidget(document.getElementById('skills'))
initLedgerWidget(document.getElementById('ledger-case'))
initSqsWidget(document.getElementById('sqs-case'))
initGeneticWidget(document.getElementById('ga-case'))
document.getElementById('lang-toggle').addEventListener('click', () =>
  setLang(getLang() === 'pt' ? 'en' : 'pt'))
revealOnScroll()
