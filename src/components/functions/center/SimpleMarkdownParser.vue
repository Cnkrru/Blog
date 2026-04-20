<script setup>
import { ref, onMounted, watch, nextTick, h, render } from 'vue'
import MermaidRenderer from './MermaidRenderer.vue'
import MathRenderer from './MathRenderer.vue'
import CodeHighlighter from './CodeHighlighter.vue'
import EasterEggAnimation from './EasterEggAnimation.vue'


const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const markdownContent = ref('')
const mermaidBlocks = ref([])
const mathBlocks = ref([])
const codeBlocks = ref([])
const easterEggBlocks = ref([])
const contentRef = ref(null)

// 预编译所有正则表达式 - 模块级常量，避免每次调用时重新编译
const REGEX = {
  MERMAID_BLOCK: /```mermaid[\s\S]*?```/gim,
  MATH_BLOCK: /\$\$([\s\S]*?)\$\$/gim,
  CODE_BLOCK: /```([\s\S]*?)```/gim,
  EASTER_EGG: /<easter-egg([^>]*)>[\s\S]*?<\/easter-egg>/gim,
  MERMAID_CODE: /```mermaid\n/,
  MERMAID_END: /```$/,
  HEADING_1: /^# (.*$)/gim,
  HEADING_2: /^## (.*$)/gim,
  HEADING_3: /^### (.*$)/gim,
  HEADING_4: /^#### (.*$)/gim,
  HEADING_5: /^##### (.*$)/gim,
  HEADING_6: /^###### (.*$)/gim,
  IMAGE: /!\[([^\]]*)\]\(([^)]+)\)/gim,
  BOLD: /\*\*(.*)\*\*/gim,
  ITALIC: /\*(.*)\*/gim,
  LINK: /\[([^\]]+)\]\(([^)]+)\)/gim,
  UNORDERED_LIST: /^\s*\-\s(.*$)/gim,
  ORDERED_LIST: /^\s*\d+\.\s(.*$)/gim,
  INLINE_CODE: /`(.*?)`/gim,
  BLOCKQUOTE: /^> (.*$)/gim
}

// 提取 Mermaid 代码块
const extractMermaidBlocks = (content) => {
  const blocks = []
  let match

  while ((match = REGEX.MERMAID_BLOCK.exec(content)) !== null) {
    const code = match[0].replace(REGEX.MERMAID_CODE, '').replace(REGEX.MERMAID_END, '').trim()
    blocks.push({ id: `mermaid-${blocks.length}`, code })
  }

  return blocks
}

// 提取数学公式
const extractMathBlocks = (content) => {
  const blocks = []
  let match

  while ((match = REGEX.MATH_BLOCK.exec(content)) !== null) {
    const latex = match[1].trim()
    blocks.push({ id: `math-${blocks.length}`, latex })
  }

  return blocks
}

// 提取代码块
const extractCodeBlocks = (content) => {
  const blocks = []
  let match
  
  while ((match = REGEX.CODE_BLOCK.exec(content)) !== null) {
    const code = match[1]
    const lines = code.split('\n')
    const lang = lines[0].trim() || 'plaintext'
    let codeContent = lines.slice(1).join('\n')
    
    // 跳过 Mermaid 代码块，因为已经单独处理
    if (lang.toLowerCase() !== 'mermaid') {
      blocks.push({ language: lang, code: codeContent })
    }
  }
  
  return blocks
}

// 替换所有特殊块为占位符
const replaceSpecialBlocks = (content) => {
  // 首先处理 Mermaid 代码块
  let mermaidIndex = 0
  content = content.replace(REGEX.MERMAID_BLOCK, (match) => {
    const code = match.replace(REGEX.MERMAID_CODE, '').replace(REGEX.MERMAID_END, '').trim()
    mermaidBlocks.value.push({ id: `mermaid-${mermaidIndex}`, code })
    const placeholder = `<div class="mermaid-placeholder" data-id="mermaid-${mermaidIndex}"></div>`
    mermaidIndex++
    return placeholder
  })
  
  // 然后处理数学公式
  let mathIndex = 0
  content = content.replace(REGEX.MATH_BLOCK, (match, latex) => {
    mathBlocks.value.push({ id: `math-${mathIndex}`, latex: latex.trim() })
    const placeholder = `<div class="math-placeholder" data-id="math-${mathIndex}"></div>`
    mathIndex++
    return placeholder
  })
  
  // 最后处理普通代码块
  let codeIndex = 0
  content = content.replace(REGEX.CODE_BLOCK, (match, code) => {
    const lines = code.split('\n')
    const lang = lines[0].trim() || 'plaintext'
    let codeContent = lines.slice(1).join('\n')

    // 跳过 Mermaid 代码块，因为已经单独处理
    if (lang.toLowerCase() !== 'mermaid') {
      codeBlocks.value.push({ language: lang, code: codeContent })
      const placeholder = `<div class="code-block-placeholder" data-id="code-${codeIndex}"></div>`
      codeIndex++
      return placeholder
    }
    return match
  })

  // 处理彩蛋动画块
  let easterEggIndex = 0
  content = content.replace(REGEX.EASTER_EGG, (match) => {
    const textMatch = match.match(/text=["']([^"']+)["']/)
    const finalTextMatch = match.match(/final-text=["']([^"']+)["']/)

    easterEggBlocks.value.push({
      id: `easter-egg-${easterEggIndex}`,
      text: textMatch ? textMatch[1] : '欢迎来到我的博客',
      finalText: finalTextMatch ? finalTextMatch[1] : '欢迎来到我的博客'
    })
    const placeholder = `<div class="easter-egg-placeholder" data-id="easter-egg-${easterEggIndex}"></div>`
    easterEggIndex++
    return placeholder
  })

  return content
}

// 解析 Markdown
function parseMarkdown(content) {
  // 清空之前的块数据
  mermaidBlocks.value = []
  mathBlocks.value = []
  codeBlocks.value = []
  easterEggBlocks.value = []
  
  // 先移除 YAML front matter (元数据块)
  let processedContent = content.replace(/^---[\s\S]*?---\n?/, '')
  
  // 再替换特殊块为占位符
  processedContent = replaceSpecialBlocks(processedContent)
  
  // 解析其他 Markdown 语法
  let html = processedContent
  // 为标题添加id属性，使用简单的计数器生成ID
  let headingCounter = 0
  
  // 替换标题，添加ID - 使用预编译的正则表达式
  html = html
    .replace(REGEX.HEADING_1, (match, content) => {
      const id = `heading-${headingCounter++}`
      return `<h1 id="${id}">${content}</h1>`
    })
    .replace(REGEX.HEADING_2, (match, content) => {
      const id = `heading-${headingCounter++}`
      return `<h2 id="${id}">${content}</h2>`
    })
    .replace(REGEX.HEADING_3, (match, content) => {
      const id = `heading-${headingCounter++}`
      return `<h3 id="${id}">${content}</h3>`
    })
    .replace(REGEX.HEADING_4, (match, content) => {
      const id = `heading-${headingCounter++}`
      return `<h4 id="${id}">${content}</h4>`
    })
    .replace(REGEX.HEADING_5, (match, content) => {
      const id = `heading-${headingCounter++}`
      return `<h5 id="${id}">${content}</h5>`
    })
    .replace(REGEX.HEADING_6, (match, content) => {
      const id = `heading-${headingCounter++}`
      return `<h6 id="${id}">${content}</h6>`
    })
  
  // 处理其他 Markdown 语法 - 使用预编译的正则表达式
  html = html
    // 图片
    .replace(REGEX.IMAGE, '<img src="$2" alt="$1" class="markdown-image lazy-img" loading="lazy">')
    // 粗体和斜体
    .replace(REGEX.BOLD, '<strong>$1</strong>')
    .replace(REGEX.ITALIC, '<em>$1</em>')
    // 链接
    .replace(REGEX.LINK, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // 行内代码
    .replace(REGEX.INLINE_CODE, '<code>$1</code>')
    // 引用
    .replace(REGEX.BLOCKQUOTE, '<blockquote>$1</blockquote>')
    // 表格
    .replace(/\|(.+?)\|\n\|([\-:]+\|)+[\-:]+\|\n((?:\|.+?\|\n)+)/gim, (match, header, separator, rows) => {
      // 解析表头
      const headers = header.split('|').filter(item => item.trim() !== '').map(item => `<th>${item.trim()}</th>`).join('')
      
      // 解析行
      const rowLines = rows.split('\n').filter(line => line.trim() !== '')
      const tableRows = rowLines.map(row => {
        const cells = row.split('|').filter(item => item.trim() !== '').map(item => `<td>${item.trim()}</td>`).join('')
        return `<tr>${cells}</tr>`
      }).join('')
      
      return `<table class="markdown-table"><thead><tr>${headers}</tr></thead><tbody>${tableRows}</tbody></table>`
    })

  // 列表处理：按行扫描，将连续的列表行分组包裹，避免互相干扰
  html = html.split('\n').reduce((acc, line) => {
    const ulMatch = line.match(/^\s*-\s(.+)$/)
    const olMatch = line.match(/^\s*\d+\.\s(.+)$/)

    if (ulMatch) {
      // 无序列表项
      if (acc.listType === 'ul') {
        acc.listItems.push(`<li>${ulMatch[1]}</li>`)
      } else {
        if (acc.listType) acc.lines.push(`<${acc.listType}>${acc.listItems.join('')}</${acc.listType}>`)
        acc.listType = 'ul'
        acc.listItems = [`<li>${ulMatch[1]}</li>`]
      }
    } else if (olMatch) {
      // 有序列表项
      if (acc.listType === 'ol') {
        acc.listItems.push(`<li>${olMatch[1]}</li>`)
      } else {
        if (acc.listType) acc.lines.push(`<${acc.listType}>${acc.listItems.join('')}</${acc.listType}>`)
        acc.listType = 'ol'
        acc.listItems = [`<li>${olMatch[1]}</li>`]
      }
    } else {
      // 非列表行，先把积累的列表 flush
      if (acc.listType) {
        acc.lines.push(`<${acc.listType}>${acc.listItems.join('')}</${acc.listType}>`)
        acc.listType = null
        acc.listItems = []
      }
      acc.lines.push(line)
    }
    return acc
  }, { lines: [], listType: null, listItems: [] })

  // flush 末尾可能残留的列表
  if (html.listType) {
    html.lines.push(`<${html.listType}>${html.listItems.join('')}</${html.listType}>`)
  }
  html = html.lines.join('\n')

  html = html
    // 段落
    .replace(/^(?!<h[1-6]>)(?!<ul>)(?!<ol>)(?!<li>)(?!<pre>)(?!<blockquote>)(?!<table>)(?!<div class="mermaid-placeholder">)(?!<div class="math-placeholder">)(?!<div class="code-block-placeholder">)(?!<div class="easter-egg-placeholder">)(.*$)/gim, '<p>$1</p>')
    // 空行
    .replace(/<p><\/p>/gim, '')

  // 最后处理indent，不影响其他语法
  html = html.replace(/\[indent:(\d+)\]/g, (match, n) => {
    let result = ''
    for (let i = 0; i < n; i++) {
      result += '&nbsp;'
    }
    return result
  })
  html = html.replace(/\[indent\]/g, '&nbsp;&nbsp;')
  
  return html
}

// 渲染特殊块到占位符位置
const renderSpecialBlocks = () => {
  if (!contentRef.value) return
  
  // 渲染 Mermaid 图表
  mermaidBlocks.value.forEach((block) => {
    const placeholder = contentRef.value.querySelector(`.mermaid-placeholder[data-id="${block.id}"]`)
    if (placeholder) {
      // 创建一个新的容器
      const container = document.createElement('div')
      container.className = 'mermaid-container'
      container.style.margin = '20px 0'
      container.style.padding = '20px'
      container.style.backgroundColor = '#f9f9f9'
      container.style.borderRadius = '8px'
      container.style.overflow = 'auto'
      
      // 替换占位符
      placeholder.parentNode.replaceChild(container, placeholder)
      
      // 渲染 Mermaid 组件
      render(h(MermaidRenderer, { code: block.code }), container)
    }
  })
  
  // 渲染数学公式
  mathBlocks.value.forEach((block) => {
    const placeholder = contentRef.value.querySelector(`.math-placeholder[data-id="${block.id}"]`)
    if (placeholder) {
      const container = document.createElement('div')
      container.className = 'math-container'
      placeholder.parentNode.replaceChild(container, placeholder)
      render(h(MathRenderer, { latex: block.latex }), container)
    }
  })
  
  // 渲染代码块
  codeBlocks.value.forEach((block, index) => {
    const placeholder = contentRef.value.querySelector(`.code-block-placeholder[data-id="code-${index}"]`)
    if (placeholder) {
      const container = document.createElement('div')
      container.className = 'code-container'
      placeholder.parentNode.replaceChild(container, placeholder)
      render(h(CodeHighlighter, { code: block.code, language: block.language }), container)
    }
  })

  // 渲染彩蛋动画
  easterEggBlocks.value.forEach((block) => {
    const placeholder = contentRef.value.querySelector(`.easter-egg-placeholder[data-id="${block.id}"]`)
    if (placeholder) {
      const container = document.createElement('div')
      container.className = 'easter-egg-container'
      placeholder.parentNode.replaceChild(container, placeholder)
      render(h(EasterEggAnimation, {
        text: block.text,
        finalText: block.finalText
      }), container)
    }
  })
  

}

// 渲染 Markdown
function renderMarkdown() {
  // 解析 Markdown 内容
  markdownContent.value = parseMarkdown(props.content)
  
  // 渲染特殊块
  nextTick(() => {
    renderSpecialBlocks()
  })
}

onMounted(() => {
  renderMarkdown()
})

let renderTimer = null
watch(() => props.content, () => {
  clearTimeout(renderTimer)
  renderTimer = setTimeout(() => {
    renderMarkdown()
  }, 100)
})
</script>

<template>
  <div class="markdown-content" ref="contentRef">
    <!-- 渲染 Markdown 内容 -->
    <div v-html="markdownContent"></div>
  </div>
</template>

<style scoped>
.markdown-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  padding: 1rem;
}

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
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3rem;
}

.markdown-content h2 {
  font-size: 1.5rem;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3rem;
}

.markdown-content h3 {
  font-size: 1.25rem;
}

.markdown-content p {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

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

.markdown-content code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  font-size: 0.875rem;
  background-color: #f6f8fa;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
}

.markdown-content pre {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f6f8fa;
  border-radius: 3px;
  overflow-x: auto;
}

.markdown-content pre code {
  background-color: transparent;
  padding: 0;
}

.markdown-content blockquote {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border-left: 4px solid #ddd;
  background-color: #f6f8fa;
}

.markdown-content img {
  max-width: 100%;
  height: auto;
  border-radius: 3px;
  margin: 1rem 0;
}

.markdown-content a {
  color: #007bff;
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
  border: 1px solid #eaecef;
}

.markdown-content th {
  background-color: #f6f8fa;
  font-weight: 600;
}

.markdown-content tr:nth-child(even) {
  background-color: #f8f9fa;
}

/* 图片样式 */
.markdown-content img {
  max-width: 100%;
  height: auto;
  border-radius: 3px;
  margin: 1rem 0;
  display: block;
}

/* 缩进span样式 - 两格子宽度 */
.indent-span {
  display: inline-block;
  width: 2ch;
  /* 保持对齐 */
  vertical-align: bottom;
}
</style>