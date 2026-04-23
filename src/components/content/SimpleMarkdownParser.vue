<script setup>
import { ref, onMounted, watch, nextTick, h, render } from 'vue'
import MermaidRenderer from './MermaidRenderer.vue'
import MathRenderer from './MathRenderer.vue'
import CodeHighlighter from './CodeHighlighter.vue'
import EasterEggAnimation from '../media/EasterEggAnimation.vue'

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
  HEADING_1: /^\s*# (.*$)/gim,
  HEADING_2: /^\s*## (.*$)/gim,
  HEADING_3: /^\s*### (.*$)/gim,
  HEADING_4: /^\s*#### (.*$)/gim,
  HEADING_5: /^\s*##### (.*$)/gim,
  HEADING_6: /^\s*###### (.*$)/gim,
  IMAGE: /!\[([^\]]*)\]\(([^)]+)\)/gim,
  BOLD: /\*\*(.*)\*\*/gim,
  ITALIC: /\*(.*)\*/gim,
  LINK: /\[([^\]]+)\]\(([^)]+)\)/gim,
  UNORDERED_LIST: /^\s*\-\s(.*$)/gim,
  ORDERED_LIST: /^\s*\d+\.\s(.*$)/gim,
  INLINE_CODE: /`(.*?)`/gim,
  BLOCKQUOTE: /^\s*> (.*$)/gim
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
    // 提取 mermaid 代码，去除开始和结束标记
    let code = match
    // 去除开始标记
    code = code.replace(/^```mermaid\s*/i, '')
    // 去除结束标记
    code = code.replace(/```$/i, '').trim()
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
  const lines = html.split('\n')
  const result = []
  let listStack = [] // 用于处理嵌套列表

  for (const line of lines) {
    // 匹配无序列表项，捕获缩进级别
    const ulMatch = line.match(/^(\s*)\-\s(.+)$/)
    // 匹配有序列表项，捕获缩进级别
    const olMatch = line.match(/^(\s*)\d+\.\s(.+)$/)

    if (ulMatch) {
      const indent = ulMatch[1].length
      const content = ulMatch[2]
      handleListItem('ul', indent, content)
    } else if (olMatch) {
      const indent = olMatch[1].length
      const content = olMatch[2]
      handleListItem('ol', indent, content)
    } else {
      // 非列表行，先把积累的列表 flush
      while (listStack.length > 0) {
        const { type, items } = listStack.pop()
        const listHtml = `<${type}>${items.join('')}</${type}>`
        if (listStack.length > 0) {
          // 如果栈不为空，将当前列表作为上一个列表的项
          listStack[listStack.length - 1].items.push(`<li>${listHtml}</li>`)
        } else {
          // 如果栈为空，将当前列表添加到结果中
          result.push(listHtml)
        }
      }
      result.push(line)
    }
  }

  // flush 末尾可能残留的列表
  while (listStack.length > 0) {
    const { type, items } = listStack.pop()
    const listHtml = `<${type}>${items.join('')}</${type}>`
    if (listStack.length > 0) {
      listStack[listStack.length - 1].items.push(`<li>${listHtml}</li>`)
    } else {
      result.push(listHtml)
    }
  }
  
  html = result.join('\n')
  
  // 处理列表项的函数
  function handleListItem(type, indent, content) {
    // 计算缩进级别（假设每个缩进级别为 2 个空格）
    const level = Math.floor(indent / 2)
    
    // 弹出栈中级别大于等于当前级别的列表
    while (listStack.length > level) {
      const { type: poppedType, items: poppedItems } = listStack.pop()
      const listHtml = `<${poppedType}>${poppedItems.join('')}</${poppedType}>`
      if (listStack.length > 0) {
        listStack[listStack.length - 1].items.push(`<li>${listHtml}</li>`)
      } else {
        result.push(listHtml)
      }
    }
    
    // 如果栈的长度小于当前级别，创建新的列表
    while (listStack.length < level) {
      listStack.push({ type: listStack.length > 0 ? listStack[listStack.length - 1].type : type, items: [] })
    }
    
    // 如果栈为空或者栈顶的列表类型与当前类型不同，创建新的列表
    if (listStack.length === 0 || listStack[listStack.length - 1].type !== type) {
      listStack.push({ type, items: [`<li>${content}</li>`] })
    } else {
      // 否则，将当前项添加到栈顶的列表中
      listStack[listStack.length - 1].items.push(`<li>${content}</li>`)
    }
  }

  // 段落处理：按行扫描，将连续的非列表、非标题、非引用、非代码块行分组为段落
  const paraLines = html.split('\n')
  const paraResult = []
  let currentPara = []

  for (const line of paraLines) {
    // 检查是否为特殊行（标题、列表、引用、代码块、表格、占位符等）
    const isSpecialLine = /^(<h[1-6]>|<ul>|<ol>|<li>|<pre>|<blockquote>|<table>|<div class="mermaid-placeholder">|<div class="math-placeholder">|<div class="code-block-placeholder">|<div class="easter-egg-placeholder">|<div class="mermaid-container">|<div class="math-container">|<div class="code-container">|<div class="easter-egg-container">)/.test(line)
    
    if (isSpecialLine) {
      // 如果当前有积累的段落，先flush
      if (currentPara.length > 0) {
        const paraContent = currentPara.join(' ').trim()
        if (paraContent) {
          paraResult.push(`<p>${paraContent}</p>`)
        }
        currentPara = []
      }
      // 添加特殊行
      paraResult.push(line)
    } else if (line.trim() === '') {
      // 空行，flush当前段落
      if (currentPara.length > 0) {
        const paraContent = currentPara.join(' ').trim()
        if (paraContent) {
          paraResult.push(`<p>${paraContent}</p>`)
        }
        currentPara = []
      }
      // 保留空行
      paraResult.push('')
    } else {
      // 普通行，添加到当前段落
      currentPara.push(line)
    }
  }

  // flush 末尾可能残留的段落
  if (currentPara.length > 0) {
    const paraContent = currentPara.join(' ').trim()
    if (paraContent) {
      paraResult.push(`<p>${paraContent}</p>`)
    }
  }
  
  html = paraResult.join('\n')

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
      container.style.backgroundColor = 'var(--card-bg)'
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
  color: var(--text-color);
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
  color: var(--text-color);
}

.markdown-content h1 {
  font-size: 2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.3rem;
}

.markdown-content h2 {
  font-size: 1.5rem;
  border-bottom: 1px solid var(--border-color);
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
  background-color: var(--code-bg);
  color: var(--code-text);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
}

.markdown-content pre {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: var(--code-bg);
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
  border-left: 4px solid var(--accent-fg);
  background-color: var(--hover-bg);
  color: var(--text-secondary);
}

.markdown-content img {
  max-width: 100%;
  height: auto;
  border-radius: 3px;
  margin: 1rem 0;
}

.markdown-content a {
  color: var(--accent-fg);
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
  border: 1px solid var(--border-color);
}

.markdown-content th {
  background-color: var(--hover-bg);
  font-weight: 600;
}

.markdown-content tr:nth-child(even) {
  background-color: var(--hover-bg);
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
  vertical-align: bottom;
}
</style>