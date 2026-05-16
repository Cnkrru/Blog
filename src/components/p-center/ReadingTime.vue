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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </span>
        <span class="reading-time-text">
          预计阅读时间: {{ formatTime(readingTime) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reading-time-wrapper {
    width: 100%;
    margin: 10px 0;
}

.reading-time-container {
    width: 100%;
    padding: 10px 15px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s ease;
}

.word-count-section {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.word-count-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

.word-count-text {
    font-size: 14px;
    font-weight: 500;
}

.word-count-detail {
    font-size: 12px;
}

.reading-time-section {
    display: flex;
    align-items: center;
    gap: 8px;
}

.reading-time-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

.reading-time-text {
    font-size: 14px;
    font-weight: 500;
}
</style>

<style scoped>
.reading-time-container {
    background-color: var(--common-bg);
    border: 2px solid var(--common-color-1);
}

.word-count-icon {
    color: var(--common-text);
}

.word-count-text {
    color: var(--common-text);
}

.word-count-detail {
    color: var(--common-text);
}

.reading-time-icon {
    color: var(--common-text);
}

.reading-time-text {
    color: var(--common-text);
}
</style>

<style scoped>
@media (max-width: 639px) {
    .reading-time-container {
        padding: 8px 12px;
        margin: 8px 0;
        border-radius: 16px;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    
    .word-count-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }
    
    .word-count-detail {
        font-size: 11px;
    }
    
    .word-count-text,
    .reading-time-text {
        font-size: 12px;
    }
    
    .word-count-icon,
    .reading-time-icon {
        width: 14px;
        height: 14px;
    }
    
}

@media (max-width: 640px) {
    .reading-time-container {
        padding: 9px 13px;
        margin: 9px 0;
        border-radius: 18px;
    }
    
    .word-count-detail {
        font-size: 11px;
    }
    
    .word-count-text,
    .reading-time-text {
        font-size: 13px;
    }
    
    .word-count-icon,
    .reading-time-icon {
        width: 15px;
        height: 15px;
    }
    
}

@media (max-width: 768px) {
    .reading-time-container {
        padding: 10px 15px;
        margin: 10px 0;
        border-radius: 20px;
    }
    
    .word-count-detail {
        font-size: 12px;
    }
    
    .word-count-text,
    .reading-time-text {
        font-size: 14px;
    }
    
    .word-count-icon,
    .reading-time-icon {
        width: 16px;
        height: 16px;
    }
}
</style>
