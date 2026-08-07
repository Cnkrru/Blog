<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const ageText = ref('')
let timer: ReturnType<typeof setInterval> | null = null

function update() {
  const start = new Date('2026-03-28T12:00:00').getTime()
  const diff = Date.now() - start
  const days = Math.floor(diff / 86400000)
  const years = Math.floor(days / 365)
  const remainDays = days % 365
  const months = Math.floor(remainDays / 30)
  const rd = remainDays % 30
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)

  ageText.value = `${years} 年 ${months} 月 ${rd} 天 ${hours} 时 ${mins} 分`
}

onMounted(() => {
  update()
  timer = setInterval(update, 60000) // 每分钟刷新
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="footer-element-card website-age">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="age-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
    <span>本站已运行</span>
    <span class="age-num">{{ ageText }}</span>
  </div>
</template>

<style scoped>
.website-age {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 14px;
  letter-spacing: 0.3px;
}

.age-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  opacity: 0.6;
}

.age-num {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
</style>

<style scoped>
.website-age {
  color: var(--common-text);
}

.age-num {
  color: var(--common-color-1);
  font-weight: 600;
}
</style>

<style scoped>
@media (max-width: 768px) {
  .website-age {
    justify-content: flex-start;
    font-size: 13px;
  }
}
</style>
