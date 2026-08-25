// 转义 HTML 特殊字符
export const escapeHtml = (text) => {
  if (!text) return ''
  const map = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#039;'
  }
  return text.replace(/[&<>'"]/g, m => map[m])
}

// 转义正则特殊字符
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 高亮匹配文本
export const highlightMatch = (text, query) => {
  if (!text || !query) return escapeHtml(text)
  const escapedQuery = escapeRegex(query)
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return escapeHtml(text).replace(
    regex,
    '<mark style="background-color: rgba(255, 192, 203, 0.3); color: var(--common-color-1); padding: 0 2px; border-radius: 2px;">$1</mark>'
  )
}