<script setup>
import { ref, onMounted, watch } from 'vue'
import MarkdownRenderer from '../../MarkdownRenderer.vue'
import { useI18n } from 'vue-i18n'
import { useArticlesStore } from '../../../stores/articles'

const { t } = useI18n()
const store = useArticlesStore()

const props = defineProps({
  postId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['post-loaded', 'loading', 'error', 'prev-next-posts', 'update:toc'])

const post = ref(null)
const markdownContent = ref('')
const loading = ref(true)
const error = ref(null)

const parseFrontmatter = (content) => {
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

const loadPost = async () => {
  loading.value = true
  error.value = null
  emit('loading', true)

  try {
    // 从 store 获取（有缓存则不重复请求）
    const searchData = await store.fetchArticles()
    const foundPost = searchData.find(item => item.id === props.postId)

    if (!foundPost) {
      error.value = 'Article not found'
      emit('error', 'Article not found')
      return
    }

    // 上下篇
    const postIndex = searchData.findIndex(item => item.id === props.postId)
    const prevPost = postIndex > 0 ? searchData[postIndex - 1] : null
    const nextPost = postIndex < searchData.length - 1 ? searchData[postIndex + 1] : null

    // 通过 store 的 glob map 加载 md
    const mdText = await store.loadMarkdown(props.postId)

    if (!mdText) {
      error.value = 'Failed to load article content: File not found'
      emit('error', error.value)
      return
    }

    const { frontmatter, content } = parseFrontmatter(mdText)
    post.value = {
      ...foundPost,
      ...frontmatter,
      tags: frontmatter.tags || foundPost.tags || []
    }
    markdownContent.value = content

    emit('post-loaded', post.value)
    emit('prev-next-posts', { prevPost, nextPost })
  } catch (err) {
    error.value = 'Failed to load article: ' + err.message
    emit('error', error.value)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

onMounted(() => loadPost())
watch(() => props.postId, () => loadPost())
</script>

<template>
  <div class="post-loader">
    <div v-if="loading" class="loading-message">
      <p>Loading...</p>
    </div>
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="post" class="post-content">
      <div class="text-style">
        <MarkdownRenderer :content="markdownContent" @update:toc="(toc) => emit('update:toc', toc)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-loader { width: 100%; }

.loading-message,
.error-message {
  text-align: center;
  padding: 50px 20px;
  color: var(--text-color);
}

.error-message { color: #dc3545; }
.post-content { width: 100%; }
</style>
