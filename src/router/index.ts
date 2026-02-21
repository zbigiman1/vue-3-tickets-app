import TicketDetails from '@/views/TicketDetails.vue'
import TicketsList from '@/views/TicketsList.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'tickets-list',
    component: TicketsList
  },
  {
    path: '/ticket/:id',
    name: 'ticket-details',
    component: TicketDetails,
    props: true
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
