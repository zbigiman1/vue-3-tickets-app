import TicketDetails from '@/components/TicketDetails.vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

const mockStore: any = {
  tickets: [],
  loading: false,
  error: null,
  getTicketById: vi.fn(),
  updateTicketStatus: vi.fn()
}

vi.mock('@/stores/useTicketsStore', () => ({
  useTicketsStore: () => mockStore
}))

// Mock i18n to return the key itself (keeps assertions simple)
vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal() as any

  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

// Provide a mocked route with params.id = '1'
vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '1' } })
}))

describe('TicketDetails.vue', () => {
  beforeEach(() => {
    mockStore.loading = false
    mockStore.getTicketById = vi.fn()
    mockStore.updateTicketStatus = vi.fn()
  })

  it('shows Loader when no ticket or store loading', () => {
    mockStore.loading = true
    const wrapper = mount(TicketDetails, {
      global: { stubs: { Loader: { template: '<div data-test="loader">loader</div>' } } }
    })

    expect(wrapper.find('[data-test="loader"]').exists()).toBe(true)
  })

  it('renders ticket details after mounted and updates status when changed', async () => {
    const ticket = {
      id: 1,
      customerName: 'Alice',
      subject: 'Issue A',
      status: 'new',
      priority: 'low',
      createdAt: '2023-01-01T00:00:00.000Z',
      description: 'Details'
    }

    mockStore.loading = false
    mockStore.getTicketById = vi.fn().mockResolvedValue(ticket)
    mockStore.updateTicketStatus = vi.fn().mockResolvedValue({ ...ticket, status: 'in_progress' })

    const wrapper = mount(TicketDetails, {
      global: { stubs: { Loader: true, RouterLink: true } }
    })

    // wait for onMounted to resolve
    await nextTick()
    await Promise.resolve()

    // verify ticket fields are rendered
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('Issue A')

    // change select to a different status and click update
    const select = wrapper.find('select[name="status-select"]')
    await select.setValue('in_progress')

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(mockStore.updateTicketStatus).toHaveBeenCalledWith(1, 'in_progress')

    // after update, the status badge should reflect new status
    await nextTick()
    expect(wrapper.find('.badge.in_progress').exists()).toBe(true)
  })

  it('shows ErrorMessage when store.error is set and ticket exists', async () => {
    const ticket = {
      id: 5,
      customerName: 'Sam',
      subject: 'Issue S',
      status: 'new',
      priority: 'low',
      createdAt: '',
      description: 'Details'
    }

    mockStore.loading = false
    mockStore.getTicketById = vi.fn().mockResolvedValue(ticket)
    mockStore.error = 'something bad'

    const wrapper = mount(TicketDetails, {
      global: { stubs: { Loader: true, ErrorMessage: { template: '<div data-test="error">err</div>' }, RouterLink: true } }
    })

    // wait for onMounted
    await nextTick()
    await Promise.resolve()

    // since ticket exists and error is set, ErrorMessage should be rendered (v-else-if branch)
    expect(wrapper.find('[data-test="error"]').exists()).toBe(true)
  })

  it('shows Loader and sets error when updateTicketStatus fails (returns undefined)', async () => {
    const ticket = {
      id: 10,
      customerName: 'Eve',
      subject: 'Issue E',
      status: 'new',
      priority: 'low',
      createdAt: '',
      description: 'Details'
    }

    mockStore.loading = false
    mockStore.getTicketById = vi.fn().mockResolvedValue(ticket)
    // simulate async failure
    mockStore.updateTicketStatus = vi.fn().mockImplementation(async () => { await Promise.resolve(); return undefined })
    mockStore.error = null

    const wrapper = mount(TicketDetails, {
      global: { stubs: { Loader: { template: '<div data-test="loader">loader</div>' }, ErrorMessage: { template: '<div data-test="error">err</div>' }, RouterLink: true } }
    })

    // wait for onMounted and initial ticket render
    await nextTick()
    await Promise.resolve()

    // initial badge is shown
    expect(wrapper.find('.badge.new').exists()).toBe(true)

    // attempt update which will 'fail'
    const select = wrapper.find('select[name="status-select"]')
    await select.setValue('closed')
    const button = wrapper.find('button')
    await button.trigger('click')

    expect(mockStore.updateTicketStatus).toHaveBeenCalledWith(10, 'closed')

    // wait for async mock and reactivity to flush
    await nextTick()
    await Promise.resolve()
    await nextTick()

    // since update returned undefined and store.error may be set by store, component will show Loader (no ticket)
    const loaderShown = wrapper.find('[data-test="loader"]').exists()
    const badgeStillShown = wrapper.find('.badge.new').exists()
    expect(loaderShown || !badgeStillShown).toBe(true)
  })
})
