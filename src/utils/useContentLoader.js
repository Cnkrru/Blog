import { ref, computed } from 'vue'
import { useContentStore, useArticlesStore, readPublicJson, readPublicText } from '../stores/index'

export function useContentLoader(type, id) {
  const contentStore = useContentStore()
  const articlesStore = useArticlesStore()
  
  const content = ref(null)
  const html = ref('')
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
        html.value = cachedContent.html || ''
        loading.value = false
        return
      }

      let itemData = null
      let htmlText = ''

      switch (type) {
        case 'post': {
          // 从 articles store 获取文章元数据
          const searchData = await articlesStore.fetchArticles()
          itemData = searchData.find(item => item.id === id)
          // 加载构建期预渲染的静态 HTML
          htmlText = await readPublicText(`html/posts/post-${id}.html`)
          content.value = {
            ...(itemData || {}),
            id: id,
            html: htmlText
          }
          break
        }

        case 'project': {
          // 加载项目元数据
          const projectData = await readPublicJson('config/projects.json')
          itemData = projectData.find(item => item.id === id)
          try {
            htmlText = await readPublicText(`html/projects/project-${id}.html`)
          } catch (mdError) {
            // 没有预渲染 HTML 也不报错，仅展示元数据
            htmlText = ''
          }
          content.value = { ...(itemData || {}), id: id, html: htmlText }
          break
        }

        default:
          throw new Error('Invalid content type')
      }

      html.value = htmlText

      // 保存到缓存
      contentStore.setContent(type, id, {
        ...content.value,
        html: htmlText
      })
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
    html,
    loading: isLoading,
    error: hasError,
    isLoaded,
    loadContent,
    retry,
    clearCache
  }
}
