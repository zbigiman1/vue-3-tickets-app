import { getTicketById as apiGetTickedById, getTickets as apiGetTickets, updateTicketStatus as apiUpdateTicketStatus } from '@/api'
import type { Ticket } from '@/types/Ticket'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTicketsStore = defineStore('tickets', () => {
    const tickets = ref<Ticket[]>([])
    const currentTicket = ref<Ticket | undefined>(undefined)
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function getTickets(): Promise<void> {
        loading.value = true
        error.value = null
        try {
            tickets.value = await apiGetTickets()
         } catch (e: any) {
            error.value = e instanceof Error ? e.message : String(e)
        } finally {
            loading.value = false
        }
    }

    async function getTicketById(id: number): Promise<void> {
        if (currentTicket.value && currentTicket.value.id === id) {
            return
        }
        currentTicket.value = undefined
        loading.value = true
        error.value = null
        try {
            currentTicket.value = await apiGetTickedById(id)
        } catch (e: any) {
            error.value = e instanceof Error ? e.message : String(e)
           } finally {
            loading.value = false
        }
    }

    async function updateTicketStatus(id: number, status: Ticket['status']): Promise<void> {
        loading.value = true
        error.value = null
        try {
            const updatedTicket = await apiUpdateTicketStatus(id, status)
            if (updatedTicket) {
                const index = tickets.value.findIndex(t => t.id === id)
                if (index !== -1) {
                    tickets.value[index] = updatedTicket
                }
            }
            currentTicket.value = updatedTicket
        } catch (e: any) {
            error.value = e instanceof Error ? e.message : String(e)
        } finally {
            loading.value = false
        }
    }

    function filterTicketsByStatus(status: Ticket['status']): Ticket[] {
        return tickets.value.filter(t => t.status === status)
    }

    return {
        tickets,
        currentTicket,
        getTickets,
        getTicketById,
        updateTicketStatus,
        filterTicketsByStatus,
        loading,
        error
    }
})



