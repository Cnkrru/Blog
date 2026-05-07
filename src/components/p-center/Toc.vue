<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { useTocStore, useThemeStore } from '../../stores'

const props = defineProps<{ show?: boolean }>()

const emit = defineEmits<{ 'update:show': [show: boolean] }>()

const tocStore = useTocStore()
const themeStore = useThemeStore()

const tocContentRef = ref(null)
const toc = ref([])
const activeId = ref('')
const isDarkTheme = computed(() => themeStore.isDark)

// 生成标题编号
const generateHeadingNumber = (index, level, counters) => {
  counters[level] = (counters[level] || 0) + 1
  
  for (let i = level + 1; i <= 6; i++) {
    counters[i] = 0
  }
  
  let number = ''
  for (let i = 1; i <= level; i++) {
    if (counters[i]) {
      number += counters[i] + '.'
    }
  }
  return number.slice(0, -1)
}

// 查找页面中的标题并生成目录
const scanAndProcessHeadings = () => {
  const containers = [
    document.querySelector('.center-card-content'),
    document.querySelector('.post-content'),
    document.querySelector('.markdown-content')
  ]
  
  let contentContainer = null
  for (const container of containers) {
    if (container) {
      contentContainer = container
      break
    }
  }
  
  if (!contentContainer) return
  
  // 查找所有标题元素
  const headings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const newToc = []
  const counters = {}
  
  headings.forEach((heading, index) => {
    // 获取标题等级（从h1的1开始）
    const level = parseInt(heading.tagName.substring(1))
    const text = heading.textContent.trim()
    
    // 生成唯一ID
    const id = `toc-heading-${index}`
    
    // 为标题添加ID属性（锚点）
    heading.id = id
    
    // 生成编号
    const numbering = generateHeadingNumber(index, level, counters)
    
    // 添加到目录
    newToc.push({
      id,
      level,
      text,
      numbering
    })
  })
  
  toc.value = newToc
  
  // 通知store
  tocStore.setToc(newToc)
}

// 滚动到标题
const scrollToHeading = (id) => {
  const element = document.getElementById(id)
  if (!element) return
  
  const scrollContainers = [
    document.querySelector('.center-card-content'),
    document.querySelector('.post-content'),
    document.querySelector('.markdown-content')
  ]
  
  let container = null
  for (const potentialContainer of scrollContainers) {
    if (potentialContainer && potentialContainer.contains(element)) {
      container = potentialContainer
      break
    }
  }
  
  if (container) {
    const rect = element.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const relativeTop = rect.top - containerRect.top
    
    container.scrollTo({
      top: container.scrollTop + relativeTop - 20,
      behavior: 'smooth'
    })
  } else {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// 检测当前位置并更新活跃状态
const detectCurrentPosition = () => {
  if (toc.value.length === 0) return
  
  const containers = [
    document.querySelector('.center-card-content'),
    document.querySelector('.post-content'),
    document.querySelector('.markdown-content')
  ]
  
  let contentContainer = null
  for (const container of containers) {
    if (container) {
      contentContainer = container
      break
    }
  }
  
  if (!contentContainer) return
  
  let currentId = ''
  let closestDistance = Infinity
  
  for (const item of toc.value) {
    const element = document.getElementById(item.id)
    if (element) {
      const rect = element.getBoundingClientRect()
      const distance = Math.abs(rect.top - window.innerHeight * 0.3)
      
      if (distance < closestDistance) {
        closestDistance = distance
        currentId = item.id
      }
    }
  }
  
  if (currentId && currentId !== activeId.value) {
    activeId.value = currentId
    tocStore.setActiveId(currentId)
    scrollTocToActiveItem()
  }
}

// 滚动目录以保持活跃项可见
const scrollTocToActiveItem = () => {
  if (!tocContentRef.value) return
  
  const activeElement = tocContentRef.value.querySelector('.toc-item.active')
  if (activeElement) {
    const tocRect = tocContentRef.value.getBoundingClientRect()
    const activeRect = activeElement.getBoundingClientRect()
    
    const relativeTop = activeRect.top - tocRect.top
    
    tocContentRef.value.scrollTop = tocContentRef.value.scrollTop + relativeTop - tocRect.height / 2
  }
}

const toggleToc = () => {
  emit('update:show', !props.show)
  tocStore.toggleToc()
}

// 事件监听
let scrollListener = null
let resizeListener = null

watch(() => props.show, (newShow) => {
  if (newShow) {
    nextTick(() => {
      scanAndProcessHeadings()
      setTimeout(detectCurrentPosition, 100)
    })
  }
})

onMounted(() => {
  tocStore.loadUserPreference()
  
  // 延迟一点扫描，确保DOM渲染完成
  setTimeout(() => {
    scanAndProcessHeadings()
  }, 300)
  
  // 监听滚动和调整大小
  scrollListener = () => {
    requestAnimationFrame(detectCurrentPosition)
  }
  
  resizeListener = detectCurrentPosition
  
  window.addEventListener('scroll', scrollListener, { passive: true })
  window.addEventListener('resize', resizeListener, { passive: true })
  
  // 同时也监听内容区域的滚动
  const containers = [
    document.querySelector('.center-card-content'),
    document.querySelector('.post-content'),
    document.querySelector('.markdown-content')
  ]
  
  for (const container of containers) {
    if (container) {
      container.addEventListener('scroll', scrollListener, { passive: true })
      break
    }
  }
})

onUnmounted(() => {
  if (scrollListener) {
    window.removeEventListener('scroll', scrollListener)
    
    const containers = [
      document.querySelector('.center-card-content'),
      document.querySelector('.post-content'),
      document.querySelector('.markdown-content')
    ]
    
    for (const container of containers) {
      if (container) {
        container.removeEventListener('scroll', scrollListener)
        break
      }
    }
  }
  
  if (resizeListener) {
    window.removeEventListener('resize', resizeListener)
  }
  
  tocStore.reset()
})
</script>

<template>
  <div class="toc-card" :class="{ active: show, 'dark-theme': isDarkTheme }">
    <div class="toc-card-header">
      <h3>文章目录</h3>
      <div class="header-actions">
        <span v-if="toc.length > 0" class="toc-item-count">{{ toc.length }} 项</span>
        <button class="toc-close-btn" @click="toggleToc">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="toc-card-content" ref="tocContentRef">
      <ul class="toc-list">
        <li v-for="item in toc" :key="item.id" class="toc-item" :class="[`level-${item.level}`, { active: activeId === item.id }]">
          <a href="#" @click.prevent="scrollToHeading(item.id)" :title="`跳转到: ${item.text}`">
            <span class="toc-item-number">{{ item.numbering }}</span>
            <span class="toc-item-text">{{ item.text }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.toc-card {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translate(100%, -50%);
  width: 280px;
  max-height: 70vh;
  border-right: none;
  border-radius: 12px 0 0 12px;
  z-index: 999;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.toc-card.active {
  transform: translate(0, -50%);
}

.toc-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
}

.toc-card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toc-item-count {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.toc-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.toc-close-btn:hover {
  transform: rotate(90deg);
}

.toc-card-content {
  padding: 15px 20px;
  max-height: calc(70vh - 60px);
  overflow-y: auto;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin-bottom: 8px;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.toc-item a {
  display: flex;
  align-items: flex-start;
  padding: 8px 12px;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 14px;
  line-height: 1.5;
  position: relative;
  overflow: hidden;
}

.toc-item a:hover {
  transform: translateX(4px);
}

.toc-item.active a {
  font-weight: bold;
}

.toc-item.active a:hover {
  transform: translateX(0);
}

.toc-item-number {
  margin-right: 8px;
  font-size: 12px;
  font-weight: bold;
  min-width: 30px;
  text-align: right;
}

.toc-item-text {
  flex: 1;
  word-break: break-word;
}

.toc-item.level-1 a {
  font-weight: bold;
  font-size: 15px;
}

.toc-item.level-2 a {
  padding-left: 24px;
  font-size: 14px;
}

.toc-item.level-3 a {
  padding-left: 36px;
  font-size: 13px;
  opacity: 0.9;
}

.toc-item.level-p a {
  padding-left: 48px;
  font-size: 12px;
  opacity: 0.7;
}

@keyframes tocSlideIn {
  from {
    transform: translate(100%, -50%);
    opacity: 0;
  }
  to {
    transform: translate(0, -50%);
    opacity: 1;
  }
}

@keyframes tocSlideOut {
  from {
    transform: translate(0, -50%);
    opacity: 1;
  }
  to {
    transform: translate(100%, -50%);
    opacity: 0;
  }
}

.toc-card.active {
  animation: tocSlideIn 0.3s ease forwards;
}

.toc-card:not(.active) {
  animation: tocSlideOut 0.3s ease forwards;
}
</style>

<style scoped>
.toc-card {
  background-color: var(--common-bg);
  border: 2px solid var(--common-color-1);
  box-shadow: -4px 4px 12px var(--common-shadow);
}

.toc-card.active {
  box-shadow: -6px 6px 20px var(--common-shadow);
}

.toc-card-header {
  border-bottom: 1px solid var(--common-color-1);
  background-color: var(--common-bg);
}

.toc-card-header h3 {
  color: var(--common-text);
}

.toc-item-count {
  color: var(--common-text);
  border: 1px solid var(--common-color-1);
}

.toc-close-btn {
  color: var(--common-text);
}

.toc-close-btn:hover {
  background-color: var(--common-bg);
}

.toc-card-content {
  background-color: var(--common-bg);
}

.toc-item a {
  color: var(--common-text);
}

.toc-item a:hover {
  background-color: var(--common-bg);
  color: var(--common-text);
}

.toc-item.active a {
  background-color: var(--common-bg);
  color: pink;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.toc-item.active a:hover {
  background-color: var(--common-bg);
}

.toc-item-number {
  color: var(--common-text);
}

.toc-item.active .toc-item-number {
  color: rgba(255, 255, 255, 0.8);
}
</style>

<style scoped>
@media (max-width: var(--md)) {
  .toc-card {
    width: 240px;
    max-height: 60vh;
  }
  
  .toc-card-header {
    padding: 12px 16px;
  }
  
  .toc-card-header h3 {
    font-size: 14px;
  }
  
  .toc-card-content {
    padding: 12px 16px;
    max-height: calc(60vh - 50px);
  }
  
  .toc-item a {
    padding: 6px 10px;
    font-size: 13px;
  }
  
  .toc-item-number {
    font-size: 11px;
    min-width: 25px;
  }
  
  .toc-item.level-1 a {
    font-size: 14px;
  }
  
  .toc-item.level-2 a {
    padding-left: 20px;
    font-size: 13px;
  }
  
  .toc-item.level-3 a {
    padding-left: 30px;
    font-size: 12px;
  }
  
  .toc-item.level-p a {
    padding-left: 40px;
    font-size: 11px;
  }
  
  .toc-item-count {
    font-size: 10px;
    padding: 1px 6px;
  }
}

@media (max-width: var(--sm)) {
  .toc-card {
    width: 220px;
    max-height: 50vh;
  }
  
  .toc-card-header {
    padding: 10px 14px;
  }
  
  .toc-card-header h3 {
    font-size: 13px;
  }
  
  .toc-card-content {
    padding: 10px 14px;
    max-height: calc(50vh - 45px);
  }
  
  .toc-item a {
    padding: 5px 8px;
    font-size: 12px;
  }
  
  .toc-item-number {
    font-size: 10px;
    min-width: 20px;
    margin-right: 6px;
  }
  
  .toc-item.level-2 a {
    padding-left: 16px;
  }
  
  .toc-item.level-3 a {
    padding-left: 24px;
  }
  
  .toc-item.level-p a {
    padding-left: 32px;
  }
}
</style>
