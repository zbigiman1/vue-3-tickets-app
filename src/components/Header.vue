<template>
    <header class="header">
        <div class="header-content">
            <h1>{{ t('title') }}</h1>
            <div class="locale-switcher">
                <button @click="localeStore.setLocale('en')"
                    :class="{ 'active': localeStore.locale === 'en' }">EN</button>
                <button @click="localeStore.setLocale('pl')"
                    :class="{ 'active': localeStore.locale === 'pl' }">PL</button>
            </div>
        </div>
    </header>
</template>
<script setup lang="ts">
import { useLocaleStore } from '@/stores/useLocaleStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const localeStore = useLocaleStore()

</script>
