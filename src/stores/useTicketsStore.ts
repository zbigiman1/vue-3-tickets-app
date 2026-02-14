import { getTicketById as apiGetTickedById, getTickets as apiGetTickets, updateTicketStatus as apiUpdateTicketStatus } from '@/api'
import type { Ticket } from '@/types/Ticket'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTicketsStore = defineStore('tickets', () => {
    const tickets = ref<Ticket[]>([])
    const loading = ref(false)

    async function getTickets(): Promise<Ticket[]> {
        loading.value = true
        tickets.value = await apiGetTickets()
        loading.value = false
        return tickets.value
    }

    async function getTicketById(id: number): Promise<Ticket | undefined> {
        loading.value = true
        const ticket = await apiGetTickedById(id)
        loading.value = false
        return ticket
    }

    async function updateTicketStatus(id: number, status: Ticket['status']): Promise<Ticket | undefined> {
        loading.value = true
        const updatedTicket = await apiUpdateTicketStatus(id, status)
        if (updatedTicket) {
            const index = tickets.value.findIndex(t => t.id === id)
            if (index !== -1) {
                tickets.value[index] = updatedTicket
            }
        }
        loading.value = false
        return updatedTicket
    }

    function filterTicketsByStatus(status: Ticket['status']): Ticket[] {
        return tickets.value.filter(t => t.status === status)
    }

    return {
        tickets,
        getTickets,
        getTicketById,
        updateTicketStatus,
        filterTicketsByStatus,
        loading
    }
})



