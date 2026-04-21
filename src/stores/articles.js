import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref([])
  const loaded = ref(false)
  const loading = ref(false)

  // 所有 md 文件，通过 import.meta.glob 自动收集，新增文章无需手动维护
  const mdModules = {
    ...import.meta.glob('../pages/post/*.md', { query: '?raw', import: 'default', eager: false }),
    ...import.meta.glob('../pages/log/*.md', { query: '?raw', import: 'default', eager: false }),
    ...import.meta.glob('../pages/command/*.md', { query: '?raw', import: 'default', eager: false }),
    ...import.meta.glob('../pages/project/*.md', { query: '?raw', import: 'default', eager: false }),
  }

  /**
   * 加载 search.json，已加载则直接返回缓存
   */
  async function fetchArticles() {
    if (loaded.value) return articles.value
    if (loading.value) {
      // 等待已有请求完成
      await new Promise(resolve => {
        const stop = setInterval(() => {
          if (!loading.value) { clearInterval(stop); resolve() }
        }, 20)
      })
      return articles.value
    }

    loading.value = true
    try {
      const res = await fetch('/config/search.json')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      articles.value = await res.json()
      loaded.value = true
    } catch (e) {
      console.error('[articlesStore] 加载 search.json 失败:', e)
      articles.value = []
    } finally {
      loading.value = false
    }
    return articles.value
  }

  /**
   * 根据 id 加载对应 md 文件的原始内容
   * 文件命名规则：
   *   数字 id (0,1,2...)  -> pages/post/post-{id}.md
   *   changelog           -> pages/log/changelog.md
   *   terminal            -> pages/command/terminal.md
   *   project-N           -> pages/project/project-{N}.md
   */
  async function loadMarkdown(id) {
    console.log('loadMarkdown called with id:', id)
    const candidates = [
      // 数字 id：文章，文件名带 post- 前缀
      `../pages/post/post-${id}.md`,
      // 已带前缀的直接匹配（project-N 等）
      `../pages/project/${id}.md`,
      // 特殊页
      `../pages/log/${id}.md`,
      `../pages/command/${id}.md`,
    ]

    console.log('Candidates:', candidates)
    console.log('mdModules keys:', Object.keys(mdModules))

    for (const path of candidates) {
      console.log('Checking path:', path, 'exists:', !!mdModules[path])
      if (mdModules[path]) {
        try {
          const raw = await mdModules[path]()
          console.log('Successfully loaded:', path)
          return raw
        } catch (err) {
          console.error('Error loading', path, ':', err)
        }
      }
    }
    console.log('No matching file found for id:', id)
    return null
  }

  // 计算文章数量，排除 terminal 和 changelog
  const articleCount = computed(() => {
    return articles.value
      .filter(item => item.id !== 'terminal' && item.id !== 'changelog')
      .length
  })

  return { articles, loaded, loading, fetchArticles, loadMarkdown, articleCount }
})
