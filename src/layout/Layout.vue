<template>
    <Header />
    <main class="container">
        <slot />
    </main>
    <Footer />
</template>

<script setup lang="ts">
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
</script>

<style scoped></style>