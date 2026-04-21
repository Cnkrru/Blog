<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useTocStore, useThemeStore } from '../../stores'

const props = defineProps({
  toc: {
    type: Array,
    default: () => []
  }
})

const tocStore = useTocStore()
const themeStore = useThemeStore()

const tocContentRef = ref(null)
const contentContainer = ref(null)

const show = computed(() => tocStore.show)
const activeId = computed(() => tocStore.activeId)
const isDarkTheme = computed(() => themeStore.isDark)
const toc = computed(() => props.toc)

// DOM 缓存 - 避免重复查询
const elementCache = new Map()
const hookCache = new Map()

const toggleToc = () => {
  tocStore.toggleToc()
}

// 缓存获取元素 - 避免重复 DOM 查询
const getCachedElement = (id) => {
  if (elementCache.has(id)) {
    return elementCache.get(id)
  }
  const element = document.getElementById(id)
  if (element) {
    elementCache.set(id, element)
  }
  return element
}

// 缓存获取钩子元素
const getCachedHook = (element) => {
  const elementId = element.id
  if (hookCache.has(elementId)) {
    return hookCache.get(elementId)
  }
  const hook = element.querySelector('.heading-hook')
  if (hook) {
    hookCache.set(elementId, hook)
  }
  return hook
}

const scrollToHeading = (id) => {
  tocStore.scrollToHeading(id)
}

// 找到中心内容容器
const findContentContainer = () => {
  const containers = [
    document.querySelector('.center-card-content'),
    document.querySelector('.post-content'),
    document.querySelector('.markdown-content')
  ]
  
  for (const container of containers) {
    if (container) {
      return container
    }
  }
  return null
}

// 为每个标题创建钩子元素
const createHeadingHooks = () => {
  props.toc.forEach(item => {
    // 使用缓存获取元素
    const element = getCachedElement(item.id)
    if (element) {
      // 确保每个标题都有一个唯一的钩子元素
      const hook = getCachedHook(element)
      if (!hook) {
        const newHook = document.createElement('div')
        newHook.className = 'heading-hook'
        newHook.style.position = 'absolute'
        newHook.style.top = '0'
        newHook.style.left = '0'
        newHook.style.width = '100%'
        newHook.style.height = '1px'
        newHook.style.pointerEvents = 'none'
        element.style.position = 'relative'
        element.insertBefore(newHook, element.firstChild)
        // 更新钩子缓存
        hookCache.set(element.id, newHook)
      }
    }
  })
}

// 检测当前所在位置
const detectCurrentPosition = () => {
  if (props.toc.length === 0) return
  
  // 找到内容容器
  if (!contentContainer.value) {
    contentContainer.value = findContentContainer()
  }
  
  // 确保钩子元素存在
  createHeadingHooks()
  
  let currentId = ''
  let closestDistance = Infinity
  
  // 遍历所有目录项，找到当前最接近视窗中心的标题钩子
  // 使用缓存的元素和钩子，避免重复 DOM 查询
  for (const item of props.toc) {
    const element = getCachedElement(item.id)
    if (element) {
      const hook = getCachedHook(element)
      if (hook) {
        const rect = hook.getBoundingClientRect()
        // 计算钩子到视窗中心的距离
        const distance = Math.abs(rect.top - window.innerHeight * 0.5)
        
        if (distance < closestDistance) {
          closestDistance = distance
          currentId = item.id
        }
      }
    }
  }
  
  if (currentId) {
    tocStore.setActiveId(currentId)
    // 滚动目录到当前活跃项
    scrollTocToActiveItem()
  }
}

// 滚动目录到当前活跃项
const scrollTocToActiveItem = () => {
  if (!tocContentRef.value) return
  
  const activeElement = tocContentRef.value.querySelector('.toc-item.active')
  if (activeElement) {
    const tocRect = tocContentRef.value.getBoundingClientRect()
    const activeRect = activeElement.getBoundingClientRect()
    
    // 计算活跃项相对于目录容器的位置
    const relativeTop = activeRect.top - tocRect.top
    
    // 滚动目录，使活跃项位于容器中间
    tocContentRef.value.scrollTop = tocContentRef.value.scrollTop + relativeTop - tocRect.height / 2
  }
}

// 监听滚动事件
const handleScroll = () => {
  // 使用requestAnimationFrame优化滚动性能
  requestAnimationFrame(detectCurrentPosition)
}

// 监听toc变化
watch(() => props.toc, () => {
  // 当目录数据变化时，更新store并重新创建钩子
  tocStore.setToc(props.toc)
  
  // 重新创建钩子并检测当前位置
  setTimeout(() => {
    createHeadingHooks()
    detectCurrentPosition()
  }, 100)
}, { deep: true })

// 监听show变化
watch(() => show.value, (newShow) => {
  if (newShow) {
    // 当目录显示时，重新检测当前位置
    setTimeout(detectCurrentPosition, 100)
  }
})

// 生命周期钩子
onMounted(() => {
  // 加载用户偏好
  tocStore.loadUserPreference()
  
  // 更新目录数据
  tocStore.setToc(props.toc)
  
  // 初始化时创建钩子并检测当前位置
  setTimeout(() => {
    createHeadingHooks()
    detectCurrentPosition()
  }, 100)
  
  // 找到内容容器
  contentContainer.value = findContentContainer()
  
  // 添加滚动事件监听器
  if (contentContainer.value) {
    contentContainer.value.addEventListener('scroll', handleScroll, { passive: true })
  }
  
  // 同时监听window滚动事件，确保在没有容器时也能工作
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // 同时监听resize事件，确保窗口大小变化时也能正确检测
  window.addEventListener('resize', detectCurrentPosition, { passive: true })
})

onUnmounted(() => {
  // 移除滚动事件监听器
  if (contentContainer.value) {
    contentContainer.value.removeEventListener('scroll', handleScroll)
  }
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', detectCurrentPosition)
  
  // 清空缓存
  elementCache.clear()
  hookCache.clear()
  
  // 重置store
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
        <li v-if="toc.length === 0" class="toc-item empty">
          <span class="empty-text">暂无目录</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* 目录卡片 */
.toc-card {
    position: fixed;
    top: 50%;
    right: 0;
    transform: translate(100%, -50%);
    width: 280px;
    max-height: 70vh;
    background-color: var(--card-bg);
    border: 2px solid var(--center-card-border-color);
    border-right: none;
    border-radius: 12px 0 0 12px;
    box-shadow: -4px 4px 12px var(--shadow-color);
    z-index: 999;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.toc-card.active {
    transform: translate(0, -50%);
    box-shadow: -6px 6px 20px var(--shadow-color);
}

.toc-card.dark-theme {
    box-shadow: -4px 4px 12px rgba(0, 0, 0, 0.3);
}

.toc-card.active.dark-theme {
    box-shadow: -6px 6px 20px rgba(0, 0, 0, 0.4);
}

/* 目录卡片头部 */
.toc-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--hover-bg);
}

.toc-card-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    color: var(--center-card-title-color);
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
    color: var(--text-muted);
    background-color: var(--card-bg);
    padding: 2px 8px;
    border-radius: 10px;
    border: 1px solid var(--border-color);
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
    color: var(--text-color);
}

.toc-close-btn:hover {
    background-color: var(--hover-bg);
    transform: rotate(90deg);
}

/* 目录卡片内容 */
.toc-card-content {
    padding: 15px 20px;
    max-height: calc(70vh - 60px);
    overflow-y: auto;
    background-color: var(--card-bg);
}

/* 目录列表 */
.toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

/* 目录项 */
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
    color: var(--text-color);
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.3s ease;
    font-size: 14px;
    line-height: 1.5;
    position: relative;
    overflow: hidden;
}

.toc-item a:hover {
    background-color: var(--hover-bg);
    color: var(--accent-fg);
    transform: translateX(4px);
}

/* 高亮样式 - 适配主题 */
.toc-item.active a {
    background-color: var(--accent-fg);
    color: pink;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.toc-card.dark-theme .toc-item.active a {
    background-color: var(--accent-fg);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.toc-item.active a:hover {
    background-color: var(--accent-hover);
    transform: translateX(0);
}

/* 目录项编号 */
.toc-item-number {
    margin-right: 8px;
    font-size: 12px;
    font-weight: bold;
    color: var(--text-muted);
    min-width: 30px;
    text-align: right;
}

.toc-item.active .toc-item-number {
    color: rgba(255, 255, 255, 0.8);
}

/* 目录项文本 */
.toc-item-text {
    flex: 1;
    word-break: break-word;
}

/* 空目录项 */
.toc-item.empty {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-muted);
    font-style: italic;
}

.empty-text {
    font-size: 14px;
}

/* H1 级别的目录项 */
.toc-item.level-1 a {
    font-weight: bold;
    font-size: 15px;
}

/* H2 级别的目录项 */
.toc-item.level-2 a {
    padding-left: 24px;
    font-size: 14px;
}

/* H3 级别的目录项 */
.toc-item.level-3 a {
    padding-left: 36px;
    font-size: 13px;
    opacity: 0.9;
}

/* 段落级别的目录项 */
.toc-item.level-p a {
    padding-left: 48px;
    font-size: 12px;
    opacity: 0.7;
}

/* 目录滚动条 */
.toc-card-content::-webkit-scrollbar {
    width: 6px;
}

.toc-card-content::-webkit-scrollbar-track {
    background: transparent;
}

.toc-card-content::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 3px;
    transition: all 0.3s ease;
}

.toc-card-content::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover);
}

/* 响应式设计 */
@media (max-width: 768px) {
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

@media (max-width: 480px) {
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

/* 动画效果 */
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