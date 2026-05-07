import { ref, computed } from 'vue'
import { useContentStore, useArticlesStore } from '../stores/index'
import { parseFrontmatter } from '../utils/markdown'

export function useContentLoader(type, id) {
  const contentStore = useContentStore()
  const articlesStore = useArticlesStore()
  
  const content = ref(null)
  const markdownContent = ref('')
  const loading = ref(true)
  const error = ref(null)
  const retryCount = ref(0)

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)
  const isLoaded = computed(() => content.value !== null && !loading.value && !error.value)

  const loadContent = async () => {
    loading.value = true
    error.value = null
    retryCount.value = 0

    try {
      // 首先检查缓存
      const cachedContent = contentStore.getContent(type, id)
      if (cachedContent) {
        content.value = cachedContent
        markdownContent.value = cachedContent.markdownContent || ''
        loading.value = false
        return
      }

      let itemData = null

      switch (type) {
        case 'post':
          // 从 articles store 获取文章数据
          const searchData = await articlesStore.fetchArticles()
          itemData = searchData.find(item => item.id === id)
          
          // 尝试加载 markdown 内容，即使在 search.json 中找不到
          const mdText = await articlesStore.loadMarkdown(id)
          if (mdText) {
            const { frontmatter, content: mdContent } = parseFrontmatter(mdText)
            content.value = {
              ...(itemData || {}),
              ...frontmatter,
              id: id,
              tags: frontmatter.tags || (itemData ? itemData.tags : [])
            }
            markdownContent.value = mdContent
            
            // 保存到缓存
            contentStore.setContent(type, id, {
              ...content.value,
              markdownContent: mdContent
            })
          } else {
            throw new Error('Failed to load markdown content')
          }
          break

        case 'project':
          // 加载项目数据
          const projectRes = await fetch('/config/projects.json')
          if (!projectRes.ok) {
            throw new Error(`HTTP ${projectRes.status}`)
          }
          const projectData = await projectRes.json()
          itemData = projectData.find(item => item.id === id)
          
          if (itemData) {
            // 尝试加载 markdown 内容
            try {
              const mdText = await articlesStore.loadMarkdown(`project-${id}`)
              if (mdText) {
                const { frontmatter, content: mdContent } = parseFrontmatter(mdText)
                content.value = { ...itemData, ...frontmatter }
                markdownContent.value = mdContent
              } else {
                content.value = itemData
              }
            } catch (mdError) {
              // 没有 markdown 文件也不报错
              content.value = itemData
            }
            
            // 保存到缓存
            contentStore.setContent(type, id, {
              ...content.value,
              markdownContent: markdownContent.value
            })
          } else {
            throw new Error('Project not found')
          }
          break

        default:
          throw new Error('Invalid content type')
      }
    } catch (err) {
      error.value = err.message
      contentStore.setError(type, id, err.message)
    } finally {
      loading.value = false
      contentStore.setLoading(type, id, false)
    }
  }

  const retry = () => {
    if (retryCount.value < 3) {
      retryCount.value++
      loadContent()
    }
  }

  const clearCache = () => {
    contentStore.clearCache(type, id)
  }

  return {
    content,
    markdownContent,
    loading: isLoading,
    error: hasError,
    isLoaded,
    loadContent,
    retry,
    clearCache
  }
}