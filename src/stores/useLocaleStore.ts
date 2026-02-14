import { i18n } from '@/i18n'
import type { Language } from '@/types'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<Language>((localStorage.getItem('lang') as Language) || 'en')

  function setLocale(newLocale: Language) {
    locale.value = newLocale
  }

  // Sync with vue-i18n
  watch(locale, (newLocale) => {
    i18n.global.locale.value = newLocale
    localStorage.setItem('lang', newLocale)
  }, { immediate: true })

  return {
    locale,
    setLocale
  }
})
