import { ref, computed } from 'vue'

export const parseFrontmatter = (content) => {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  let frontmatter = {}
  let markdown = content

  if (frontmatterMatch) {
    const frontmatterText = frontmatterMatch[1]
    markdown = content.replace(frontmatterMatch[0], '').trim()
    frontmatterText.split('\n').forEach(line => {
      const match = line.match(/^(.+?):\s*(.+)$/)
      if (match) {
        const [, key, value] = match
        if (key.trim() === 'tags') {
          frontmatter[key.trim()] = value
            .replace(/[\[\]]/g, '')
            .split(',')
            .map(tag => tag.trim().replace(/["']/g, ''))
        } else {
          frontmatter[key.trim()] = value.trim().replace(/["']/g, '')
        }
      }
    })
  }

  return { frontmatter, content: markdown }
}