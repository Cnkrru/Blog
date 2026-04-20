<script setup>
import { ref, onMounted } from 'vue'
import MarkdownRenderer from '../../MarkdownRenderer.vue'
import { useArticlesStore } from '../../../stores/articles'

const store = useArticlesStore()

const props = defineProps({
  projectId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['project-loaded', 'loading', 'error'])

const project = ref(null)
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

const loadProject = async () => {
  emit('loading', true)
  try {
    const res = await fetch('/config/projects.json')
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    const data = await res.json()
    const foundProject = data.find(item => item.id === props.projectId)

    if (!foundProject) {
      error.value = '项目不存在'
      emit('error', error.value)
      return
    }

    project.value = foundProject
    emit('project-loaded', foundProject)

    const mdText = await store.loadMarkdown(`project-${props.projectId}`)

    if (!mdText) {
      error.value = '加载项目内容失败：文件未找到'
      emit('error', error.value)
      return
    }

    const { frontmatter, content } = parseFrontmatter(mdText)
    project.value = { ...foundProject, ...frontmatter }
    markdownContent.value = content
  } catch (err) {
    error.value = '加载项目失败'
    emit('error', error.value)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

onMounted(() => loadProject())
</script>

<template>
  <div class="project-loader">
    <div v-if="loading" class="loading-message"><p>加载中...</p></div>
    <div v-else-if="error" class="error-message"><p>{{ error }}</p></div>
    <div v-else-if="project" class="project-content">
      <div class="text-style">
        <p>项目名称：{{ project.name }}</p>
        <p>分类：{{ project.category }}</p>
        <p>编号：{{ project.id }}</p>
        <hr>
        <p>项目描述：{{ project.description }}</p>
        <hr>
        <MarkdownRenderer :content="markdownContent" />
      </div>
    </div>
  </div>
</template>
