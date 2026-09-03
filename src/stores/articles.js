// 用在ContentRender、ArticleCount、PostMenu、RelatedArticles、Search、Archives、Home、Tag和useContentLoader
/**
 * 数据源 Store — 加载文章列表、获取 Markdown 文件、按标签/分类筛选
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

// 读取 public/config 下的 JSON：SSR 构建期用 fs（axios 相对路径在 Node 下不可用），客户端用 axios
export async function readPublicJson(path) {
  if (typeof window === 'undefined') {
    const { readFileSync } = await import('node:fs')
    const { resolve } = await import('node:path')
    return JSON.parse(readFileSync(resolve(process.cwd(), 'public', path), 'utf8'))
  }
  const { data } = await axios.get(`/${path}`)
  return data
}

// 读取 public 下的文本文件（预渲染 HTML）：SSR 用 fs，客户端用 axios
export async function readPublicText(path) {
  if (typeof window === 'undefined') {
    const { readFileSync } = await import('node:fs')
    const { resolve } = await import('node:path')
    return readFileSync(resolve(process.cwd(), 'public', path), 'utf8')
  }
  const { data } = await axios.get(`/${path}`)
  return data
}

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const lastFetchTime = ref(0)
  const cacheDuration = 5 * 60 * 1000

  const totalArticles = computed(() => articles.value.length)
  const hasArticles = computed(() => articles.value.length > 0)

  const fetchArticles = async (force = false) => {
    const now = Date.now()
    if (!force && articles.value.length > 0 && (now - lastFetchTime.value) < cacheDuration) {
      return articles.value
    }
    isLoading.value = true
    error.value = null
    try {
      articles.value = await readPublicJson('config/search.json')
      lastFetchTime.value = now
      return articles.value
    } catch (err) {
      error.value = err.message || 'Failed to load articles'
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    articles,
    isLoading,
    error,
    lastFetchTime,
    cacheDuration,
    totalArticles,
    hasArticles,
    fetchArticles
  }
})