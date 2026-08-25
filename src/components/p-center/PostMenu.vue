<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useArticlesStore } from '../../stores'
import menuSvg from '@/assets/svg/menu.svg?raw'
import xSvg from '@/assets/svg/x.svg?raw'
import listSvg from '@/assets/svg/list.svg?raw'
import searchSvg from '@/assets/svg/search.svg?raw'

const props = defineProps(['show'])

const emit = defineEmits(['update:show'])

const router = useRouter()
const articlesStore = useArticlesStore()

const searchKeyword = ref('')
const sortBy = ref('id')
const sortOrder = ref('desc')

const filteredPosts = computed(() => {
  let result = [...articlesStore.articles]
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(post => 
      post.title.toLowerCase().includes(keyword) ||
      post.tags?.some(tag => tag.toLowerCase().includes(keyword))
    )
  }
  
  result.sort((a, b) => {
    let comparison = 0
    if (sortBy.value === 'id') {
      comparison = Number(a.id) - Number(b.id)
    } else if (sortBy.value === 'title') {
      comparison = a.title.localeCompare(b.title, 'zh-CN')
    }
    return sortOrder.value === 'desc' ? -comparison : comparison
  })
  
  return result
})

const posts = computed(() => filteredPosts.value)

const loadPosts = async () => {
  try {
    await articlesStore.fetchArticles()
  } catch (e) {
    console.error('加载文章失败:', e)
  }
}

const toggleMenu = () => {
  emit('update:show', !props.show)
}

const navigateToPost = (postId) => {
  router.push(`/post/${postId}`)
  emit('update:show', false)
}

const handleSortChange = (newSortBy) => {
  if (sortBy.value === newSortBy) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = newSortBy
    sortOrder.value = 'desc'
  }
}

const clearSearch = () => {
  searchKeyword.value = ''
}

const getSortIcon = (sortType) => {
  if (sortBy.value !== sortType) return ''
  return sortOrder.value === 'desc' ? '↓' : '↑'
}

onMounted(() => {
  loadPosts()
})
</script>

<template>
  <div class="menu-wrap">
    <!-- 文章菜单按钮 -->
    <div class="menu-toggle">
      <button class="menu-btn" @click="toggleMenu" :title="show ? '关闭菜单' : '文章菜单'" aria-label="文章菜单">
        <span
          v-if="!show"
          class="svg-icon btn-icon"
          :style="{ width: '18px', height: '18px' }"
          v-html="menuSvg"
        ></span>
        <span
          v-else
          class="svg-icon btn-icon"
          :style="{ width: '16px', height: '16px' }"
          v-html="xSvg"
        ></span>
      </button>
    </div>

    <!-- 文章菜单卡片 -->
    <Teleport to="body">
      <div class="menu-card" :class="{ active: show }">
        <!-- 头部 -->
        <div class="menu-header">
          <div class="menu-title">
            <span class="svg-icon menu-icon" :style="{ width: '16px', height: '16px' }" v-html="listSvg"></span>
            <h3>文章菜单</h3>
            <span class="menu-count">{{ posts.length }}</span>
          </div>
          <button class="menu-close" @click="toggleMenu" title="关闭" aria-label="关闭菜单">
            <span class="svg-icon" :style="{ width: '14px', height: '14px' }" v-html="xSvg"></span>
          </button>
        </div>

        <div class="menu-line"></div>

        <!-- 搜索和排序 -->
        <div class="menu-actions">
          <!-- 搜索框 -->
          <div class="search-box">
            <span class="svg-icon search-icon" :style="{ width: '14px', height: '14px' }" v-html="searchSvg"></span>
            <input
              type="text"
              v-model="searchKeyword"
              placeholder="搜索文章标题或标签..."
              class="search-input text-input"
            />
            <button v-if="searchKeyword" @click="clearSearch" class="search-clear" title="清除" aria-label="清除搜索">
              <span class="svg-icon" :style="{ width: '12px', height: '12px' }" v-html="xSvg"></span>
            </button>
          </div>

          <!-- 排序按钮 -->
          <div class="sort-controls">
            <button
              @click="handleSortChange('id')"
              class="sort-btn"
              :class="{ active: sortBy === 'id' }"
              aria-label="按ID排序"
            >
              ID {{ getSortIcon('id') }}
            </button>
            <button
              @click="handleSortChange('title')"
              class="sort-btn"
              :class="{ active: sortBy === 'title' }"
              aria-label="按标题排序"
            >
              标题 {{ getSortIcon('title') }}
            </button>
          </div>
        </div>

        <div class="menu-line"></div>

        <!-- 文章列表 -->
        <div class="menu-body">
          <ul class="post-list">
            <li
              v-for="(post, index) in posts"
              :key="post.id"
              class="list-item"
              @click="navigateToPost(post.id)"
            >
              <span class="post-index">{{ index + 1 }}</span>
              <div class="post-info">
                <span class="post-title">{{ post.title }}</span>
                <div class="post-meta">
                  <span class="post-date">{{ post.date }}</span>
                  <span v-if="post.category" class="post-category">{{ post.category }}</span>
                </div>
              </div>
            </li>
          </ul>
          <div v-if="!posts.length" class="post-empty">
            <span class="svg-icon" :style="{ width: '20px', height: '20px' }" v-html="searchSvg"></span>
            <span>没有匹配的文章</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ============================== 卡片容器 ============================== */
.menu-card {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translate(100%, -50%);
  width: 300px;
  max-height: 70vh;
  border-radius: 12px 0 0 12px;
  z-index: 999;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.92);
  backdrop-filter: blur(20px) saturate(170%);
  -webkit-backdrop-filter: blur(20px) saturate(170%);
  border: 1px solid var(--common-shadow);
  border-right: none;
  box-shadow: -4px 0 28px color-mix(in srgb, var(--common-shadow) 50%, transparent);
}

.menu-card.active {
  transform: translate(0, -50%);
}

/* ============================== 卡片头部 ============================== */
.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 10px;
  user-select: none;
}

.menu-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-icon {
  color: var(--common-text);
  opacity: 0.5;
  flex-shrink: 0;
}

.menu-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--common-text);
  letter-spacing: 0.3px;
}

.menu-count {
  font-size: 10px;
  font-weight: 500;
  padding: 1px 6px;
  border-radius: 8px;
  color: var(--common-text);
  opacity: 0.5;
  background: color-mix(in srgb, var(--common-text) 8%, transparent);
  line-height: 1.5;
}

.menu-close {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--common-text);
  opacity: 0.45;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s ease, background-color 0.15s ease, transform 0.2s ease;
}

.menu-close:hover {
  opacity: 0.8;
  background: color-mix(in srgb, var(--common-text) 6%, transparent);
  transform: rotate(90deg);
}

.menu-line {
  height: 1px;
  background: color-mix(in srgb, var(--common-text) 8%, transparent);
  margin: 0 16px;
}

/* ============================== 搜索和排序 ============================== */
.menu-actions {
  padding: 10px 16px;
}

/* 搜索框 */
.search-box {
  position: relative;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--common-text);
  opacity: 0.35;
  pointer-events: none;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  padding: 7px 32px 7px 32px;
  border-radius: 8px;
  font-size: 13px;
  background: color-mix(in srgb, var(--common-text) 5%, transparent);
  color: var(--common-text);
  border: 1px solid transparent;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  outline: none;
}

.search-input::placeholder {
  color: var(--common-text);
  opacity: 0.3;
}

.search-input:focus {
  border-color: color-mix(in srgb, var(--common-color-1) 40%, transparent);
  background: color-mix(in srgb, var(--common-text) 3%, transparent);
}

.search-clear {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: var(--common-text);
  opacity: 0.35;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s ease, background-color 0.15s ease;
}

.search-clear:hover {
  opacity: 0.8;
  background: color-mix(in srgb, var(--common-text) 6%, transparent);
}

/* 排序按钮 */
.sort-controls {
  display: flex;
  gap: 6px;
}

.sort-btn {
  flex: 1;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  background: color-mix(in srgb, var(--common-text) 5%, transparent);
  color: var(--common-text);
  border: 1px solid transparent;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  opacity: 0.7;
}

.sort-btn:hover {
  opacity: 1;
  border-color: color-mix(in srgb, var(--common-color-1) 30%, transparent);
  color: var(--common-color-1);
}

.sort-btn.active {
  background: var(--common-color-1);
  color: var(--common-content);
  border-color: var(--common-color-1);
  opacity: 1;
  font-weight: 500;
}

/* ============================== 文章列表 ============================== */
.menu-body {
  padding: 0 0 6px;
  max-height: calc(70vh - 130px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--common-text) 12%, transparent) transparent;
}

.menu-body::-webkit-scrollbar {
  width: 4px;
}

.menu-body::-webkit-scrollbar-track {
  background: transparent;
}

.menu-body::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--common-text) 12%, transparent);
  border-radius: 2px;
}

.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  padding: 9px 16px;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 0 6px;
  border-radius: 8px;
  animation: fadeIn 0.3s ease;
  transition: background-color 0.15s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.list-item:hover {
  background: color-mix(in srgb, var(--common-color-1) 8%, transparent);
}

.post-index {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--common-color-1);
  background: color-mix(in srgb, var(--common-color-1) 10%, transparent);
  margin-top: 2px;
}

.post-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.post-title {
  font-size: 13px;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--common-text);
  font-weight: 500;
}

.list-item:hover .post-title {
  color: var(--common-color-1);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.post-date {
  font-size: 11px;
  color: var(--common-text);
  opacity: 0.4;
  flex-shrink: 0;
}

.post-category {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  color: var(--common-color-1);
  background: color-mix(in srgb, var(--common-color-1) 10%, transparent);
  flex-shrink: 0;
  line-height: 1.5;
}

/* 空状态 */
.post-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 0;
  color: var(--common-text);
  opacity: 0.3;
  font-size: 13px;
}

/* ============================== 菜单按钮 ============================== */
.menu-toggle {
  display: flex;
  align-items: center;
}

.menu-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--common-color-1);
  border: 1px solid var(--common-color-1);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--common-color-1) 30%, transparent);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, background-color 0.2s ease;
}

.btn-icon {
  color: #fff;
}

.menu-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--common-color-1) 40%, transparent);
}

.menu-btn:active {
  transform: scale(0.95);
}

/* ============================== 响应式 ============================== */
@media (max-width: 640px) {
  .menu-card {
    width: 260px;
    max-height: 60vh;
  }
  .menu-header { padding: 10px 14px 8px; }
  .menu-header h3 { font-size: 13px; }
  .menu-actions { padding: 8px 14px; }
  .menu-body { max-height: calc(60vh - 120px); }
  .list-item { padding: 7px 14px; }
  .post-title { font-size: 12px; }
  .menu-btn { width: 32px; height: 32px; }
}

@media (max-width: 768px) {
  .menu-card { width: 280px; }
}

@media (max-width: 1024px) {
  .menu-card { width: 290px; }
}
</style>