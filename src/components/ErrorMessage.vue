<template>
  <div class="error-message" data-test="error">
    <p>
      {{ t('somethingWentWrong') }} {{ props.error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const props = defineProps<{ error:string}>()
const { t } = useI18n()

</script>

<style scoped></style>
