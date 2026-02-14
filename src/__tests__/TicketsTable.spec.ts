import TicketsTable from '@/components/TicketsTable.vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

// Mutable mocks that tests will update per-case
const mockStore: any = {
  tickets: [],
  loading: false,
  getTickets: vi.fn(),
  filterTicketsByStatus: vi.fn()
}

let pushMock = vi.fn()

// Mock the tickets store module
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

// Mock router to capture push calls
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: (...args: any[]) => pushMock(...args) })
}))

describe('TicketsTable.vue', () => {
  beforeEach(() => {
    // reset mocks before every test
    mockStore.tickets = []
    mockStore.loading = false
    mockStore.getTickets = vi.fn()
    mockStore.filterTicketsByStatus = vi.fn()
    pushMock = vi.fn()
  })

  it('shows Loader when store.loading is true', async () => {
    mockStore.loading = true
    const wrapper = mount(TicketsTable, {
      global: {
        // stub Loader so there's a recognizable stub element
        stubs: { Loader: { template: '<div data-test="loader">loader</div>' } }
      }
    })

    // loader is rendered when loading
    expect(wrapper.find('[data-test="loader"]').exists()).toBe(true)
  })

  it('renders tickets after mounted and navigates when a row is clicked', async () => {
    const tickets = [
      { id: 1, customerName: 'Alice', subject: 'Issue A', status: 'new', priority: 'low' },
      { id: 2, customerName: 'Bob', subject: 'Issue B', status: 'closed', priority: 'high' }
    ]

    mockStore.loading = false
    mockStore.tickets = tickets
    mockStore.getTickets = vi.fn().mockResolvedValue(tickets)

    const wrapper = mount(TicketsTable, {
      global: {
        stubs: { Loader: true }
      }
    })

    // Wait for the onMounted async getTickets to resolve
    await nextTick()
    await Promise.resolve()

    const rows = wrapper.findAll('tbody tr.ticket-row')
    expect(rows.length).toBe(2)

    // Click first row and assert router.push called with expected path
    const firstRow = rows[0]
    expect(firstRow).toBeDefined()
    await firstRow!.trigger('click')
    expect(pushMock).toHaveBeenCalledWith('/ticket/1')
  })

  it('filters tickets when select value changes', async () => {
    const allTickets = [
      { id: 1, customerName: 'Alice', subject: 'Issue A', status: 'new', priority: 'low' },
      { id: 2, customerName: 'Bob', subject: 'Issue B', status: 'closed', priority: 'high' },
      { id: 3, customerName: 'Charlie', subject: 'Issue C', status: 'new', priority: 'medium' }
    ]

    const filtered = allTickets.filter(t => t.status === 'new')

    mockStore.loading = false
    mockStore.tickets = allTickets
    mockStore.getTickets = vi.fn().mockResolvedValue(allTickets)
    mockStore.filterTicketsByStatus = vi.fn().mockReturnValue(filtered)

    const wrapper = mount(TicketsTable, {
      global: {
        stubs: { Loader: true }
      }
    })

    await nextTick()
    await Promise.resolve()

    // initially all rows rendered
    expect(wrapper.findAll('tbody tr.ticket-row').length).toBe(3)

    // change select to 'new' and trigger change
    const select = wrapper.find('select')
    await select.setValue('new')
    // ensure filter method was called with correct arg
    expect(mockStore.filterTicketsByStatus).toHaveBeenCalledWith('new')

    // after change, rows should equal filtered length
    await nextTick()
    expect(wrapper.findAll('tbody tr.ticket-row').length).toBe(filtered.length)
  })
})
