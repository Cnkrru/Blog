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
    <span class="age-icon">⏱</span>
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
  font-size: 15px;
}

.age-num {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
</style>

<style scoped>
.website-age {
  color: var(--common-content);
}

.age-num {
  color: var(--common-content);
  opacity: 0.85;
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
