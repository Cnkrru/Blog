<script setup>
import VIcon from '@/components/common/VIcon.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  contentSelector: { type: String, default: '.text-style, .center-card-content, article' },
  wordsPerMinute: { type: Number, default: 300 },
  codeWordsPerMinute: { type: Number, default: 100 },
  minTime: { type: Number, default: 1 }
})

const readingTime = ref(null)

const calculateReadingTime = () => {
  const selectors = props.contentSelector.split(', ')
  let articleContent = null
  
  for (const selector of selectors) {
    articleContent = document.querySelector(selector)
    if (articleContent) break
  }
  
  if (!articleContent) return null

  const clone = articleContent.cloneNode(true)
  
  const codeBlocks = clone.querySelectorAll('pre, code')
  let codeText = ''
  codeBlocks.forEach(block => {
    codeText += block.textContent + ' '
    block.remove()
  })
  
  const text = clone.textContent || clone.innerText || ''
  
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || []
  const chineseCount = chineseChars.length
  
  const englishWords = text.match(/[a-zA-Z]+/g) || []
  const englishCount = englishWords.length
  
  const codeCount = codeText.length
  
  const textTime = (chineseCount + englishCount) / props.wordsPerMinute
  const codeTime = codeCount / props.codeWordsPerMinute
  const totalTime = textTime + codeTime
  
  const minutes = Math.max(props.minTime, Math.ceil(totalTime))
  
  return {
    minutes,
    chineseCount,
    englishCount,
    codeCount,
    totalWords: chineseCount + englishCount + codeCount
  }
}

const formatTime = (timeData) => {
  if (!timeData) return ''
  const minutes = timeData.minutes
  if (minutes < 1) return '&lt;1 分钟'
  if (minutes === 1) return '1 分钟'
  if (minutes < 60) return minutes + ' 分钟'
  const hours = Math.floor(minutes / 60)
  const rm = minutes % 60
  return rm === 0 ? hours + ' 小时' : hours + 'h ' + rm + 'm'
}

const formatNum = (n) => {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

let debounceTimer = null

const initReadingTime = () => {
  setTimeout(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      readingTime.value = calculateReadingTime()
    }, 200)
  }, 100)
}

onMounted(() => initReadingTime())
onUnmounted(() => { if (debounceTimer) clearTimeout(debounceTimer) })
</script>

<template>
  <div class="reading-wrap">
    <div v-if="readingTime" class="reading-card">
      <!-- 字数 -->
      <div class="metric-block">
        <div class="metric-icon">
          <VIcon :src="'file-text.svg'" :size="14" />
        </div>
        <div class="metric-info">
          <span class="metric-value">{{ formatNum(readingTime.totalWords) }}</span>
          <span class="metric-label">总字数</span>
        </div>
      </div>

      <!-- 分隔 -->
      <div class="metric-divider"></div>

      <!-- 中文 -->
      <div class="metric-block metric-sm">
        <div class="metric-info">
          <span class="metric-vsm">{{ formatNum(readingTime.chineseCount) }}</span>
          <span class="metric-lsm">中文</span>
        </div>
      </div>

      <!-- 英文 -->
      <div class="metric-block metric-sm">
        <div class="metric-info">
          <span class="metric-vsm">{{ formatNum(readingTime.englishCount) }}</span>
          <span class="metric-lsm">英文</span>
        </div>
      </div>

      <!-- 代码 -->
      <div class="metric-block metric-sm">
        <div class="metric-info">
          <span class="metric-vsm">{{ formatNum(readingTime.codeCount) }}</span>
          <span class="metric-lsm">代码</span>
        </div>
      </div>

      <!-- 分隔 -->
      <div class="metric-divider"></div>

      <!-- 阅读时间 -->
      <div class="metric-block is-time">
        <div class="metric-icon time-icon">
          <VIcon :src="'clock.svg'" :size="14" />
        </div>
        <div class="metric-info">
          <span class="metric-value" v-html="formatTime(readingTime)"></span>
          <span class="metric-label">预计阅读</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── 布局 ── */
.reading-wrap {
  width: 100%;
  margin: 8px 0;
}

.reading-card {
  width: 100%;
  padding: 10px 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
  border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
}

.metric-block {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.metric-sm {
  gap: 0;
}

.metric-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--common-color-1) 12%, transparent);
  color: var(--common-color-1);
}

.time-icon {
  background: color-mix(in srgb, var(--common-color-1) 10%, transparent);
}

.metric-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.metric-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--common-text);
  line-height: 1;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.metric-vsm {
  font-size: 14px;
  font-weight: 700;
  color: var(--common-text);
  line-height: 1;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  text-align: center;
  min-width: 36px;
}

.metric-label {
  font-size: 11px;
  color: var(--common-text);
  opacity: 0.45;
  line-height: 1;
}

.metric-lsm {
  font-size: 10px;
  color: var(--common-text);
  opacity: 0.4;
  line-height: 1;
  text-align: center;
}

.metric-divider {
  width: 1px;
  height: 24px;
  margin: 0 14px;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--common-text) 10%, transparent);
}

.is-time {
  margin-left: auto;
}
</style>

<style scoped>
@media (max-width: 640px) {
  .reading-card {
    padding: 8px 10px;
    border-radius: 8px;
    gap: 0;
    flex-wrap: wrap;
  }
  .metric-icon {
    width: 28px;
    height: 28px;
    border-radius: 7px;
  }
  .metric-icon svg {
    width: 12px;
    height: 12px;
  }
  .metric-value,
  .metric-vsm {
    font-size: 13px;
  }
  .metric-divider {
    margin: 0 8px;
    height: 20px;
  }
  .metric-sm {
    display: none;
  }
  .metric-divider:nth-of-type(2) {
    display: none;
  }
}
</style>