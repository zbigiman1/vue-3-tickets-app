<template>
    <div v-if="!ticketsStore.currentTicket || ticketsStore.loading">
        <Loader />        
    </div>
    <div v-else-if="ticketsStore.error">
        <ErrorMessage :error="ticketsStore.error" />
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
                <button class="btn primary" @click="handleUpdateTicketStatus()">{{ t('update') }}</button>
            </div>
        </header>
        <ul class="ticket-details-list">
            <li><strong>{{ t('id') }}</strong>: {{ ticketsStore.currentTicket.id }}</li>
            <li><strong>{{ t('customerName') }}</strong>: {{ ticketsStore.currentTicket.customerName }}</li>
            <li><strong>{{ t('subject') }}</strong>: {{ ticketsStore.currentTicket.subject }}</li>
            <li><strong>{{ t('status') }}</strong>:
                <span class="badge" :class="ticketsStore.currentTicket.status">{{ t(ticketsStore.currentTicket.status) }}</span>
            </li>
            <li><strong>{{ t('priority') }}</strong>: {{ t(ticketsStore.currentTicket.priority) }}</li>
            <li><strong>{{ t('createdAt') }}</strong>: {{ formatDate(ticketsStore.currentTicket.createdAt) }}</li>
        </ul>
        <div class="ticket-description">
            <p><strong>{{ t('description') }}:</strong></p>
            <p>
                {{ ticketsStore.currentTicket.description }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTicketsStore } from '@/stores/useTicketsStore';
import type { Status } from '@/types';
import { formatDate } from '@/utils';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import ErrorMessage from './ErrorMessage.vue';
import Loader from './Loader.vue';

const { t } = useI18n()
const route = useRoute()
const id = parseInt(route.params.id as string)
const status = ref<Status | undefined>(undefined)
const ticketsStore = useTicketsStore();

async function handleUpdateTicketStatus(): Promise<void> {
    if (!status.value || status.value === ticketsStore.currentTicket?.status) {
        return
    }
    await ticketsStore.updateTicketStatus(id, status.value)
}

onMounted(async () => {
    await ticketsStore.getTicketById(id);
    status.value = ticketsStore.currentTicket?.status

})

</script>

<style scoped></style>