// 转义 HTML 特殊字符
export const escapeHtml = (text: string): string => {
  if (!text) return ''
  const map: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#039;'
  }
  return text.replace(/[&<>'"]/g, m => map[m])
}

// 转义正则特殊字符
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 高亮匹配文本
export const highlightMatch = (text: string, query: string): string => {
  if (!text || !query) return escapeHtml(text)
  const escapedQuery = escapeRegex(query)
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return escapeHtml(text).replace(
    regex,
    '<mark style="background-color: rgba(255, 192, 203, 0.3); color: var(--common-color-1); padding: 0 2px; border-radius: 2px;">$1</mark>'
  )
}