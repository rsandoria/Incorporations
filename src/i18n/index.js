import { createI18n } from 'vue-i18n'
import es from './es.json'
import en from './en.json'

const idiomaGuardado = localStorage.getItem('idioma') || 'es'

const i18n = createI18n({
  legacy: false,
  locale: idiomaGuardado,
  fallbackLocale: 'es',
  messages: { es, en }
})

export function cambiarIdioma(idioma) {
  i18n.global.locale.value = idioma
  localStorage.setItem('idioma', idioma)
}

export default i18n
