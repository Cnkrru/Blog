<script setup>
import { ref, onMounted, watch } from 'vue'

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

const readingTime = ref(null)
const isLoaded = ref(false)

const calculateReadingTime = () => {
  // 获取文章内容区域
  const selectors = props.contentSelector.split(', ')
  let articleContent = null
  
  for (const selector of selectors) {
    articleContent = document.querySelector(selector)
    if (articleContent) break
  }
  
  if (!articleContent) {
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

const initReadingTime = () => {
  // 延迟执行，确保文章内容已加载
  setTimeout(() => {
    const timeData = calculateReadingTime()
    readingTime.value = timeData
    isLoaded.value = true
  }, 100)
}

onMounted(() => {
  initReadingTime()
})
</script>

<template>
  <div v-if="readingTime" class="reading-time-container">
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
</template>

<style scoped>
/* 阅读时间预计样式 */
.reading-time-container {
    width: 100%;
    padding: 10px 15px;
    margin: 10px 0;
    background-color: var(--card-bg);
    border: 2px solid var(--center-card-title-color);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 8px var(--shadow-color);
    transition: all 0.3s ease;
}

/* 字数统计部分 */
.word-count-section {
    display: flex;
    align-items: center;
    gap: 8px;
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
        gap: 6px;
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

@media (min-width: 576px) and (max-width: 767.98px) {
    .reading-time-container {
        padding: 9px 13px;
        margin: 9px 0;
        border-radius: 18px;
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

@media (min-width: 768px) {
    .reading-time-container {
        padding: 10px 15px;
        margin: 10px 0;
        border-radius: 20px;
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
