<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useThemeStore } from '../../stores'

const props = withDefaults(defineProps<{
  contentSelector?: string
  wordsPerMinute?: number
  codeWordsPerMinute?: number
  minTime?: number
}>(), {
  contentSelector: '.text-style, .center-card-content, article',
  wordsPerMinute: 300,
  codeWordsPerMinute: 100,
  minTime: 1
})

const themeStore = useThemeStore()
const readingTime = ref(null)

const isDarkTheme = computed(() => themeStore.isDark)

const calculateReadingTime = () => {
  const selectors = props.contentSelector.split(', ')
  let articleContent = null
  
  for (const selector of selectors) {
    articleContent = document.querySelector(selector)
    if (articleContent) break
  }
  
  if (!articleContent) {
    return null
  }

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
    minutes: minutes,
    chineseCount: chineseCount,
    englishCount: englishCount,
    codeCount: codeCount,
    totalWords: chineseCount + englishCount + codeCount
  }
}

const formatTime = (timeData) => {
  if (!timeData) return ''
  
  const minutes = timeData.minutes
  
  if (minutes < 1) {
    return '小于 1 分钟'
  } else if (minutes === 1) {
    return '1 分钟'
  } else if (minutes < 60) {
    return minutes + ' 分钟'
  } else {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      return hours + ' 小时'
    } else {
      return hours + ' 小时 ' + remainingMinutes + ' 分钟'
    }
  }
}

let debounceTimer = null

const initReadingTime = () => {
  setTimeout(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    debounceTimer = setTimeout(() => {
      const timeData = calculateReadingTime()
      readingTime.value = timeData
    }, 200)
  }, 100)
}

onMounted(() => {
  initReadingTime()
})

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<template>
  <div class="reading-time-wrapper">
    <!-- 阅读时间显示 -->
    <div v-if="readingTime" class="reading-time-container" :class="{ 'dark-theme': isDarkTheme }">
      <!-- 字数统计 -->
      <div class="word-count-section">
        <span class="word-count-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </span>
        <span class="word-count-text">
          字数统计: {{ readingTime.totalWords }} 字
        </span>
        <span class="word-count-detail">
          ({{ readingTime.chineseCount }}中文 / {{ readingTime.englishCount }}英文 / {{ readingTime.codeCount }}代码)
        </span>
      </div>
      
      <!-- 阅读时间 -->
      <div class="reading-time-section">
        <span class="reading-time-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </span>
        <span class="reading-time-text">
          预计阅读时间: {{ formatTime(readingTime) }}
        </span>
      </div>
    </div>
  </div>
</template>

<!-- 布局样式 -->
<style scoped>
.reading-time-wrapper {
    width: 100%;
    margin: 8px 0;
}

.reading-time-container {
    width: 100%;
    padding: 8px 14px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
}

.word-count-section {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.word-count-icon,
.reading-time-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
}

.word-count-icon img,
.reading-time-icon img {
    width: 100%;
    height: 100%;
    display: block;
}

.word-count-text,
.reading-time-text {
    font-size: 13px;
    font-weight: 500;
    line-height: 1;
}

.word-count-detail {
    font-size: 11px;
}

.reading-time-section {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}
</style>

<!-- 颜色样式 -->
<style scoped>
.reading-time-container {
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
    border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
    color: var(--common-text);
}
.word-count-detail {
    opacity: 0.55;
}
</style>

<!-- 响应式 -->
<style scoped>
@media (max-width: 640px) {
    .reading-time-container {
        padding: 6px 10px;
        border-radius: 8px;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
    }
    .word-count-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 3px;
    }
    .word-count-text,
    .reading-time-text {
        font-size: 12px;
    }
    .word-count-icon,
    .reading-time-icon {
        width: 13px;
        height: 13px;
    }
}
</style>
