/**
 * 数据源 Store — 加载文章列表、获取 Markdown 文件、按标签/分类筛选
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const lastFetchTime = ref(0)
  const cacheDuration = 5 * 60 * 1000

  // 所有 md 文件，通过 import.meta.glob 自动收集，新增文章无需手动维护
  const mdModules = {
    ...import.meta.glob('../../content/posts/*.md', { query: '?raw', import: 'default', eager: false }),
    ...import.meta.glob('../../content/projects/*.md', { query: '?raw', import: 'default', eager: false }),
  }

  const totalArticles = computed(() => articles.value.length)
  const latestArticles = computed(() => articles.value.slice(0, 5))
  const hasArticles = computed(() => articles.value.length > 0)

  const fetchArticles = async (force = false) => {
    const now = Date.now()
    if (!force && articles.value.length > 0 && (now - lastFetchTime.value) < cacheDuration) {
      return articles.value
    }
    isLoading.value = true
    error.value = null
    try {
      const { data } = await axios.get('/config/search.json')
      articles.value = data
      lastFetchTime.value = now
      return articles.value
    } catch (err) {
      error.value = err.message || 'Failed to load articles'
      return []
    } finally {
      isLoading.value = false
    }
  }

  const getArticleById = async (id) => {
    try {
      const articles = await fetchArticles()
      return articles.find(article => article.id === id) || null
    } catch (e) {
      console.error('获取文章详情失败:', e)
      return null
    }
  }

  const getArticlesByTag = async (tag) => {
    try {
      const articles = await fetchArticles()
      return articles.filter(article => article.tags?.includes(tag))
    } catch (e) {
      console.error('按标签获取文章失败:', e)
      return []
    }
  }

  const getArticlesByCategory = async (category) => {
    try {
      const articles = await fetchArticles()
      return articles.filter(article => article.category === category)
    } catch (e) {
      console.error('按分类获取文章失败:', e)
      return []
    }
  }

  /**
   * 根据 id 加载对应 md 文件的原始内容
   * 文件命名规则：
   *   数字 id (0,1,2...)  -> content/posts/post-{id}.md
   *   字符串 id           -> content/posts/{id}.md
   *   project-N           -> content/projects/project-{N}.md
   */
  const loadMarkdown = async (id) => {
    const candidates = [
      `../../content/posts/post-${id}.md`,
      `../../content/posts/${id}.md`,
      `../../content/projects/${id}.md`,
    ]

    for (const path of candidates) {
      if (mdModules[path]) {
        try {
          return await (mdModules[path]())
        } catch (err) {
          console.error(`[articlesStore] 加载文件失败 ${path}:`, err)
        }
      }
    }
    return null
  }

  const clearArticles = () => {
    articles.value = []
    lastFetchTime.value = 0
  }

  return {
    articles,
    isLoading,
    error,
    lastFetchTime,
    cacheDuration,
    totalArticles,
    latestArticles,
    hasArticles,
    fetchArticles,
    getArticleById,
    getArticlesByTag,
    getArticlesByCategory,
    loadMarkdown,
    clearArticles
  }
})