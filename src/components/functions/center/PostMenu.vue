<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show'])

const { t } = useI18n()
const router = useRouter()
const posts = ref([])
const loading = ref(true)

const loadPosts = async () => {
  try {
    const response = await fetch('/config/search.json')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const data = await response.json()
    // 过滤掉终端和日志条目
    posts.value = data.filter(post => post.id !== 'terminal' && post.id !== 'changelog')
  } catch (error) {
    console.error('Failed to load posts:', error)
  } finally {
    loading.value = false
  }
}

const toggleMenu = () => {
  emit('update:show', !props.show)
}

const navigateToPost = (postId) => {
  router.push(`/post/${postId}`)
  emit('update:show', false)
}

onMounted(() => {
  loadPosts()
})
</script>

<template>
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
      <div v-if="loading" class="loading-message">
        <p>Loading...</p>
      </div>
      <ul v-else class="post-list">
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
  <button class="post-menu-button" @click="toggleMenu">
    文章菜单
  </button>
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

.loading-message {
    text-align: center;
    padding: 40px 0;
    color: var(--text-secondary);
}

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
}

.post-list-item:hover {
    background-color: var(--hover-bg);
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
}

.post-date {
    color: var(--text-secondary);
    font-size: 12px;
    margin-left: 10px;
    white-space: nowrap;
}

.post-menu-button {
    background-color: var(--button-bg);
    border: 2px solid var(--button-border);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 16px;
    color: var(--button-text);
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
    box-shadow: 0 2px 8px var(--shadow-color);
    margin-right: 10px;
}

.post-menu-button:hover {
    background-color: var(--button-hover-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-color);
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