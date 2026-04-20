<script setup>
import { ref, onMounted } from 'vue'
import MarkdownRenderer from '../../MarkdownRenderer.vue'
import { useArticlesStore } from '../../../stores/articles'

const store = useArticlesStore()

const props = defineProps({
  toolId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['tool-loaded', 'loading', 'error'])

const tool = ref(null)
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
        frontmatter[key.trim()] = value.trim().replace(/["']/g, '')
      }
    })
  }

  return { frontmatter, content: markdown }
}

const loadTool = async () => {
  emit('loading', true)
  try {
    const res = await fetch('/config/tools.json')
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    const data = await res.json()
    const foundTool = data.find(item => item.id === props.toolId)

    if (!foundTool) {
      error.value = '工具不存在'
      emit('error', error.value)
      return
    }

    tool.value = foundTool
    emit('tool-loaded', foundTool)

    // 通过 store glob map 加载 md（如果有对应文件）
    const mdText = await store.loadMarkdown(`tool-${props.toolId}`)
    if (mdText) {
      const { frontmatter, content } = parseFrontmatter(mdText)
      tool.value = { ...foundTool, ...frontmatter }
      markdownContent.value = content
    }
  } catch (err) {
    error.value = '加载工具失败'
    emit('error', error.value)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

onMounted(() => loadTool())
</script>

<template>
  <div class="tool-loader">
    <div v-if="loading" class="loading-message">
      <p>加载中...</p>
    </div>
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="tool" class="tool-content">
      <div class="text-style">
        <p>工具名称：{{ tool.name }}</p>
        <p>分类：{{ tool.category }}</p>
        <p>编号：{{ tool.id }}</p>
        <hr>
        <p>工具描述：{{ tool.description }}</p>
        <hr>
        <MarkdownRenderer v-if="markdownContent" :content="markdownContent" />
      </div>
    </div>
  </div>
</template>
