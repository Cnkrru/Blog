<template>
  <div>
    <!-- 构建期预渲染的静态 HTML（SSR 直接输出全部内容，利于 SEO） -->
    <div ref="contentRef" class="markdown-content" v-html="html"></div>
    <!-- 自定义灯箱（Teleport 到 body）-->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="showLightbox"
          class="lightbox-overlay"
          @click="closeLightbox"
          @keydown="onLightboxKeydown"
          tabindex="-1"
          ref="lightboxRef"
        >
          <!-- 关闭按钮 — 固定在右上角 -->
          <VButton class="v-btn-round v-btn-ghost lightbox-close" style="height:40px;min-width:40px" @click="closeLightbox" aria-label="关闭"><VIcon :src="'x.svg'" :size="22" /></VButton>

          <!-- 图片计数器 — 顶部居中 pill -->
          <div class="lightbox-counter" v-if="lightboxImages.length > 1">
            {{ currentImageIndex + 1 }} / {{ lightboxImages.length }}
          </div>

          <!-- 左侧导航箭头 -->
          <div
            class="lightbox-nav lightbox-prev"
            @click="prevImage"
            @click.stop
            v-if="currentImageIndex > 0"
            aria-label="上一张"
          >
            <VIcon :src="'arrow-left.svg'" :size="28" />
          </div>

          <!-- 图片主体 — 点击图片不关闭 -->
          <div class="lightbox-area" @click.stop>
            <img
              :src="lightboxImages[currentImageIndex].src"
              :alt="lightboxImages[currentImageIndex].title"
              :key="currentImageIndex"
              class="lightbox-img"
            >
            <div class="lightbox-title" v-if="lightboxImages[currentImageIndex].title">
              {{ lightboxImages[currentImageIndex].title }}
            </div>
          </div>

          <!-- 右侧导航箭头 -->
          <div
            class="lightbox-nav lightbox-next"
            @click="nextImage"
            @click.stop
            v-if="currentImageIndex < lightboxImages.length - 1"
            aria-label="下一张"
          >
            <VIcon :src="'arrow-right.svg'" :size="28" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>

  <!-- 选中文字引用弹出 -->
  <Teleport to="body">
    <div
      v-if="showQuotePopup"
      class="quote-popup"
      :style="{ left: quotePopupPos.x + 'px', top: quotePopupPos.y + 'px' }"
      @click.stop
    >
      <VButton v-if="!quoteCopied" class="v-btn-ghost quote-btn" style="border-radius:6px" @click="copyQuote"><VIcon :src="'copy.svg'" :size="14" />引用</VButton>
      <span v-else class="quote-done">已复制</span>
    </div>
  </Teleport>
</template>

<script setup>
import VIcon from '@/components/__common/VIcon.vue'
import VButton from '@/components/__common/VButton.vue'
import { ref, onMounted, onUnmounted, watch, nextTick, computed, getCurrentInstance, createApp, h } from 'vue'
import { useRoute } from 'vue-router'
import { useNotificationStore } from '../../stores'
import MermaidRender from './MermaidRender.vue'
import KatexRender from './KatexRender.vue'
import HighlightRender from './HighlightRender.vue'
import EasterEggAnimation from '../media/EasterEggAnimation.vue'
import AdmonitionRender from './AdmonitionRender.vue'
import ToastButton from './ToastButton.vue'
import CsvTable from './CsvTable.vue'
import JsonView from './JsonView.vue'
import YamlView from './YamlView.vue'
import TomlView from './TomlView.vue'

const props = defineProps(['html'])

const route = useRoute()
const notificationStore = useNotificationStore()
const postId = computed(() => route.params.id || '')

const contentRef = ref(null)
const showLightbox = ref(false)
const currentImageIndex = ref(0)
const lightboxImages = ref([])

// ── 特殊块运行时激活 ──
// 静态 HTML 已含全部内容（SEO 友好），挂载后把 .special-block 占位增强为交互组件
const instance = getCurrentInstance()
const mountedApps = []

const getSpecialComponent = (blockType, language) => {
  const lang = (language || '').toLowerCase()
  // 代码类：data-block="code" 或 data-block="json/yaml/toml/csv" 都按语言路由到对应视图
  if (blockType === 'code' || ['json', 'yaml', 'toml', 'csv'].includes(blockType)) {
    if (lang === 'json') return JsonView
    if (lang === 'yaml') return YamlView
    if (lang === 'toml') return TomlView
    if (lang === 'csv') return CsvTable
    return HighlightRender
  }
  const map = {
    mermaid: MermaidRender,
    math: KatexRender,
    admonition: AdmonitionRender,
    toast: ToastButton,
    'easter-egg': EasterEggAnimation
  }
  return map[blockType] || null
}

const parseSpecialBlock = (el) => {
  const blockType = el.dataset.block
  let blockProps = {}
  switch (blockType) {
    case 'code':
      blockProps = { code: el.dataset.code, language: el.dataset.lang }
      break
    case 'json':
    case 'yaml':
    case 'toml':
    case 'csv':
      blockProps = { code: el.dataset.code, language: blockType }
      break
    case 'mermaid':
      blockProps = { code: el.dataset.code }
      break
    case 'math':
      blockProps = { latex: el.dataset.latex }
      break
    case 'admonition': {
      const body = el.querySelector('.admonition-body')
      blockProps = { type: el.dataset.type, title: el.dataset.title, content: body ? body.innerHTML : '' }
      break
    }
    case 'toast':
      blockProps = { type: el.dataset.type, text: el.dataset.text }
      break
    case 'easter-egg':
      blockProps = { text: el.dataset.text, finalText: el.dataset.final }
      break
    default:
      return null
  }
  const component = getSpecialComponent(blockType, blockProps.language)
  return component ? { component, blockProps } : null
}

const unmountAll = () => {
  mountedApps.forEach(app => { try { app.unmount() } catch (e) {} })
  mountedApps.length = 0
}

const activateSpecialBlocks = () => {
  if (typeof document === 'undefined') return
  const container = contentRef.value
  if (!container) return
  container.querySelectorAll('.special-block').forEach(el => {
    const block = parseSpecialBlock(el)
    if (!block) return
    const app = createApp({ render: () => h(block.component, block.blockProps) })
    app._context = instance.appContext
    app.mount(el)
    mountedApps.push(app)
  })
}

// 存储图片点击监听器引用，用于清理
const imageClickHandlers = new WeakMap()

// 添加图片点击事件
const addImageClickListeners = () => {
  // 延迟一点执行，确保DOM已经更新
  setTimeout(() => {
    const contentImages = document.querySelectorAll('.markdown-content img, .post-content img, .markdown-image')
    const imageData = []

    contentImages.forEach((image, index) => {
      const src = image.src
      const alt = image.alt || ''

      imageData.push({ src, title: alt })

      image.style.cursor = 'pointer'

      // 移除旧的监听器（WeakMap 中保存的引用）
      const oldHandler = imageClickHandlers.get(image)
      if (oldHandler) {
        image.removeEventListener('click', oldHandler)
      }

      // 创建新监听器并保存引用
      const handler = () => { openLightbox(index) }
      imageClickHandlers.set(image, handler)
      image.addEventListener('click', handler)
    })

    lightboxImages.value = imageData
  }, 100)
}

// 为标题生成 id，支持中文锚点跳转
const generateHeadingId = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const addHeadingIds = () => {
  setTimeout(() => {
    const idCount = new Map()
    const headings = document.querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6')
    headings.forEach((h) => {
      const text = h.textContent?.trim() || ''
      if (text && !h.id) {
        let baseId = generateHeadingId(text)
        const count = idCount.get(baseId) || 0
        idCount.set(baseId, count + 1)
        h.id = count > 0 ? `${baseId}-${count}` : baseId
      }
    })
  }, 100)
}

// 存储事件监听器引用，用于组件卸载时清理
const anchorContainers = []

// 拦截锚点链接点击，使用 scroll API 滚动（与 Toc.vue 一致）
const handleAnchorClick = (e) => {
  const target = e.target
  const anchor = target.closest('a[href^="#"]')
  if (!anchor) return

  const href = anchor.getAttribute('href')
  if (!href || href === '#') return

  const id = href.slice(1)
  const el = document.getElementById(id)
  if (!el) return

  e.preventDefault()

  const scrollContainer = document.querySelector('.center-card-content')
  if (scrollContainer && scrollContainer.contains(el)) {
    const rect = el.getBoundingClientRect()
    const cr = scrollContainer.getBoundingClientRect()
    scrollContainer.scrollTo({
      top: scrollContainer.scrollTop + rect.top - cr.top - 20,
      behavior: 'smooth'
    })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const addAnchorClickInterceptors = () => {
  setTimeout(() => {
    const containers = document.querySelectorAll('.markdown-content')
    containers.forEach((container) => {
      container.addEventListener('click', handleAnchorClick)
      anchorContainers.push(container)
    })
  }, 200)
}

// 选中文字引用功能
const showQuotePopup = ref(false)
const quotePopupPos = ref({ x: 0, y: 0 })
const selectedText = ref('')
const quoteCopied = ref(false)

function handleTextSelection(e) {
  // 确保点击在 markdown 内容区域
  const target = e.target
  if (!target.closest('.markdown-content')) {
    setTimeout(() => { showQuotePopup.value = false }, 200)
    return
  }

  // 延迟获取选择，确保浏览器已完成选择
  setTimeout(() => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      showQuotePopup.value = false
      return
    }
    const text = sel.toString().trim()
    if (text.length < 5) {
      showQuotePopup.value = false
      return
    }
    selectedText.value = text
    quotePopupPos.value = {
      x: e.clientX,
      y: e.clientY - 10
    }
    showQuotePopup.value = true
    quoteCopied.value = false
  }, 10)
}

function copyQuote() {
  const source = postId.value
    ? `https://cnkrru.top/post/${postId.value}`
    : 'https://cnkrru.top'
  const quote = `> ${selectedText.value}\n>\n> — From: ${source}`
  navigator.clipboard.writeText(quote).then(() => {
    quoteCopied.value = true
    notificationStore.addNotification('引用已复制到剪贴板', { type: 'success', duration: 2000 })
    setTimeout(() => {
      showQuotePopup.value = false
      quoteCopied.value = false
    }, 1500)
  }).catch(() => {
    // 降级
    const ta = document.createElement('textarea')
    ta.value = quote
    ta.style.cssText = 'position:fixed;left:-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    quoteCopied.value = true
    notificationStore.addNotification('引用已复制到剪贴板', { type: 'success', duration: 2000 })
    setTimeout(() => {
      showQuotePopup.value = false
      quoteCopied.value = false
    }, 1500)
  })
}

function closeQuotePopup() {
  showQuotePopup.value = false
  quoteCopied.value = false
}

// 灯箱操作
const openLightbox = (index) => {
  currentImageIndex.value = index
  showLightbox.value = true
  document.body.style.overflow = 'hidden'
  // 聚焦到 overlay 以接收键盘事件
  nextTick(() => {
    const overlay = document.querySelector('.lightbox-overlay')
    if (overlay) overlay.focus()
  })
}

const closeLightbox = () => {
  showLightbox.value = false
  document.body.style.overflow = ''
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const nextImage = () => {
  if (currentImageIndex.value < lightboxImages.value.length - 1) {
    currentImageIndex.value++
  }
}

const onLightboxKeydown = (e) => {
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'ArrowRight') nextImage()
}

// 挂载后增强静态 HTML：激活特殊块 + 图片灯箱 + 标题锚点 + 锚点滚动
const enhance = () => {
  nextTick(() => {
    activateSpecialBlocks()
    addImageClickListeners()
    addHeadingIds()
    addAnchorClickInterceptors()
  })
}

onMounted(() => {
  enhance()
  // 监听文本选择
  document.addEventListener('mouseup', handleTextSelection)
})

watch(() => props.html, () => {
  unmountAll()
  enhance()
})

onUnmounted(() => {
  unmountAll()
  document.removeEventListener('mouseup', handleTextSelection)
  anchorContainers.forEach(c => c.removeEventListener('click', handleAnchorClick))
  anchorContainers.length = 0
})
</script>

<style>
/* 引用弹出气泡 */
.quote-popup {
  position: fixed;
  transform: translate(-50%, -100%);
  z-index: 5000;
  padding: 4px 6px;
  border-radius: 8px;
  background: var(--common-bg);
  border: 1px solid var(--common-color-1);
  box-shadow: 0 4px 16px var(--common-shadow);
  animation: quoteFadeIn 0.15s ease;
}

.quote-btn {
  gap: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.15s ease;
  --v-btn-pad: 6px 12px;
  --v-btn-bg: var(--common-color-1);
  --v-btn-hover-bg: var(--common-hover);
  --v-btn-color: var(--common-content);
}

.quote-done {
  font-size: 12px;
  color: var(--color-success);
  padding: 6px 12px;
  font-weight: 600;
}

/* 确保Markdown内容可见 */
.markdown-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: var(--article-font-size, 16px);
  line-height: 1.75;
  word-wrap: break-word;
  overflow-wrap: break-word;
  padding: 1rem;
}

/* 标题样式 */
.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-content h1 {
  font-size: 2rem;
  padding-bottom: 0.3rem;
}

.markdown-content h2 {
  font-size: 1.5rem;
  padding-bottom: 0.3rem;
}

.markdown-content h3 {
  font-size: 1.25rem;
}

/* 段落样式 */
.markdown-content p {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

/* 列表样式 */
.markdown-content ul,
.markdown-content ol {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.markdown-content li {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

/* 代码样式 */
.markdown-content code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  font-size: 0.875rem;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
}

.markdown-content pre {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 14px 16px;
  border-radius: 10px;
  overflow-x: auto;
  background: color-mix(in srgb, var(--common-bg, #fff) 45%, transparent);
  border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
}

.markdown-content pre code {
  padding: 0;
}

/* 引用样式 */
.markdown-content blockquote {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
}

/* 图片样式 */
.markdown-content img {
  max-width: 100%;
  height: auto;
  border-radius: 3px;
  margin: 1rem 0;
  display: block;
}

/* 链接样式 */
.markdown-content a {
  text-decoration: none;
}

.markdown-content a:hover {
  text-decoration: underline;
}

/* 表格样式 */
.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.markdown-content th,
.markdown-content td {
  padding: 0.75rem;
  text-align: left;
}

.markdown-content th {
  font-weight: 600;
}

/* 分隔线样式 */
.markdown-content hr {
  margin: 2rem 0;
  border: 0;
}

/* 灯箱样式 */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  outline: none;
}

/* 关闭按钮 — 右上角固定 */
.lightbox-close {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1010;
}

.lightbox-close:hover {
  transform: scale(1.1);
}

/* 图片计数器 — 顶部居中 pill 标签 */
.lightbox-counter {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1010;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  pointer-events: none;
}

/* 图片主体区域 */
.lightbox-area {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90vw;
  max-height: 85vh;
}

.lightbox-img {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  display: block;
  border-radius: 8px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

.lightbox-title {
  margin-top: 12px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  max-width: 80vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 导航箭头按钮 */
.lightbox-nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1010;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, transform 0.2s, opacity 0.2s;
  opacity: var(--lightbox-nav-opacity, 0);
}

.lightbox-overlay:hover {
  --lightbox-nav-opacity: 1;
}

.lightbox-prev {
  left: 20px;
}

.lightbox-next {
  right: 20px;
}

.lightbox-nav:hover {
  transform: translateY(-50%) scale(1.1);
}

/* 颜色样式 */
.markdown-content {
  color: var(--common-text) !important;
  background-color: transparent;
}

.markdown-content > div {
  color: var(--common-text) !important;
}

/* 标题颜色 */
.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  color: var(--common-text) !important;
}

.markdown-content h1 {
  border-bottom: 1px solid var(--common-color-1);
}

.markdown-content h2 {
  border-bottom: 1px solid var(--common-color-1);
}

/* 段落颜色 */
.markdown-content p {
  color: var(--common-text) !important;
}

/* 列表颜色 */
.markdown-content ul,
.markdown-content ol {
  color: var(--common-text) !important;
}

.markdown-content li {
  color: var(--common-text) !important;
}

/* 代码颜色 */
.markdown-content code {
  background-color: color-mix(in srgb, var(--common-color-1) 20%, transparent);
  color: var(--common-text);
}

/* 引用颜色 */
.markdown-content blockquote {
  border-left: 4px solid var(--common-color-1);
  background-color: color-mix(in srgb, var(--common-color-1) 10%, transparent);
  color: var(--common-text);
}

/* 链接颜色 */
.markdown-content a {
  color: var(--common-color-1);
}

/* 表格颜色 */
.markdown-content th,
.markdown-content td {
  border: 1px solid var(--common-color-1);
  color: var(--common-text) !important;
}

.markdown-content th {
  background-color: color-mix(in srgb, var(--common-color-1) 10%, transparent);
}

.markdown-content tr:nth-child(even) {
  background-color: color-mix(in srgb, var(--common-color-1) 5%, transparent);
}

/* 分隔线颜色 */
.markdown-content hr {
  border-top: 1px solid var(--common-color-1);
}

/* 灯箱颜色 */
.lightbox-overlay {
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.lightbox-close {
  color: #fff;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  --v-btn-bg: rgba(255, 255, 255, 0.15);
  --v-btn-hover-bg: rgba(255, 255, 255, 0.25);
}

.lightbox-close:hover {
  transform: scale(1.1);
}

.lightbox-counter {
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.lightbox-title {
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
}

/* 导航箭头颜色 */
.lightbox-nav {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.lightbox-nav:hover {
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 灯箱过渡动画 */
.lightbox-enter-active {
  transition: opacity 0.25s ease;
  --lightbox-img-transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.lightbox-leave-active {
  transition: opacity 0.2s ease;
  --lightbox-img-transition: transform 0.2s ease;
}
.lightbox-enter-from {
  opacity: 0;
  --lightbox-img-transform: scale(0.93);
}
.lightbox-leave-to {
  opacity: 0;
  --lightbox-img-transform: scale(0.95);
}
.lightbox-img {
  transition: var(--lightbox-img-transition, none);
  transform: var(--lightbox-img-transform, none);
}

@keyframes quoteFadeIn {
  from {
  opacity: 0;
   transform: translate(-50%, calc(-100% + 8px));
   
}
  to {
  opacity: 1;
   transform: translate(-50%, -100%);
   
}
}

/* 响应式设计 */
@media (max-width: 768px) {
  .markdown-content {
    padding: 0.5rem;
  }
  
  .markdown-content h1 {
    font-size: 1.75rem;
  }
  
  .markdown-content h2 {
    font-size: 1.25rem;
  }
  
  .lightbox-close {
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
  }

  .lightbox-counter {
    top: 16px;
    padding: 3px 12px;
    font-size: 11px;
  }

  .lightbox-img {
    max-height: 70vh;
  }

  .lightbox-title {
    font-size: 12px;
    margin-top: 8px;
  }

  .lightbox-nav {
    width: 40px;
    height: 40px;
  }

  .lightbox-prev {
    left: 12px;
  }

  .lightbox-next {
    right: 12px;
  }
}
</style>
