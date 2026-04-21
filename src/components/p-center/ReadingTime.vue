<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useThemeStore } from '../../stores'

const props = defineProps({
  contentSelector: {
    type: String,
    default: '.text-style, .center-card-content, article'
  },
  wordsPerMinute: {
    type: Number,
    default: 300
  },
  codeWordsPerMinute: {
    type: Number,
    default: 100
  },
  minTime: {
    type: Number,
    default: 1
  }
})

const themeStore = useThemeStore()
const readingTime = ref(null)
const isLoaded = ref(false)
const isCalculating = ref(false)
const error = ref(null)

const isDarkTheme = computed(() => themeStore.isDark)

const calculateReadingTime = () => {
  try {
    // 获取文章内容区域
    const selectors = props.contentSelector.split(', ')
    let articleContent = null
    
    for (const selector of selectors) {
      articleContent = document.querySelector(selector)
      if (articleContent) break
    }
    
    if (!articleContent) {
      error.value = '无法找到文章内容区域'
      return null
    }

    // 克隆元素以避免修改原内容
    const clone = articleContent.cloneNode(true)
    
    // 移除代码块（代码阅读速度较慢）
    const codeBlocks = clone.querySelectorAll('pre, code')
    let codeText = ''
    codeBlocks.forEach(block => {
      codeText += block.textContent + ' '
      block.remove()
    })
    
    // 获取纯文本内容
    const text = clone.textContent || clone.innerText || ''
    
    // 统计中文字符
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || []
    const chineseCount = chineseChars.length
    
    // 统计英文单词
    const englishWords = text.match(/[a-zA-Z]+/g) || []
    const englishCount = englishWords.length
    
    // 统计代码字符
    const codeCount = codeText.length
    
    // 计算阅读时间（分钟）
    const textTime = (chineseCount + englishCount) / props.wordsPerMinute
    const codeTime = codeCount / props.codeWordsPerMinute
    const totalTime = textTime + codeTime
    
    // 确保最小阅读时间
    const minutes = Math.max(props.minTime, Math.ceil(totalTime))
    
    return {
      minutes: minutes,
      chineseCount: chineseCount,
      englishCount: englishCount,
      codeCount: codeCount,
      totalWords: chineseCount + englishCount + codeCount
    }
  } catch (err) {
    error.value = '计算阅读时间时发生错误'
    console.error('Failed to calculate reading time:', err)
    return null
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
  // 延迟执行，确保文章内容已加载
  setTimeout(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    debounceTimer = setTimeout(() => {
      isCalculating.value = true
      error.value = null
      
      const timeData = calculateReadingTime()
      readingTime.value = timeData
      isLoaded.value = true
      isCalculating.value = false
    }, 200)
  }, 100)
}

const retry = () => {
  error.value = null
  initReadingTime()
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
    <!-- 加载状态 -->
    <div v-if="isCalculating" class="reading-time-loading">
      <div class="loading-spinner"></div>
      <span class="loading-text">正在计算阅读时间...</span>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="reading-time-error">
      <span class="error-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </span>
      <span class="error-text">{{ error }}</span>
      <button @click="retry" class="retry-btn">重试</button>
    </div>
    
    <!-- 阅读时间显示 -->
    <div v-else-if="readingTime" class="reading-time-container" :class="{ 'dark-theme': isDarkTheme }">
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
/* 阅读时间包装器 */
.reading-time-wrapper {
    width: 100%;
    margin: 10px 0;
}

/* 加载状态样式 */
.reading-time-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 16px;
    background-color: var(--card-bg);
    border: 2px solid var(--center-card-border-color);
    border-radius: 20px;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
}

.loading-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border-color);
    border-top-color: var(--accent-fg);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-text {
    font-size: 14px;
    color: var(--text-secondary);
}

/* 错误状态样式 */
.reading-time-error {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    background-color: var(--card-bg);
    border: 2px solid var(--error-color);
    border-radius: 20px;
}

.error-icon {
    width: 18px;
    height: 18px;
    color: var(--error-color);
    flex-shrink: 0;
}

.error-icon svg {
    width: 100%;
    height: 100%;
}

.error-text {
    font-size: 14px;
    color: var(--error-color);
}

.retry-btn {
    margin-left: 8px;
    padding: 4px 12px;
    background-color: var(--error-color);
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.retry-btn:hover {
    background-color: var(--accent-hover);
    transform: translateY(-1px);
}

/* 阅读时间预计样式 */
.reading-time-container {
    width: 100%;
    padding: 10px 15px;
    background-color: var(--card-bg);
    border: 2px solid var(--center-card-title-color);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 8px var(--shadow-color);
    transition: all 0.3s ease;
}

.reading-time-container.dark-theme {
    background-color: var(--card-bg);
    border-color: var(--center-card-border-color);
    box-shadow: 0 2px 8px var(--shadow-color);
}

/* 字数统计部分 */
.word-count-section {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.word-count-icon {
    width: 16px;
    height: 16px;
    fill: var(--center-card-title-color);
    flex-shrink: 0;
}

.word-count-text {
    font-size: 14px;
    color: var(--text-color);
    font-weight: 500;
}

.word-count-detail {
    font-size: 12px;
    color: var(--text-secondary);
}

/* 阅读时间部分 */
.reading-time-section {
    display: flex;
    align-items: center;
    gap: 8px;
}

.reading-time-icon {
    width: 16px;
    height: 16px;
    fill: var(--center-card-title-color);
    flex-shrink: 0;
}

.reading-time-text {
    font-size: 14px;
    color: var(--text-color);
    font-weight: 500;
}

/* 响应式样式 */
@media (max-width: 575.98px) {
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
    
    .reading-time-loading,
    .reading-time-error {
        padding: 8px 12px;
        border-radius: 16px;
    }
    
    .loading-text,
    .error-text {
        font-size: 12px;
    }
}

@media (min-width: 576px) and (max-width: 767.98px) {
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
    
    .reading-time-loading,
    .reading-time-error {
        padding: 9px 13px;
        border-radius: 18px;
    }
}

@media (min-width: 768px) {
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
