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
  font-size: 13px;
  font-weight: 400;
  color: var(--common-text);
  opacity: 0.7;
}
</style>

<style scoped>
@media (max-width: 768px) {
  .copyright {
    text-align: left;
  }
}
</style>
