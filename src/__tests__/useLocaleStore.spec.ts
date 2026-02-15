import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

// Create a mutable i18n mock object before we import the store
const i18nMock: any = { global: { locale: { value: 'en' } } }

vi.mock('@/i18n', () => ({
  // provide i18n via a getter so the test can set i18nMock later without TDZ issues
  get i18n() {
    return i18nMock
  }
}))

import { useLocaleStore } from '@/stores/useLocaleStore'

describe('useLocaleStore', () => {
  beforeEach(() => {
    // fresh pinia instance per test
    setActivePinia(createPinia())
    // clear localStorage and reset mocked i18n
    localStorage.clear()
    i18nMock.global.locale.value = 'en'
    vi.clearAllMocks()
  })

  it('initializes from localStorage and syncs to i18n (watch immediate)', () => {
    // seed localStorage with 'pl'
    localStorage.setItem('lang', 'pl')

    const store = useLocaleStore()

    // store should pick up the language from localStorage
    expect(store.locale).toBe('pl')

    // watch has immediate: true, so i18n global locale should be updated
    expect(i18nMock.global.locale.value).toBe('pl')

    // localStorage should still contain the value
    expect(localStorage.getItem('lang')).toBe('pl')
  })

  it('setLocale updates store, i18n and localStorage', async () => {
    const store = useLocaleStore()

    // initial values
    expect(store.locale).toBe('en')
    expect(i18nMock.global.locale.value).toBe('en')

    // change locale via setter
    store.setLocale('pl')

    // wait for Vue reactivity to flush so watchers run
    await nextTick()

    expect(store.locale).toBe('pl')
    expect(i18nMock.global.locale.value).toBe('pl')
    expect(localStorage.getItem('lang')).toBe('pl')
  })
})
