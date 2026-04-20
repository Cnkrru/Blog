<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const websiteAge = ref('')
let updateInterval: NodeJS.Timeout | null = null

const padZero = (num: number) => {
  return num.toString().padStart(2, '0')
}

const updateAge = (): void => {
  const startTime : number = new Date('2026-03-28T12:00:00').getTime()
  const now : number = Date.now()
  const diff : number = now - startTime

  const seconds : number = Math.floor(diff / 1000)
  const minutes : number = Math.floor(seconds / 60)
  const hours : number = Math.floor(minutes / 60)
  const days : number = Math.floor(hours / 24)
  const months : number = Math.floor(days / 30)
  const years : number = Math.floor(months / 12)

  const displayMonths : number = months % 12
  const displayDays : number = days % 30
  const displayHours : number = hours % 24
  const displayMinutes : number = minutes % 60
  const displaySeconds : number = seconds % 60

  // 显示标准格式：年-月-日 小时:分:秒，使用 i18n 翻译
  websiteAge.value = `${years}${t('year')}${displayMonths}${t('month')}${displayDays}${t('day')} ${padZero(displayHours)}${t('hour')}${padZero(displayMinutes)}${t('minute')}${padZero(displaySeconds)}${t('second')}`
}

onMounted(() => {
  updateAge()
  updateInterval = setInterval(updateAge, 1000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})

</script>

<template>
  <div class="footer-element-card website-age">
    {{ t('websiteAge') }} {{ websiteAge }}
  </div>
</template>

<style scoped>
.website-age {
  width: 100%;
  text-align: center;
  font-size: 0.9rem;
}

@media (min-width: 768px) {
  .website-age {
    text-align: left;
  }
}
</style>