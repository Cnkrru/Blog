<template>
  <div>
    <!-- 按顺序渲染内容块 -->
    <div v-if="renderMode === 'special-blocks'">
      <div v-for="(block, index) in orderedBlocks" :key="`block-${index}`">
        <!-- Mermaid 图表 -->
        <div v-if="block.type === 'mermaid'" class="mermaid-container">
          <MermaidRender :code="block.content" />
        </div>
        <!-- 数学公式 -->
        <div v-else-if="block.type === 'math'" class="math-container">
          <KatexRender :latex="block.content" />
        </div>
        <!-- 代码块 -->
        <div v-else-if="block.type === 'code'" class="code-container">
          <HighlightRender :code="block.content" :language="block.language" />
        </div>
        <!-- 提示块 -->
        <div v-else-if="block.type === 'admonition'" class="admonition-container">
          <AdmonitionRender :type="block.admonitionType" :title="block.admonitionTitle" :content="block.content" />
        </div>
        <!-- Toast 按钮 -->
        <span v-else-if="block.type === 'toast-btn'" class="toast-btn-container">
          <ToastButton :type="block.toastType" :text="block.toastText" />
        </span>
        <!-- 彩蛋动画块 -->
        <div v-else-if="block.type === 'easter-egg'" class="easter-egg-container">
          <EasterEggAnimation :text="block.text" :final-text="block.finalText" />
        </div>
        <!-- 普通Markdown内容 -->
        <div v-else-if="block.type === 'markdown'" class="markdown-content" v-html="block.content"></div>
      </div>
    </div>
    <div v-else class="markdown-content" v-html="markdownContent"></div>
    <!-- 自定义灯箱-->
    <div v-if="showLightbox" class="lightbox-overlay" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <button class="lightbox-close" @click="closeLightbox">&times;</button>
        <img :src="lightboxImages[currentImageIndex].src" :alt="lightboxImages[currentImageIndex].title">
        <div class="lightbox-title">{{ lightboxImages[currentImageIndex].title }}</div>
        <div class="lightbox-nav">
          <button class="lightbox-prev" @click="prevImage" :disabled="currentImageIndex === 0">&lt;</button>
          <button class="lightbox-next" @click="nextImage" :disabled="currentImageIndex === lightboxImages.length - 1">&gt;</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 选中文字引用弹出 -->
  <Teleport to="body">
    <div
      v-if="showQuotePopup"
      class="quote-popup"
      :style="{ left: quotePopupPos.x + 'px', top: quotePopupPos.y + 'px' }"
      @click.stop
    >
      <button v-if="!quoteCopied" class="quote-btn" @click="copyQuote">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        引用
      </button>
      <span v-else class="quote-done">已复制</span>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import MermaidRender from './MermaidRender.vue'
import KatexRender from './KatexRender.vue'
import HighlightRender from './HighlightRender.vue'
import EasterEggAnimation from '../media/EasterEggAnimation.vue'
import AdmonitionRender from './AdmonitionRender.vue'
import ToastButton from './ToastButton.vue'
import { CDN_VERSIONS } from '../../utils/constants'

const props = defineProps<{
  content: string
}>()

const route = useRoute()
const postId = computed(() => route.params.id as string || '')

const markdownContent = ref('')
const showLightbox = ref(false)
const currentImageIndex = ref(0)
const lightboxImages = ref([])
const mermaidBlocks = ref([])
const mathBlocks = ref([])
const codeBlocks = ref([])
const easterEggBlocks = ref([])
const orderedBlocks = ref([]) // 按顺序排列的内容块
const renderMode = ref('normal') // normal 或 special-blocks

// 提示块默认标题
const defaultTitle = (type: string): string => {
  const titles: Record<string, string> = {
    info: '信息',
    success: '成功',
    warning: '警告',
    error: '错误',
    tip: '提示',
    note: '笔记',
    danger: '危险'
  }
  return titles[type] || type
}

// 加载CDN资源
const loadCDN = async () => {
  
  // 移除可能存在的旧脚本和样式
  const cleanupOldResources = () => {
    // 移除旧的marked.js
    const oldMarkedScripts = document.querySelectorAll('script[src*="marked"]')
    oldMarkedScripts.forEach(script => script.remove())
    
    // 重置全局变量
    delete window.marked
  }
  
  cleanupOldResources()
  
  // 加载marked.js
  await new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://cdn.jsdelivr.net/npm/marked@${CDN_VERSIONS.marked}/marked.min.js`
    script.onload = () => {
      resolve()
    }
    script.onerror = () => {
      console.error('marked.js加载失败，尝试备用链接')
      // 尝试备用链接
      const backupScript = document.createElement('script')
      backupScript.src = `https://unpkg.com/marked@${CDN_VERSIONS.marked}/marked.min.js`
      backupScript.onload = () => {
        resolve()
      }
      backupScript.onerror = () => {
        console.error('marked.js备用链接也加载失败')
        reject(new Error('marked.js加载失败'))
      }
      document.head.appendChild(backupScript)
    }
    document.head.appendChild(script)
  })
  
  // 配置marked
  if (window.marked && typeof window.marked === 'object') {
    // 确保marked是一个函数
    if (typeof window.marked.parse === 'function') {
    } else if (typeof window.marked === 'function') {
    } else {
      console.error('marked.js API结构异常', window.marked)
    }
  } else {
    console.error('marked.js未正确加载', window.marked)
    throw new Error('marked.js未正确加载')
  }
}

// 提取特殊块
const extractSpecialBlocks = (content) => {
  // 清空之前的块数据
  mermaidBlocks.value = []
  mathBlocks.value = []
  codeBlocks.value = []
  easterEggBlocks.value = []
  
  // 提取 Mermaid 代码块
  const mermaidRegex = /```mermaid[\s\S]*?```/gim
  let match
  while ((match = mermaidRegex.exec(content)) !== null) {
    const code = match[0].replace(/^```mermaid\s*/i, '').replace(/```$/i, '').trim()
    mermaidBlocks.value.push({ id: `mermaid-${mermaidBlocks.value.length}`, code })
  }
  
  // 提取数学公式
  const mathRegex = /\$\$([\s\S]*?)\$\$/gim
  while ((match = mathRegex.exec(content)) !== null) {
    const latex = match[1].trim()
    mathBlocks.value.push({ id: `math-${mathBlocks.value.length}`, latex })
  }
  
  // 提取代码块
  const codeRegex = /```([\s\S]*?)```/gim
  while ((match = codeRegex.exec(content)) !== null) {
    const code = match[1]
    const lines = code.split('\n')
    const lang = lines[0].trim() || 'plaintext'
    let codeContent = lines.slice(1).join('\n')
    
    // 跳过 Mermaid 代码块，因为已经单独处理
    if (lang.toLowerCase() !== 'mermaid') {
      codeBlocks.value.push({ language: lang, code: codeContent.replace(/\n+$/, '') })
    }
  }
  
  // 提取彩蛋动画块
  const easterEggRegex = /<easter-egg([^>]*)>[\s\S]*?<\/easter-egg>/gim
  while ((match = easterEggRegex.exec(content)) !== null) {
    const textMatch = match[0].match(/text=["']([^"']+)["']/)
    const finalTextMatch = match[0].match(/final-text=["']([^"']+)["']/)

    easterEggBlocks.value.push({
      id: `easter-egg-${easterEggBlocks.value.length}`,
      text: textMatch ? textMatch[1] : '欢迎来到我的博客',
      finalText: finalTextMatch ? finalTextMatch[1] : '欢迎来到我的博客'
    })
  }
}

// 按顺序提取和组织内容块
const extractOrderedBlocks = (content) => {
  const blocks = []
  let lastIndex = 0
  
  // 移除YAML front matter
  const yamlMatch = content.match(/^---[\s\S]*?---\n?/)
  if (yamlMatch) {
    lastIndex = yamlMatch[0].length
  }
  
  // 定义所有特殊块的正则表达式
  const patterns = [
    { type: 'mermaid', regex: /```mermaid[\s\S]*?```/gim },
    { type: 'math', regex: /\$\$([\s\S]*?)\$\$/gim },
    { type: 'code', regex: /```([\s\S]*?)```/gim },
    { type: 'easter-egg', regex: /<easter-egg([^>]*)>[\s\S]*?<\/easter-egg>/gim },
    { type: 'admonition', regex: /^:::\s*(info|success|warning|error|tip|note|danger)\s*(.*?)\s*\n([\s\S]*?)^:::\s*$/gm },
    { type: 'toast-btn', regex: /<msg:(info|success|warning|error)>([\s\S]*?)<\/msg:(info|success|warning|error)>/gim }
  ]
  
  // 收集所有特殊块及其位置
  const allMatches = []
  
  patterns.forEach(({ type, regex }) => {
    let match
    while ((match = regex.exec(content)) !== null) {
      allMatches.push({
        type,
        match,
        index: match.index
      })
    }
  })
  
  // 按位置排序
  allMatches.sort((a, b) => a.index - b.index)
  
  // 按顺序处理所有块
  allMatches.forEach(({ type, match, index }) => {
    // 添加之前的普通Markdown内容
    if (index > lastIndex) {
      const markdownContent = content.substring(lastIndex, index)
      if (markdownContent.trim()) {
        blocks.push({
          type: 'markdown',
          content: markdownContent
        })
      }
    }
    
    // 添加特殊块
    if (type === 'mermaid') {
      const code = match[0].replace(/^```mermaid\s*/i, '').replace(/```$/i, '').trim()
      blocks.push({
        type: 'mermaid',
        content: code
      })
    } else if (type === 'math') {
      const latex = match[1].trim()
      blocks.push({
        type: 'math',
        content: latex
      })
    } else if (type === 'code') {
      const code = match[1]
      const lines = code.split('\n')
      const lang = lines[0].trim() || 'plaintext'
      const codeContent = lines.slice(1).join('\n').replace(/\n+$/, '')
      
      // 跳过 Mermaid 代码块，因为已经单独处理
      if (lang.toLowerCase() !== 'mermaid') {
        blocks.push({
          type: 'code',
          content: codeContent,
          language: lang
        })
      }
    } else if (type === 'easter-egg') {
      const textMatch = match[0].match(/text=["']([^"']+)["']/)
      const finalTextMatch = match[0].match(/final-text=["']([^"']+)["']/)
      blocks.push({
        type: 'easter-egg',
        content: match[0],
        text: textMatch ? textMatch[1] : '欢迎来到我的博客',
        finalText: finalTextMatch ? finalTextMatch[1] : '欢迎来到我的博客'
      })
    } else if (type === 'admonition') {
      const admonType = match[1] || 'info'
      const admonTitle = match[2]?.trim() || defaultTitle(admonType)
      const admonContent = match[3]?.trim() || ''
      blocks.push({
        type: 'admonition',
        content: admonContent,
        admonitionType: admonType,
        admonitionTitle: admonTitle
      })
    } else if (type === 'toast-btn') {
      const btnType = match[1] || 'info'
      const btnText = match[2]?.trim() || ''
      blocks.push({
        type: 'toast-btn',
        toastType: btnType,
        toastText: btnText
      })
    }
    
    lastIndex = index + match[0].length
  })
  
  // 添加最后一部分普通Markdown内容
  if (lastIndex < content.length) {
    const markdownContent = content.substring(lastIndex)
    if (markdownContent.trim()) {
      blocks.push({
        type: 'markdown',
        content: markdownContent
      })
    }
  }
  
  return blocks
}

// 解析和渲染Markdown
const renderMarkdown = async () => {
  
  try {
    await loadCDN()
    
    // 提取特殊块
    extractSpecialBlocks(props.content)
    
    // 检查是否有特殊块
    const hasSpecialBlocks = mermaidBlocks.value.length > 0 || mathBlocks.value.length > 0 || codeBlocks.value.length > 0 || easterEggBlocks.value.length > 0 || /:::\s*(info|success|warning|error|tip|note|danger)/gm.test(props.content) || /<msg:(info|success|warning|error)>/gim.test(props.content)
    
    if (hasSpecialBlocks) {
      // 有特殊块，使用特殊块渲染模式
      renderMode.value = 'special-blocks'
      
      // 按顺序提取和组织内容块
      const blocks = extractOrderedBlocks(props.content)
      
      // 解析每个普通Markdown块
      const processedBlocks = blocks.map(block => {
        if (block.type === 'markdown') {
          if (window.marked) {
            if (typeof window.marked.parse === 'function') {
              return {
                ...block,
                content: window.marked.parse(block.content)
              }
            } else if (typeof window.marked === 'function') {
              return {
                ...block,
                content: window.marked(block.content)
              }
            }
          }
          return { ...block, content: `<p>Markdown解析器加载失败</p>` }
        }
        if (block.type === 'admonition') {
          // 将提示块内容也渲染为 Markdown
          if (window.marked && block.content) {
            const rendered = typeof window.marked.parse === 'function'
              ? window.marked.parse(block.content)
              : typeof window.marked === 'function'
                ? window.marked(block.content)
                : block.content
            return { ...block, content: rendered }
          }
          return block
        }
        return block
      })
      
      orderedBlocks.value = processedBlocks
    } else {
      // 没有特殊块，使用普通渲染模式
      renderMode.value = 'normal'
      
      // 移除YAML front matter
      let processedContent = props.content.replace(/^---[\s\S]*?---\n?/, '')
      
      // 解析Markdown
      if (window.marked) {
        if (typeof window.marked.parse === 'function') {
          markdownContent.value = window.marked.parse(processedContent)
        } else if (typeof window.marked === 'function') {
          markdownContent.value = window.marked(processedContent)
        } else {
          markdownContent.value = `<p>Markdown解析器API错误</p>`
          console.error('Markdown解析器API错误', window.marked)
        }
      } else {
        markdownContent.value = `<p>Markdown解析器加载失败</p>`
        console.error('Markdown解析器加载失败')
      }
    }
    
    // 添加图片点击事件、标题锚点和锚点链接滚动拦截
    nextTick(() => {
      addImageClickListeners()
      addHeadingIds()
      addAnchorClickInterceptors()
    })
  } catch (error) {
    console.error('渲染Markdown时出错:', error)
    markdownContent.value = `<p>渲染Markdown时出错: ${error.message}</p>`
    renderMode.value = 'normal'
  }
}



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
      // 移除之前可能存在的点击事件监听器，避免重复添加
      image.removeEventListener('click', () => {})
      image.addEventListener('click', () => {
        openLightbox(index)
      })
    })

    lightboxImages.value = imageData
  }, 100)
}

// 为标题生成 id，支持中文锚点跳转
const generateHeadingId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const addHeadingIds = () => {
  setTimeout(() => {
    const headings = document.querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6')
    headings.forEach((h) => {
      const text = h.textContent?.trim() || ''
      if (text && !h.id) {
        h.id = generateHeadingId(text)
      }
    })
  }, 100)
}

// 存储事件监听器引用，用于组件卸载时清理
const anchorContainers: Element[] = []

// 拦截锚点链接点击，使用 scroll API 滚动（与 Toc.vue 一致）
const handleAnchorClick = (e: Event) => {
  const target = e.target as HTMLElement
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

function handleTextSelection(e: MouseEvent) {
  // 确保点击在 markdown 内容区域
  const target = e.target as HTMLElement
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
}

const closeLightbox = () => {
  showLightbox.value = false
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

onMounted(() => {
  renderMarkdown()
  // 监听文本选择
  document.addEventListener('mouseup', handleTextSelection)
})

onUnmounted(() => {
  document.removeEventListener('mouseup', handleTextSelection)
  anchorContainers.forEach(c => c.removeEventListener('click', handleAnchorClick))
  anchorContainers.length = 0
})

watch(() => props.content, () => {
  renderMarkdown()
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
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: var(--common-color-1);
  color: var(--common-content);
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.15s ease;
}

.quote-btn:hover {
  background: var(--common-hover);
}

.quote-done {
  font-size: 12px;
  color: var(--color-success);
  padding: 6px 12px;
  font-weight: 600;
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

/* 确保Markdown内容可见 */
.markdown-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.lightbox-close {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  margin-bottom: 15px;
}

.lightbox-title {
  margin-bottom: 15px;
  font-size: 16px;
}

.lightbox-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.lightbox-prev,
.lightbox-next {
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
  font-weight: bold;
}

.lightbox-prev:hover,
.lightbox-next:hover {
  transform: translateY(-2px);
}

.lightbox-prev:disabled,
.lightbox-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>

<style>
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
}

.lightbox-content {
  background-color: var(--common-bg);
  box-shadow: 0 4px 20px var(--common-shadow);
}

.lightbox-close {
  color: var(--common-text);
}

.lightbox-title {
  color: var(--common-text);
}

/* 灯箱导航颜色 */
.lightbox-prev,
.lightbox-next {
  background-color: var(--common-color-1);
  border: 2px solid var(--common-color-1);
  color: var(--common-content);
  box-shadow: 0 2px 8px var(--common-shadow);
}

.lightbox-prev:hover,
.lightbox-next:hover {
  background-color: var(--common-hover);
  box-shadow: 0 4px 12px var(--common-shadow);
}
</style>

<style>
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
  
  .lightbox-content {
    max-width: 95%;
    padding: 10px;
  }
  
  .lightbox-content img {
    max-height: 60vh;
  }
}
</style>
