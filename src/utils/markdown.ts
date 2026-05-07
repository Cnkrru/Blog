/**
 * Markdown 解析工具
 * 用于解析 Markdown 文件中的 Frontmatter 元数据
 */

/**
 * 解析 YAML 格式的值
 * @param {string} value - 原始值字符串
 * @returns {any} 解析后的值
 */
function parseYamlValue(value) {
  const trimmed = value.trim()
  
  // 空值处理
  if (trimmed === '') return ''
  
  // 布尔值
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  
  // null 值
  if (trimmed === 'null' || trimmed === '~') return null
  
  // 数字（整数和浮点数）
  const numMatch = trimmed.match(/^-?\d+(\.\d+)?$/)
  if (numMatch) return parseFloat(trimmed)
  
  // 数组（简单格式：[item1, item2, item3]）
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const content = trimmed.slice(1, -1)
    if (!content.trim()) return []
    
    return content.split(',')
      .map(item => parseYamlValue(item.trim().replace(/["']/g, '')))
      .filter(item => item !== '')
  }
  
  // 字符串（移除引号）
  const quoteMatch = trimmed.match(/^(["'])((?:\\.|[^\\])*)\1$/)
  if (quoteMatch) {
    return quoteMatch[2].replace(/\\(["'])/g, '$1')
  }
  
  // 普通字符串
  return trimmed
}

/**
 * 解析 Markdown 内容中的 Frontmatter 元数据
 * @param {string} content - Markdown 内容
 * @returns {object} { frontmatter, content }
 */
export const parseFrontmatter = (content) => {
  if (!content || typeof content !== 'string') {
    return { frontmatter: {}, content: '' }
  }

  const frontmatter = {}
  let markdown = content.trim()

  // 匹配 Frontmatter 块（--- 开头和结尾）
  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\s*/)
  
  if (frontmatterMatch) {
    const frontmatterText = frontmatterMatch[1]
    markdown = markdown.slice(frontmatterMatch[0].length)

    // 按行解析
    const lines = frontmatterText.split('\n')
    
    for (const line of lines) {
      // 跳过空行和注释
      if (!line.trim() || line.trim().startsWith('#')) continue

      // 匹配键值对（支持缩进）
      const match = line.match(/^\s*([^:]+):\s*(.+)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2]
        
        try {
          frontmatter[key] = parseYamlValue(value)
        } catch (error) {
          console.warn(`Frontmatter 解析错误 [${key}]:`, error)
          frontmatter[key] = value.trim()
        }
      }
    }
  }

  return { frontmatter, content: markdown }
}

/**
 * 序列化 Frontmatter 对象为 YAML 格式
 * @param {object} frontmatter - Frontmatter 对象
 * @returns {string} YAML 字符串
 */
export const stringifyFrontmatter = (frontmatter) => {
  if (!frontmatter || typeof frontmatter !== 'object') return ''

  const lines = []
  
  for (const [key, value] of Object.entries(frontmatter)) {
    let yamlValue
    
    if (Array.isArray(value)) {
      yamlValue = `[${value.map(v => 
        typeof v === 'string' ? `"${v}"` : v
      ).join(', ')}]`
    } else if (typeof value === 'string') {
      yamlValue = `"${value}"`
    } else {
      yamlValue = String(value)
    }
    
    lines.push(`${key}: ${yamlValue}`)
  }
  
  return lines.length > 0 ? `---\n${lines.join('\n')}\n---\n` : ''
}