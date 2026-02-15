<template>
    <div v-if="!ticket || ticketsStore.loading">
        <Loader />
    </div>
    <div v-else class="ticket-details">
        <header class="ticket-details-header">
            <nav>
                <router-link to="/">
                    <span class="back-to-list-chevron">&#x3c;&#x3c;</span>
                    <span class="back-to-list-text">{{ t('ticketsList') }}</span>
                </router-link>
            </nav>
            <div class="ticket-status-dropdown">
                <div class="select-wrapper collapse-on-mobile">
                    <label for="status-select" class="select-label">{{ t('updateTicketStatus') }}:</label>
                    <select v-model="status" name="status-select" class="select">
                        <option value="new">{{ t('new') }}</option>
                        <option value="in_progress">{{ t('in_progress') }}</option>
                        <option value="closed">{{ t('closed') }}</option>
                    </select>
                </div>
                <button class="btn primary" @click="handleUpdateTicketStatus(ticket.id)">{{ t('update') }}</button>
            </div>
        </header>
        <ul class="ticket-details-list">
            <li><strong>{{ t('id') }}</strong>: {{ ticket.id }}</li>
            <li><strong>{{ t('customerName') }}</strong>: {{ ticket.customerName }}</li>
            <li><strong>{{ t('subject') }}</strong>: {{ ticket.subject }}</li>
            <li><strong>{{ t('status') }}</strong>:
                <span class="badge" :class="ticket.status">{{ t(ticket.status) }}</span>
            </li>
            <li><strong>{{ t('priority') }}</strong>: {{ t(ticket.priority) }}</li>
            <li><strong>{{ t('createdAt') }}</strong>: {{ formatDate(ticket.createdAt) }}</li>
        </ul>
        <div class="ticket-description">
            <p><strong>{{ t('description') }}:</strong></p>
            <p>
                {{ ticket?.description }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTicketsStore } from '@/stores/useTicketsStore';
import type { Status, Ticket } from '@/types';
import { formatDate } from '@/utils';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Loader from './Loader.vue';

const { t } = useI18n()
const route = useRoute()
const id = parseInt(route.params.id as string)
const ticket = ref<Ticket | undefined>(undefined)
const status = ref<Status | undefined>(undefined)
const ticketsStore = useTicketsStore();

async function handleUpdateTicketStatus(id: number) {
    if (!status.value || status.value === ticket.value?.status) {
        return
    }
    ticket.value = await ticketsStore.updateTicketStatus(id, status.value)
}

onMounted(async () => {
    ticket.value = await ticketsStore.getTicketById(id);
    status.value = ticket.value?.status
})

</script>

<style scoped></style>