<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '../../stores'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show'])

const router = useRouter()
const postsStore = usePostsStore()

const searchKeyword = ref('')
const sortBy = ref('id')

const posts = computed(() => postsStore.filteredPosts)

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
              class="menu-search-input"
            />
            <button v-if="searchKeyword" @click="clearSearch" class="clear-search-btn">
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
  </div>
</template>

<style scoped>
.post-menu-card {
    position: fixed;
    top: 50%;
    right: 0;
    transform: translate(100%, -50%);
    width: 300px;
    max-height: 70vh;
    border-right: none;
    border-radius: 12px 0 0 12px;
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

.post-menu-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
}

.post-menu-card-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
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
}

.post-menu-card-content {
    padding: 15px 20px;
    max-height: calc(70vh - 60px);
    overflow-y: auto;
}

.post-menu-controls {
    margin-bottom: 16px;
}

.search-box {
    position: relative;
    margin-bottom: 12px;
}

.menu-search-input {
    width: 100%;
    padding: 8px 32px 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.3s ease;
}

.menu-search-input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
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
    transition: all 0.2s ease;
}

.sort-controls {
    display: flex;
    gap: 8px;
}

.sort-btn {
    flex: 1;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.post-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.post-list-item {
    padding: 8px 12px;
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
    transform: translateX(-4px);
}

.post-id {
    font-weight: bold;
    margin-right: 10px;
    font-size: 14px;
    min-width: 30px;
}

.post-title {
    flex: 1;
    font-size: 14px;
    line-height: 1.5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.post-date {
    font-size: 12px;
    margin-left: 10px;
    white-space: nowrap;
}

.post-menu-btn-container {
    display: flex;
    align-items: center;
}

.post-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    font-weight: bold;
}

.post-menu-btn:hover {
    transform: translateY(-2px);
}

.post-menu-btn svg {
    width: 18px;
    height: 18px;
    margin-right: 6px;
}
</style>

<style scoped>
.post-menu-card {
    background-color: var(--common-bg);
    border: 1px solid var(--common-color-1);
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.post-menu-card-header h3 {
    color: var(--common-text);
}

.post-menu-card-content {
    color: var(--common-text);
}

.menu-search-input {
    background-color: var(--common-bg);
    color: var(--common-text);
    border: 1px solid var(--common-color-1);
}

.menu-clear-search-btn {
    color: var(--common-text);
}

.sort-btn {
    background-color: var(--common-color-1);
    color: var(--common-text);
    border: 1px solid var(--common-color-1);
}

.sort-btn:hover {
    background-color: var(--common-hover);
}

.sort-btn.active {
    background-color: var(--common-hover);
}

.post-list-item:hover {
    background-color: var(--common-hover);
}

.post-id {
    color: var(--common-text);
}

.post-title {
    color: var(--common-text);
}

.post-date {
    color: var(--common-content);
}

.post-menu-btn {
    background-color: var(--common-color-1);
    color: var(--common-content);
    border: 1px solid var(--common-color-1);
}

.post-menu-btn:hover {
    background-color: var(--common-hover);
}

.post-menu-btn svg {
    fill: var(--common-content);
}

.post-menu-close-btn svg {
    fill: var(--common-text);
}
</style>

<style scoped>
@media (max-width: calc(var(--sm) - 1px)) {
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

@media (max-width: var(--sm)) {
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

@media (max-width: var(--md)) {
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

@media (max-width: var(--lg)) {
    .post-menu-card {
        width: 320px;
    }
}

@media (max-width: var(--xl)) {
    .post-menu-card {
        width: 340px;
    }
}

@media (max-width: var(--2xl)) {
    .post-menu-card {
        width: 360px;
    }
}
</style>
