/**
 * Markdown 解析工具 — 解析 Frontmatter 元数据
 */

function parseYamlValue(value) {
  const trimmed = value.trim()
  if (trimmed === '') return ''
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (trimmed === 'null' || trimmed === '~') return null

  const numMatch = trimmed.match(/^-?\d+(\.\d+)?$/)
  if (numMatch) return parseFloat(trimmed)

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const content = trimmed.slice(1, -1)
    if (!content.trim()) return []
    return content.split(',')
      .map(item => parseYamlValue(item.trim().replace(/["']/g, '')))
      .filter(item => item !== '')
  }

  const quoteMatch = trimmed.match(/^(["'])((?:\\.|[^\\])*)\1$/)
  if (quoteMatch) return quoteMatch[2].replace(/\\(["'])/g, '$1')

  return trimmed
}

export const parseFrontmatter = (content) => {
  if (!content || typeof content !== 'string') {
    return { frontmatter: {}, content: '' }
  }

  const frontmatter = {}
  let markdown = content.trim()

  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\s*/)
  if (frontmatterMatch) {
    const frontmatterText = frontmatterMatch[1]
    markdown = markdown.slice(frontmatterMatch[0].length)

    for (const line of frontmatterText.split('\n')) {
      if (!line.trim() || line.trim().startsWith('#')) continue
      const match = line.match(/^\s*([^:]+):\s*(.+)$/)
      if (match) {
        const key = match[1].trim()
        try {
          frontmatter[key] = parseYamlValue(match[2])
        } catch (error) {
          console.warn(`Frontmatter 解析错误 [${key}]:`, error)
          frontmatter[key] = match[2].trim()
        }
      }
    }
  }

  return { frontmatter, content: markdown }
}