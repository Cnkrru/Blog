<script setup lang="ts">
import HeaderLogo from './pheader/Logo.vue'
import HeaderSearch from './pheader/Search.vue'
import HeaderButtons from './pheader/Buttons.vue'
</script>

<template>
  <header class="header">
    <HeaderLogo />
    <HeaderSearch />
    <HeaderButtons />
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  height: 64px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  gap: var(--space-md);

  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 15%, transparent);
}
</style>
