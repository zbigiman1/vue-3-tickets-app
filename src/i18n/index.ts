import { createI18n } from 'vue-i18n'
import { en } from './en'
import { pl } from './pl'

export const messages = {
  en,
  pl
}
  
export const i18n = createI18n({
  legacy: false,
  locale: 'pl',
  fallbackLocale: 'pl',
  messages
})
