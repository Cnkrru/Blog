<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useArticlesStore } from '../../stores'

const props = defineProps<{ show?: boolean }>()

const emit = defineEmits<{ 'update:show': [show: boolean] }>()

const router = useRouter()
const articlesStore = useArticlesStore()

const searchKeyword = ref('')
const sortBy = ref('id')
const sortOrder = ref<'asc' | 'desc'>('desc')

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
  await articlesStore.fetchArticles()
}

const toggleMenu = () => {
  emit('update:show', !props.show)
}

const navigateToPost = (postId: string) => {
  router.push(`/post/${postId}`)
  emit('update:show', false)
}

const handleSortChange = (newSortBy: string) => {
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

const getSortIcon = (sortType: string) => {
  if (sortBy.value !== sortType) return ''
  return sortOrder.value === 'desc' ? '↓' : '↑'
}

onMounted(() => {
  loadPosts()
})
</script>

<template>
  <div class="post-menu-container">
    <!-- 文章菜单按钮 -->
    <div class="post-menu-btn-container">
      <button class="post-menu-btn" @click="toggleMenu">
        <img src="../../assets/imgs/svg/menu.svg" alt="" width="18" height="18">
      </button>
    </div>

    <!-- 文章菜单卡片 -->
    <Teleport to="body">
    <div class="post-menu-card" :class="{ active: show }">
      <div class="post-menu-card-header">
        <h3>文章菜单</h3>
        <button class="post-menu-close-btn" @click="toggleMenu">
          <img src="../../assets/imgs/svg/close.svg" alt="" width="20" height="20">
        </button>
      </div>
      <div class="post-menu-card-content">
        <!-- 搜索和排序 -->
        <div class="post-menu-controls">
          <div class="search-box">
            <input
              type="text"
              v-model="searchKeyword"
              placeholder="搜索文章..."
              class="menu-search-input"
            />
            <button v-if="searchKeyword" @click="clearSearch" class="menu-clear-search-btn">
              ×
            </button>
          </div>
          <div class="sort-controls">
            <button 
              @click="handleSortChange('id')"
              class="sort-btn" 
              :class="{ active: sortBy === 'id' }"
            >
              ID {{ getSortIcon('id') }}
            </button>
            <button 
              @click="handleSortChange('title')"
              class="sort-btn" 
              :class="{ active: sortBy === 'title' }"
            >
              标题 {{ getSortIcon('title') }}
            </button>
          </div>
        </div>
        
        <!-- 文章列表 -->
        <ul class="post-list">
          <li 
            v-for="(post, index) in posts" 
            :key="post.id"
            class="post-list-item"
            @click="navigateToPost(post.id)"
          >
            <span class="post-id">#{{ index + 1 }}</span>
            <span class="post-title">{{ post.title }}</span>
            <span class="post-date">{{ post.date }}</span>
          </li>
        </ul>
      </div>
    </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ============================== 卡片容器 ============================== */
.post-menu-card {
    position: fixed;
    top: 50%;
    right: 0;
    transform: translate(100%, -50%);
    width: 300px;
    max-height: 70vh;
    border-right: none;
    border-radius: 16px 0 0 16px;
    z-index: 999;
    overflow: hidden;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    background-color: rgba(var(--glass-r), var(--glass-g), var(--glass-b), var(--glass-alpha));
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid var(--common-shadow);
    box-shadow: -8px 0 40px var(--common-shadow);
}

.post-menu-card.active {
    transform: translate(0, -50%);
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from { transform: translate(100%, -50%); opacity: 0; }
    to   { transform: translate(0, -50%);     opacity: 1; }
}

/* ============================== 卡片头部 ============================== */
.post-menu-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    border-bottom: 1px solid var(--common-shadow);
}

.post-menu-card-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--common-text);
}

.post-menu-close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: var(--common-shadow);
    border: none;
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.2s ease, transform 0.2s ease;
}

.post-menu-close-btn:hover {
    transform: rotate(90deg);
}

.post-menu-close-btn img {
    filter: brightness(0) invert(1);
    opacity: 0.8;
}

/* ============================== 卡片内容 ============================== */
.post-menu-card-content {
    padding: 15px 20px;
    max-height: calc(70vh - 60px);
    overflow-y: auto;
    color: var(--common-text);
}

.post-menu-controls {
    margin-bottom: 16px;
}

/* 搜索框 */
.search-box {
    position: relative;
    margin-bottom: 12px;
}

.menu-search-input {
    width: 100%;
    padding: 8px 32px 8px 12px;
    border-radius: 10px;
    font-size: 14px;
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) - 0.15));
    color: var(--common-text);
    border: 1px solid var(--common-shadow);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.menu-search-input::placeholder { color: var(--common-text); opacity: 0.4; }

.menu-search-input:focus {
    outline: none;
    border-color: var(--common-color-1);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--common-color-1) 20%, transparent);
}

.menu-clear-search-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--common-text);
    opacity: 0.5;
    transition: opacity 0.15s ease;
}

.menu-clear-search-btn:hover { opacity: 1; }

/* 排序按钮 */
.sort-controls {
    display: flex;
    gap: 8px;
}

.sort-btn {
    flex: 1;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 12px;
    cursor: pointer;
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) - 0.15));
    color: var(--common-text);
    border: 1px solid var(--common-shadow);
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.sort-btn:hover {
    border-color: var(--common-color-1);
    color: var(--common-color-1);
}

.sort-btn.active {
    background: var(--common-color-1);
    color: var(--common-content);
    border-color: var(--common-color-1);
}

/* ============================== 文章列表 ============================== */
.post-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.post-list-item {
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: 8px;
    margin-bottom: 4px;
    animation: fadeIn 0.3s ease;
    transition: background-color 0.15s ease, transform 0.15s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
}

.post-list-item:hover {
    transform: translateX(-4px);
    background: color-mix(in srgb, var(--common-color-1) 10%, transparent);
}

.post-id {
    font-weight: 600;
    margin-right: 10px;
    font-size: 13px;
    min-width: 30px;
    color: var(--common-color-1);
    opacity: 0.7;
}

.post-title {
    flex: 1;
    font-size: 14px;
    line-height: 1.5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--common-text);
}

.post-date {
    font-size: 11px;
    margin-left: 10px;
    white-space: nowrap;
    color: var(--common-text);
    opacity: 0.4;
}

/* ============================== 菜单按钮 ============================== */
.post-menu-btn-container {
    display: flex;
    align-items: center;
}

.post-menu-btn {
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
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.post-menu-btn img {
    filter: brightness(0) invert(1);
}

.post-menu-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--common-color-1) 35%, transparent);
}
</style>

<style scoped>
@media (max-width: 639px) {
    .post-menu-card {
        width: 240px;
        max-height: 60vh;
    }
    .post-menu-card-header { padding: 12px 16px; }
    .post-menu-card-header h3 { font-size: 14px; }
    .post-menu-card-content {
        padding: 12px 16px;
        max-height: calc(60vh - 50px);
    }
    .post-list-item { padding: 6px 10px; }
    .post-id { font-size: 12px; min-width: 25px; }
    .post-title { font-size: 13px; }
    .post-date { font-size: 10px; }
}

@media (max-width: 768px) {
    .post-menu-card { width: 260px; }
}

@media (max-width: 1024px) {
    .post-menu-card { width: 280px; }
}
</style>
