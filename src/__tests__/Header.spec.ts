import Header from '@/components/Header.vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockLocaleStore: any = {
  locale: 'en',
  setLocale: vi.fn()
}

vi.mock('@/stores/useLocaleStore', () => ({
  useLocaleStore: () => mockLocaleStore
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (k: string) => (k === 'title' ? 'My App' : k) })
}))

describe('Header.vue', () => {
  beforeEach(() => {
    mockLocaleStore.locale = 'en'
    mockLocaleStore.setLocale = vi.fn()
  })

  it('renders title from i18n', () => {
    const wrapper = mount(Header)
    expect(wrapper.text()).toContain('My App')
  })

  it('calls setLocale when buttons clicked and updates active class', async () => {
    const wrapper = mount(Header)

    const buttons = wrapper.findAll('.locale-switcher button')
    const enButton = buttons[0]
    const plButton = buttons[1]

    // ensure elements exist
    expect(enButton).toBeDefined()
    expect(plButton).toBeDefined()

    // EN is active initially
    expect(enButton!.classes()).toContain('active')
    expect(plButton!.classes()).not.toContain('active')

    // click PL
    await plButton!.trigger('click')
    expect(mockLocaleStore.setLocale).toHaveBeenCalledWith('pl')

    // simulate store locale change and remount to inspect classes
    mockLocaleStore.locale = 'pl'
    const wrapper2 = mount(Header)
    const buttons2 = wrapper2.findAll('.locale-switcher button')
    expect(buttons2[1]).toBeDefined()
    expect(buttons2[1]!.classes()).toContain('active')
  })
})
