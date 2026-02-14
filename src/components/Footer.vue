<template>
    <footer class="footer">
        <p>{{ t('copyright') }} &copy; {{ new Date().getFullYear() }}</p>
    </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

</script>

<style scoped></style>