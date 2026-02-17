import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the API module before importing the store so the store imports the mocked functions
const mockGetTickets = vi.fn()
const mockGetTicketById = vi.fn()
const mockUpdateTicketStatus = vi.fn()

vi.mock('@/api', () => ({
  getTickets: (...args: any[]) => mockGetTickets(...args),
  getTicketById: (...args: any[]) => mockGetTicketById(...args),
  updateTicketStatus: (...args: any[]) => mockUpdateTicketStatus(...args),
}))

import { useTicketsStore } from '@/stores/useTicketsStore'

describe('useTicketsStore', () => {
  beforeEach(() => {
    // create fresh pinia instance for each test
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('getTickets sets loading and populates tickets', async () => {
    const tickets = [{ id: 1, subject: 'A', status: 'new', customerName: 'X', priority: 'low', createdAt: '', description: '' }]
    mockGetTickets.mockResolvedValue(tickets)

    const store = useTicketsStore()

    const p = store.getTickets()
    // loading should be true while promise pending
    expect(store.loading).toBe(true)

    const result = await p
    expect(result).toEqual(tickets)
    expect(store.loading).toBe(false)
    // error should be cleared on success
    expect(store.error).toBeNull()
    expect(store.tickets).toEqual(tickets)
    expect(mockGetTickets).toHaveBeenCalled()
  })

  it('getTicketById sets loading and returns ticket', async () => {
    const ticket = { id: 2, subject: 'B', status: 'closed', customerName: 'Y', priority: 'high', createdAt: '', description: '' }
    mockGetTicketById.mockResolvedValue(ticket)

    const store = useTicketsStore()

    const p = store.getTicketById(2)
    expect(store.loading).toBe(true)

    const result = await p
    expect(result).toEqual(ticket)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(mockGetTicketById).toHaveBeenCalledWith(2)
  })

  it('updateTicketStatus updates existing ticket in store when present', async () => {
    const initial = [{ id: 3, subject: 'C', status: 'new', customerName: 'Z', priority: 'medium', createdAt: '', description: '' }]
    const updated = { ...initial[0], status: 'in_progress' }

    const store = useTicketsStore()
    // Pinia unwraps refs returned from setup stores so we can assign directly
    // cast to any to avoid strict Priority/Status unions in test fixtures
    store.tickets = initial as any

    mockUpdateTicketStatus.mockResolvedValue(updated)

    const p = store.updateTicketStatus(3, 'in_progress')
    expect(store.loading).toBe(true)

    const result = await p
    expect(result).toEqual(updated)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.tickets.find((t: any) => t.id === 3)?.status).toBe('in_progress')
    expect(mockUpdateTicketStatus).toHaveBeenCalledWith(3, 'in_progress')
  })

  it('updateTicketStatus does not change tickets if ticket not present', async () => {
    const store = useTicketsStore()
    store.tickets = [] as any

    const updated = { id: 99, subject: 'X', status: 'closed', customerName: 'No', priority: 'low', createdAt: '', description: '' }
    mockUpdateTicketStatus.mockResolvedValue(updated)

    const p = store.updateTicketStatus(99, 'closed')
    expect(store.loading).toBe(true)

    const result = await p
    expect(result).toEqual(updated)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    // tickets array remains unchanged
    expect(store.tickets).toEqual([])
  })

  it('getTickets sets error when API fails', async () => {
    mockGetTickets.mockRejectedValue(new Error('network'))
    const store = useTicketsStore()

    const result = await store.getTickets()
    expect(result).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe('network')
  })

  it('getTicketById sets error when API fails', async () => {
    mockGetTicketById.mockRejectedValue(new Error('not found'))
    const store = useTicketsStore()

    const result = await store.getTicketById(5)
    expect(result).toBeUndefined()
    expect(store.loading).toBe(false)
    expect(store.error).toBe('not found')
  })

  it('updateTicketStatus sets error when API fails and does not mutate tickets', async () => {
    const initial = [{ id: 7, subject: 'G', status: 'new', customerName: 'Z', priority: 'medium', createdAt: '', description: '' }]
    const store = useTicketsStore()
    store.tickets = initial as any

    mockUpdateTicketStatus.mockRejectedValue(new Error('update failed'))

    const result = await store.updateTicketStatus(7, 'closed')
    expect(result).toBeUndefined()
    expect(store.loading).toBe(false)
    expect(store.error).toBe('update failed')
  // tickets should remain unchanged
  expect(store.tickets.length).toBeGreaterThan(0)
  expect(store.tickets[0]!.status).toBe('new')
  })

  it('filterTicketsByStatus returns filtered list', () => {
    const list = [
      { id: 1, status: 'new' },
      { id: 2, status: 'closed' },
      { id: 3, status: 'new' }
    ]
    const store2 = useTicketsStore()
    store2.tickets = list as any

    const filtered = store2.filterTicketsByStatus('new')
    expect(filtered).toEqual([list[0], list[2]])
  })
})
