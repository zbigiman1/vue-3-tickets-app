import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    test: {
        globals: true,
        environment: 'jsdom',
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
        setupFiles: ['./src/tests/setup.ts'],
    },
})
