/**
 * 数据源 Store — 加载文章列表、获取 Markdown 文件、按标签/分类筛选
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Article } from '../types/index'

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref<Article[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const lastFetchTime = ref<number>(0)
  const cacheDuration = 5 * 60 * 1000

  // 所有 md 文件，通过 import.meta.glob 自动收集，新增文章无需手动维护
  const mdModules = {
    ...import.meta.glob('../pages/post/*.md', { query: '?raw', import: 'default', eager: false }),
    ...import.meta.glob('../pages/log/*.md', { query: '?raw', import: 'default', eager: false }),
    ...import.meta.glob('../pages/project/*.md', { query: '?raw', import: 'default', eager: false }),
  }

  const totalArticles = computed<number>(() => articles.value.length)
  const latestArticles = computed<Article[]>(() => articles.value.slice(0, 5))
  const hasArticles = computed<boolean>(() => articles.value.length > 0)

  const fetchArticles = async (force: boolean = false): Promise<Article[]> => {
    const now = Date.now()
    if (!force && articles.value.length > 0 && (now - lastFetchTime.value) < cacheDuration) {
      return articles.value
    }
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch('/config/search.json')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      articles.value = await response.json()
      lastFetchTime.value = now
      return articles.value
    } catch (err: any) {
      error.value = err.message || 'Failed to load articles'
      return []
    } finally {
      isLoading.value = false
    }
  }

  const getArticleById = async (id: string): Promise<Article | null> => {
    const articles = await fetchArticles()
    return articles.find(article => article.id === id) || null
  }

  const getArticlesByTag = async (tag: string): Promise<Article[]> => {
    const articles = await fetchArticles()
    return articles.filter(article => article.tags?.includes(tag))
  }

  const getArticlesByCategory = async (category: string): Promise<Article[]> => {
    const articles = await fetchArticles()
    return articles.filter(article => article.category === category)
  }

  /**
   * 根据 id 加载对应 md 文件的原始内容
   * 文件命名规则：
   *   数字 id (0,1,2...)  -> pages/post/post-{id}.md
   *   字符串 id           -> pages/post/{id}.md
   *   changelog           -> pages/log/changelog.md
   *   project-N           -> pages/project/project-{N}.md
   */
  const loadMarkdown = async (id: string): Promise<string | null> => {
    const candidates = [
      `../pages/post/post-${id}.md`,
      `../pages/post/${id}.md`,
      `../pages/project/${id}.md`,
      `../pages/log/${id}.md`,
    ]

    for (const path of candidates) {
      if (mdModules[path as keyof typeof mdModules]) {
        try {
          return await (mdModules[path as keyof typeof mdModules]())
        } catch (err) {
          console.error(`[articlesStore] 加载文件失败 ${path}:`, err)
        }
      }
    }
    return null
  }

  const clearArticles = (): void => {
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
