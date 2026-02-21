<template>
    <div v-if="ticketsStore.loading">
        <Loader />
    </div>
    <div v-else-if="ticketsStore.error">
        <ErrorMessage :error="ticketsStore.error" />
    </div>
    <div v-else>
        <div class="tickets-filter">
            <div class="select-wrapper">
                <label for="status-select" class="select-label">{{ t('filterByStatus') }}:</label>
                <select v-model="filter" name="status-select" class="select">
                    <option value="new">{{ t('new') }}</option>
                    <option value="in_progress">{{ t('in_progress') }}</option>
                    <option value="closed">{{ t('closed') }}</option>
                    <option value="all">{{ t('all') }}</option>
                </select>
            </div>
        </div>
        <table class="tickets-table">
            <thead>
                <tr>
                    <th><strong>{{ t('id') }}</strong></th>
                    <th><strong>{{ t('customerName') }}</strong></th>
                    <th><strong>{{ t('subject') }}</strong></th>
                    <th><strong>{{ t('status') }}</strong></th>
                    <th><strong>{{ t('priority') }}</strong></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ticket in filteredTickets" :key="ticket.id" class="ticket-row" @click="handaleRowClick(ticket.id)">
                    <td>{{ ticket.id }}</td>
                    <td>{{ ticket.customerName }}</td>
                    <td>{{ ticket.subject }}</td>
                    <td><span class="badge" :class="ticket.status">{{ t(ticket.status) }}</span></td>
                    <td>{{ t(ticket.priority) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import ErrorMessage from '@/components/ErrorMessage.vue';
import Loader from '@/components/Loader.vue';
import { useTicketsStore } from '@/stores/useTicketsStore';
import type { Status } from '@/types';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n()
const router = useRouter()
const ticketsStore = useTicketsStore();
const filter = ref<Status | 'all'>('all')

const filteredTickets = computed(() => {
    if (filter.value === 'all') {
        return ticketsStore.tickets
    } else {
        return ticketsStore.filterTicketsByStatus(filter.value)
    }
})    

function handaleRowClick(id: number) {
    router.push(`/ticket/${id}`)
}

onMounted(async () => {
    await ticketsStore.getTickets()
})
</script>

<style scoped></style>