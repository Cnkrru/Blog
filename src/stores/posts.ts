/**
 * 视图层 Store — 当前文章详情、上/下篇导航、项目详情加载
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useArticlesStore } from './articles'
import type { Article } from '../types/index'

export const usePostsStore = defineStore('posts', () => {
  const currentPost = ref<Article | null>(null)
  const previousPost = ref<Article | null>(null)
  const nextPost = ref<Article | null>(null)
  const isPostLoading = ref<boolean>(false)
  const postError = ref<string | null>(null)
  const markdownContent = ref<string>('')

  const fetchPost = async (id: string): Promise<Article | null> => {
    isPostLoading.value = true
    postError.value = null
    try {
      const articlesStore = useArticlesStore()
      const article = await articlesStore.getArticleById(id)
      currentPost.value = article
      if (article) {
        const md = await articlesStore.loadMarkdown(id)
        markdownContent.value = md || ''
      }
      return article
    } catch (error: any) {
      postError.value = error.message || 'Failed to load post'
      return null
    } finally {
      isPostLoading.value = false
    }
  }

  const fetchProject = async (id: string): Promise<any> => {
    isPostLoading.value = true
    postError.value = null
    try {
      const response = await fetch('/config/projects.json')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const projects = await response.json()
      const project = projects.find((p: any) => p.id === id)
      currentPost.value = project || null
      return project || null
    } catch (error: any) {
      postError.value = error.message || 'Failed to load project'
      return null
    } finally {
      isPostLoading.value = false
    }
  }

  const setNavigation = (prev: Article | null, next: Article | null): void => {
    previousPost.value = prev
    nextPost.value = next
  }

  const setMarkdownContent = (content: string): void => {
    markdownContent.value = content
  }

  const clearCurrentPost = (): void => {
    currentPost.value = null
    previousPost.value = null
    nextPost.value = null
    postError.value = null
    markdownContent.value = ''
  }

  return {
    currentPost,
    previousPost,
    nextPost,
    isPostLoading,
    postError,
    markdownContent,
    fetchPost,
    fetchProject,
    setNavigation,
    setMarkdownContent,
    clearCurrentPost
  }
})
