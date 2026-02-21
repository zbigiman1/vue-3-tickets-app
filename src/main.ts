import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n'
import { router } from './router'
import './style/main.scss'

const pinia = createPinia()

createApp(App).use(router).use(pinia).use(i18n).mount('#app')
