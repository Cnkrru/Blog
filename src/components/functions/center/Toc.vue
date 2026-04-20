<script setup>
import { ref, defineProps, defineEmits, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  toc: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:show'])
const activeId = ref('')
const tocContentRef = ref(null)
const contentContainer = ref(null)

// DOM 缓存 - 避免重复查询
const elementCache = new Map()
const hookCache = new Map()

const toggleToc = () => {
  emit('update:show', !props.show)
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
  // 使用缓存获取元素
  let element = getCachedElement(id)
  
  if (!element) {
    // 如果通过ID找不到元素，尝试通过标题文本查找
    return
  }
  
  // 尝试找到中心内容卡片作为滚动容器
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
    // 计算元素相对于容器的位置
    const rect = element.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const relativeTop = rect.top - containerRect.top
    
    // 在容器内滚动
    container.scrollTo({
      top: container.scrollTop + relativeTop - 20, // 减去20像素的偏移，让标题显示在顶部
      behavior: 'smooth'
    })
  } else {
    // 如果没有找到合适的容器，直接滚动到元素
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
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
  
  if (currentId && currentId !== activeId.value) {
    activeId.value = currentId
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
  // 当目录数据变化时，重新创建钩子并检测当前位置
  setTimeout(() => {
    createHeadingHooks()
    detectCurrentPosition()
  }, 100)
}, { deep: true })

// 监听show变化
watch(() => props.show, (newShow) => {
  if (newShow) {
    // 当目录显示时，重新检测当前位置
    setTimeout(detectCurrentPosition, 100)
  }
})

// 生命周期钩子
onMounted(() => {
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
})
</script>

<template>
  <div class="toc-card" :class="{ active: show }">
    <div class="toc-card-header">
      <h3>文章目录</h3>
      <button class="toc-close-btn" @click="toggleToc">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </div>
    <div class="toc-card-content" ref="tocContentRef">
      <ul class="toc-list">
        <li v-for="item in toc" :key="item.id" class="toc-item" :class="[`level-${item.level}`, { active: activeId === item.id }]">
          <a href="#" @click.prevent="scrollToHeading(item.id)">{{ item.numbering }} {{ item.text }}</a>
        </li>
        <li v-if="toc.length === 0" class="toc-item">
          <span>暂无目录</span>
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
    transition: transform 0.3s ease;
}

.toc-card.active {
    transform: translate(0, -50%);
}

/* 目录卡片头部 */
.toc-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    border-bottom: 1px solid var(--border-color);
}

.toc-card-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    color: var(--center-card-title-color);
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
}

/* 目录卡片内容 */
.toc-card-content {
    padding: 15px 20px;
    max-height: calc(70vh - 60px);
    overflow-y: auto;
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
}

.toc-item a {
    display: block;
    padding: 8px 12px;
    color: var(--text-color);
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.3s ease;
    font-size: 14px;
    line-height: 1.5;
}

.toc-item a:hover {
    background-color: var(--hover-bg);
    color: var(--accent-fg);
}

.toc-item.active a {
    background-color: var(--button-bg);
    color: var(--button-text);
    font-weight: bold;
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
}

.toc-card-content::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover);
}

/*==============================响应式设计媒体查询==============================*/
/* 超小屏手机 (＜576px) */
@media (max-width: 575.98px) {
    /* 调整目录卡片 */
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
}

/* 小屏手机横屏及以上 (≥576px) */
@media (min-width: 576px) {
    /* 调整目录卡片 */
    .toc-card {
        width: 260px;
        max-height: 65vh;
    }
    
    .toc-card-header {
        padding: 13px 18px;
    }
    
    .toc-card-header h3 {
        font-size: 15px;
    }
    
    .toc-card-content {
        padding: 13px 18px;
        max-height: calc(65vh - 55px);
    }
    
    .toc-item a {
        padding: 7px 11px;
        font-size: 13.5px;
    }
    
    .toc-item.level-1 a {
        font-size: 14.5px;
    }
    
    .toc-item.level-2 a {
        padding-left: 22px;
        font-size: 13.5px;
    }
    
    .toc-item.level-3 a {
        padding-left: 33px;
        font-size: 12.5px;
    }
    
    .toc-item.level-p a {
        padding-left: 44px;
        font-size: 11.5px;
    }
}

/* 平板及以上 (≥768px) */
@media (min-width: 768px) {
    /* 恢复桌面布局 */
    /* 调整目录卡片 */
    .toc-card {
        width: 280px;
        max-height: 70vh;
    }
    
    .toc-card-header {
        padding: 15px 20px;
    }
    
    .toc-card-header h3 {
        font-size: 16px;
    }
    
    .toc-card-content {
        padding: 15px 20px;
        max-height: calc(70vh - 60px);
    }
    
    .toc-item a {
        padding: 8px 12px;
        font-size: 14px;
    }
    
    .toc-item.level-1 a {
        font-size: 15px;
    }
    
    .toc-item.level-2 a {
        padding-left: 24px;
        font-size: 14px;
    }
    
    .toc-item.level-3 a {
        padding-left: 36px;
        font-size: 13px;
    }
    
    .toc-item.level-p a {
        padding-left: 48px;
        font-size: 12px;
    }
}

/* 桌面及以上 (≥1024px) */
@media (min-width: 1024px) {
    /* 标准桌面布局 */
    /* 调整目录卡片 */
    .toc-card {
        width: 300px;
    }
}

/* 大屏桌面及以上 (≥1200px) */
@media (min-width: 1200px) {
    /* 宽屏布局 */
    /* 调整目录卡片 */
    .toc-card {
        width: 320px;
    }
}

/* 超大屏及以上 (≥1440px) */
@media (min-width: 1440px) {
    /* 超大屏优化 */
    /* 调整目录卡片 */
    .toc-card {
        width: 340px;
    }
}
</style>
