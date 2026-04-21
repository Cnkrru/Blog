<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePostsStore } from '../../stores'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show'])

const { t } = useI18n()
const router = useRouter()
const postsStore = usePostsStore()

const searchKeyword = ref('')
const sortBy = ref('date')

const posts = computed(() => postsStore.filteredPosts)
const loading = computed(() => postsStore.loading)
const error = computed(() => postsStore.error)

const loadPosts = async () => {
  await postsStore.fetchPosts()
}

const toggleMenu = () => {
  emit('update:show', !props.show)
}

const navigateToPost = (postId) => {
  router.push(`/post/${postId}`)
  emit('update:show', false)
}

const handleSearch = () => {
  postsStore.setSearchKeyword(searchKeyword.value)
}

const handleSortChange = (newSortBy) => {
  if (sortBy.value === newSortBy) {
    postsStore.toggleSortOrder()
  } else {
    sortBy.value = newSortBy
    postsStore.setSortBy(newSortBy)
  }
}

const clearSearch = () => {
  searchKeyword.value = ''
  postsStore.setSearchKeyword('')
}

const getSortIcon = (sortType) => {
  if (sortBy.value !== sortType) return ''
  return postsStore.sortOrder === 'desc' ? '↓' : '↑'
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
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>
        </svg>
        文章菜单
      </button>
    </div>
    
    <!-- 文章菜单卡片 -->
    <div class="post-menu-card" :class="{ active: show }">
      <div class="post-menu-card-header">
        <h3>文章菜单</h3>
        <button class="post-menu-close-btn" @click="toggleMenu">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      <div class="post-menu-card-content">
        <!-- 搜索和排序 -->
        <div class="post-menu-controls">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchKeyword"
              @input="handleSearch"
              placeholder="搜索文章..."
              class="search-input"
            />
            <button v-if="searchKeyword" @click="clearSearch" class="clear-search-btn">
              ×
            </button>
          </div>
          <div class="sort-controls">
            <button 
              @click="handleSortChange('date')"
              class="sort-btn" 
              :class="{ active: sortBy === 'date' }"
            >
              日期 {{ getSortIcon('date') }}
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
        
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-message">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>
        
        <!-- 错误状态 -->
        <div v-else-if="error" class="error-message">
          <p>{{ error }}</p>
          <button @click="loadPosts" class="retry-btn">重试</button>
        </div>
        
        <!-- 文章列表 -->
        <ul v-else-if="posts.length > 0" class="post-list">
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
        
        <!-- 空状态 -->
        <div v-else class="empty-message">
          <p>暂无文章</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 文章菜单卡片 */
.post-menu-card {
    position: fixed;
    top: 50%;
    right: 0;
    transform: translate(100%, -50%);
    width: 300px;
    max-height: 70vh;
    background-color: var(--card-bg);
    border: 2px solid var(--center-card-border-color);
    border-right: none;
    border-radius: 12px 0 0 12px;
    box-shadow: -4px 4px 12px var(--shadow-color);
    z-index: 999;
    overflow: hidden;
    transition: transform 0.3s ease;
}

.post-menu-card.active {
    transform: translate(0, -50%);
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        transform: translate(100%, -50%);
        opacity: 0;
    }
    to {
        transform: translate(0, -50%);
        opacity: 1;
    }
}

/* 文章菜单卡片头部 */
.post-menu-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    border-bottom: 1px solid var(--border-color);
}

.post-menu-card-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    color: var(--center-card-title-color);
}

.post-menu-close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.3s ease;
    color: var(--text-color);
}

.post-menu-close-btn:hover {
    background-color: var(--hover-bg);
}

/* 文章菜单卡片内容 */
.post-menu-card-content {
    padding: 15px 20px;
    max-height: calc(70vh - 60px);
    overflow-y: auto;
}

/* 搜索和排序控件 */
.post-menu-controls {
    margin-bottom: 16px;
}

.search-box {
    position: relative;
    margin-bottom: 12px;
}

.search-input {
    width: 100%;
    padding: 8px 32px 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background-color: var(--input-bg);
    color: var(--text-color);
    font-size: 14px;
    transition: all 0.3s ease;
}

.search-input:focus {
    outline: none;
    border-color: var(--accent-fg);
    box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
}

.clear-search-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 18px;
    cursor: pointer;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.clear-search-btn:hover {
    background-color: var(--hover-bg);
    color: var(--text-color);
}

.sort-controls {
    display: flex;
    gap: 8px;
}

.sort-btn {
    flex: 1;
    padding: 6px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background-color: var(--button-bg);
    color: var(--button-text);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.sort-btn:hover {
    background-color: var(--button-hover-bg);
}

.sort-btn.active {
    background-color: var(--accent-fg);
    color: white;
    border-color: var(--accent-fg);
}

/* 加载状态 */
.loading-message {
    text-align: center;
    padding: 40px 0;
    color: var(--text-secondary);
}

.loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--accent-fg);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* 错误状态 */
.error-message {
    text-align: center;
    padding: 40px 0;
    color: var(--error-color);
}

.retry-btn {
    margin-top: 16px;
    padding: 6px 16px;
    border: 1px solid var(--error-color);
    border-radius: 6px;
    background-color: transparent;
    color: var(--error-color);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.retry-btn:hover {
    background-color: var(--error-color);
    color: white;
}

/* 空状态 */
.empty-message {
    text-align: center;
    padding: 40px 0;
    color: var(--text-secondary);
}

/* 文章列表 */
.post-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.post-list-item {
    padding: 8px 12px;
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    border-radius: 6px;
    margin-bottom: 8px;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.post-list-item:hover {
    background-color: var(--hover-bg);
    transform: translateX(-4px);
}

.post-id {
    color: var(--accent-fg);
    font-weight: bold;
    margin-right: 10px;
    font-size: 14px;
    min-width: 30px;
}

.post-title {
    flex: 1;
    color: var(--text-color);
    font-size: 14px;
    line-height: 1.5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.post-date {
    color: var(--text-secondary);
    font-size: 12px;
    margin-left: 10px;
    white-space: nowrap;
}

/* 文章菜单按钮容器 */
.post-menu-btn-container {
    display: flex;
    align-items: center;
}

/* 文章菜单按钮 */
.post-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    background-color: var(--button-bg);
    border: 2px solid var(--button-border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--button-text);
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 2px 8px var(--shadow-color);
}

.post-menu-btn:hover {
    background-color: var(--button-hover-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-color);
}

.post-menu-btn svg {
    width: 18px;
    height: 18px;
    margin-right: 6px;
}

/* 文章菜单滚动条样式 */
.post-menu-card-content::-webkit-scrollbar {
    width: 6px;
}

.post-menu-card-content::-webkit-scrollbar-track {
    background: transparent;
}

.post-menu-card-content::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 3px;
}

.post-menu-card-content::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover);
}

/*==============================响应式设计查询=============================*/
/* 超小屏手机76px) */
@media (max-width: 575.98px) {
    /* 调整文章菜单卡片 */
    .post-menu-card {
        width: 240px;
        max-height: 60vh;
    }
    
    .post-menu-card-header {
        padding: 12px 16px;
    }
    
    .post-menu-card-header h3 {
        font-size: 14px;
    }
    
    .post-menu-card-content {
        padding: 12px 16px;
        max-height: calc(60vh - 50px);
    }
    
    .post-list-item {
        padding: 6px 10px;
    }
    
    .post-id {
        font-size: 13px;
        min-width: 25px;
    }
    
    .post-title {
        font-size: 13px;
    }
    
    .post-date {
        font-size: 11px;
    }
    
    .post-menu-btn {
        font-size: 12px;
        padding: 6px 12px;
    }
    
    .post-menu-btn svg {
        width: 16px;
        height: 16px;
    }
}

/* 小屏手机横屏及以上 (76px) */
@media (min-width: 576px) {
    /* 调整文章菜单卡片 */
    .post-menu-card {
        width: 260px;
        max-height: 65vh;
    }
    
    .post-menu-card-header {
        padding: 13px 18px;
    }
    
    .post-menu-card-header h3 {
        font-size: 15px;
    }
    
    .post-menu-card-content {
        padding: 13px 18px;
        max-height: calc(65vh - 55px);
    }
    
    .post-list-item {
        padding: 7px 11px;
    }
    
    .post-id {
        font-size: 13.5px;
        min-width: 28px;
    }
    
    .post-title {
        font-size: 13.5px;
    }
    
    .post-date {
        font-size: 11.5px;
    }
}

/* 平板及以上 (768px) */
@media (min-width: 768px) {
    /* 恢复桌面布局 */
    /* 调整文章菜单卡片 */
    .post-menu-card {
        width: 300px;
        max-height: 70vh;
    }
    
    .post-menu-card-header {
        padding: 15px 20px;
    }
    
    .post-menu-card-header h3 {
        font-size: 16px;
    }
    
    .post-menu-card-content {
        padding: 15px 20px;
        max-height: calc(70vh - 60px);
    }
    
    .post-list-item {
        padding: 8px 12px;
    }
    
    .post-id {
        font-size: 14px;
        min-width: 30px;
    }
    
    .post-title {
        font-size: 14px;
    }
    
    .post-date {
        font-size: 12px;
    }
}

/* 桌面及以上 (1024px) */
@media (min-width: 1024px) {
    /* 标准桌面布局 */
    /* 调整文章菜单卡片 */
    .post-menu-card {
        width: 320px;
    }
}

/* 大屏桌面及以上 (1200px) */
@media (min-width: 1200px) {
    /* 宽屏布局 */
    /* 调整文章菜单卡片 */
    .post-menu-card {
        width: 340px;
    }
}

/* 超大屏及以上 (1440px) */
@media (min-width: 1440px) {
    /* 超大屏优 */
    /* 调整文章菜单卡片 */
    .post-menu-card {
        width: 360px;
    }
}
</style>