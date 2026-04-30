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
   *   字符串 id           -> pages/post/{id}.md
   *   changelog           -> pages/log/changelog.md
   *   project-N           -> pages/project/project-{N}.md
   */
  async function loadMarkdown(id) {
    const candidates = [
      `../pages/post/post-${id}.md`,
      `../pages/post/${id}.md`,
      `../pages/project/${id}.md`,
      `../pages/log/${id}.md`,
    ]

    for (const path of candidates) {
      if (mdModules[path]) {
        try {
          return await mdModules[path]()
        } catch (err) {
          console.error(`[articlesStore] 加载文件失败 ${path}:`, err)
        }
      }
    }
    return null
  }

  // 计算文章数量，排除 changelog
  const articleCount = computed(() => {
    return articles.value
      .filter(item => item.id !== 'changelog')
      .length
  })

  return { articles, loaded, loading, fetchArticles, loadMarkdown, articleCount }
})
