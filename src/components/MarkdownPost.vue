<template>
  <div class="markdown-post">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <article v-else-if="post">
      <header class="post-header">
        <div class="post-header-top">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-header-buttons">
            <!-- 这里将放置返回顶部、菜单、目录按钮 -->
          </div>
        </div>
        <div class="post-meta">
          <span class="post-date">{{ post.date }}</span>
          <span class="post-category">{{ post.category }}</span>
          <div class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
          </div>
        </div>
      </header>
      <div class="post-content">
        <MarkdownRenderer :content="post.content" />
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownRenderer from '../components/functions/center/MarkdownRenderer.vue'

const route = useRoute()
const loading = ref(true)
const error = ref(null)
const post = ref({
  title: '',
  date: '',
  category: '',
  tags: [],
  content: ''
})

const parseFrontmatter = (content) => {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  let frontmatter = {}
  let markdownContent = content

  if (frontmatterMatch) {
    const frontmatterText = frontmatterMatch[1]
    markdownContent = content.replace(frontmatterMatch[0], '')

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

  return { frontmatter, content: markdownContent.trim() }
}

const loadPost = async () => {
  loading.value = true
  error.value = null

  try {
    const postId = route.params.id || route.query.id
    const response = await fetch(`/html/posts/post-${postId}.md`)

    if (!response.ok) {
      throw new Error('文章不存在')
    }

    const content = await response.text()
    const { frontmatter, content: markdownContent } = parseFrontmatter(content)

    post.value = {
      title: frontmatter.title || '无标题',
      date: frontmatter.date || new Date().toLocaleDateString(),
      category: frontmatter.category || '未分类',
      tags: frontmatter.tags || [],
      content: markdownContent
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPost()
})
</script>

<style scoped>
.markdown-post {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 10px var(--shadow-color);
}

.loading,
.error {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: var(--text-color);
}

.error {
  color: #dc3545;
}

.post-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.post-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.post-title {
  font-size: 2.5em;
  margin: 0;
  color: var(--center-card-title-color);
  font-weight: 600;
  line-height: 1.3;
  flex: 1;
}

.post-header-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px;
  font-size: 14px;
  color: var(--text-secondary);
}

.post-date {
  color: var(--text-secondary);
}

.post-category {
  background: var(--primary-color);
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.post-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.post-tag {
  background: var(--tag-bg);
  color: var(--text-secondary);
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid var(--border-color);
}

.post-content {
  color: var(--text-color);
  line-height: 1.8;
}

/*==============================响应式设计==============================*/
/* 超小屏手机 (＜576px) */
@media (max-width: 575.98px) {
  .markdown-post {
    padding: 20px 15px;
  }

  .post-header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .post-title {
    font-size: 1.8em;
  }

  .post-header-buttons {
    width: 100%;
    justify-content: space-between;
  }

  .post-meta {
    font-size: 12px;
    gap: 10px;
  }
}

/* 小屏手机横屏及以上 (≥576px) */
@media (min-width: 576px) {
  .markdown-post {
    padding: 30px 20px;
  }

  .post-header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .post-title {
    font-size: 2.2em;
  }

  .post-header-buttons {
    width: 100%;
    justify-content: flex-end;
  }
}

/* 平板及以上 (≥768px) */
@media (min-width: 768px) {
  .markdown-post {
    padding: 40px 30px;
  }

  .post-header-top {
    flex-direction: row;
    align-items: center;
  }

  .post-title {
    font-size: 2.5em;
  }

  .post-header-buttons {
    width: auto;
    justify-content: flex-end;
  }
}
</style>