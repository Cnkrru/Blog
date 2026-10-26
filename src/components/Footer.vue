<script setup lang="ts">
import FooterWebAge from './pfooter/WebAge.vue'
import FooterCopyright from './pfooter/Copyright.vue'
</script>

<template>
  <footer class="footer">
    <FooterWebAge />
    <FooterCopyright />
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--space-md);

  padding: var(--space-md);
}
</style>
