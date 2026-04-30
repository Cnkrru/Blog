<script setup lang="ts">
import { ref, onMounted } from 'vue'

const copyrightYear = ref<number>(new Date().getFullYear())

onMounted(() => {
  copyrightYear.value = new Date().getFullYear()
})
</script>

<template>
  <div class="footer-element-card copyright"> 
    © {{ copyrightYear }} Cnkrru · Powered by Vue
  </div>
</template>

<style scoped>
.copyright {
  width: 100%;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
}
</style>

<style scoped>
.copyright {
  color: var(--common-content);
}
</style>

<style scoped>
@media (max-width: var(--md)) {
  .copyright {
    text-align: left;
  }
}
</style>
