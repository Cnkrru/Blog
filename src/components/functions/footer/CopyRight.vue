<script setup lang="ts">
import { ref, onMounted } from 'vue'

const copyrightYear = ref<number>(new Date().getFullYear())

onMounted(() => {
  // 组件挂载时设置当前年份
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

@media (min-width: 768px) {
  .copyright {
    text-align: left;
  }
}
</style>