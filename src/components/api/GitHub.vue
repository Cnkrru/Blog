<template>
  <div class="github-container">
    <div v-if="loading" class="github-loading">
      <div class="loading-spinner"></div>
      <p>加载GitHub信息中...</p>
    </div>
    
    <div v-else-if="error" class="github-error">
      <p>{{ error }}</p>
      <button @click="fetchGitHubData" class="retry-button" aria-label="重试">重试</button>
    </div>
    
    <div v-else-if="userData" class="github-content">
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <img :src="userData.avatar_url" :alt="userData.login" class="avatar" loading="lazy" />
        <div class="user-info">
          <h3>{{ userData.name || userData.login }}</h3>
          <p class="username">@{{ userData.login }}</p>
          <p class="bio" v-if="userData.bio">{{ userData.bio }}</p>
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-value">{{ userData.public_repos }}</span>
              <span class="stat-label">仓库</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ userData.followers }}</span>
              <span class="stat-label">粉丝</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ userData.following }}</span>
              <span class="stat-label">关注</span>
            </div>
          </div>
          <a :href="userData.html_url" target="_blank" class="profile-link">访问GitHub主页</a>
        </div>
      </div>
      
      <!-- 热门仓库 -->
      <div class="repositories-section" v-if="reposData.length > 0">
        <h3 class="section-title">热门仓库</h3>
        <div class="repos-grid">
          <div 
            v-for="repo in reposData" 
            :key="repo.id" 
            class="repo-card"
            @click="openRepo(repo.html_url)"
          >
            <div class="repo-header">
              <span class="repo-name">{{ repo.name }}</span>
              <span class="repo-stars">★ {{ repo.stargazers_count }}</span>
            </div>
            <p class="repo-description" v-if="repo.description">{{ repo.description }}</p>
            <div class="repo-meta">
              <span class="repo-language" v-if="repo.language">
                <span class="language-dot" :class="repo.language.toLowerCase()"></span>
                {{ repo.language }}
              </span>
              <span class="repo-forks"><VIcon :src="'fork.svg'" :size="13" /> {{ repo.forks_count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import VIcon from '@/components/common/VIcon.vue'

const props = defineProps(['username'])

const loading = ref(false)
const error = ref('')
const userData = ref(null)
const reposData = ref([])

// 获取GitHub用户数据
const fetchGitHubData = async () => {
  loading.value = true
  error.value = ''

  try {
    // 获取用户信息
    const userResponse = await axios.get(`https://api.github.com/users/${props.username}`, { timeout: 10000 })
    userData.value = userResponse.data

    // 获取用户仓库（按星标数排序）
    const reposResponse = await axios.get(
      `https://api.github.com/users/${props.username}/repos?sort=stars&per_page=6`,
      { timeout: 10000 }
    )
    reposData.value = reposResponse.data.filter(repo => !repo.fork).slice(0, 6)
  } catch (err) {
    if (err.response?.status === 403) {
      error.value = 'GitHub API 请求已达上限，请稍后再试'
    } else if (err.response?.status === 404) {
      error.value = '未找到该用户'
    } else {
      error.value = err.message || '获取用户信息失败'
    }
  } finally {
    loading.value = false
  }
}

// 在新窗口打开仓库
const openRepo = (url) => {
  window.open(url, '_blank')
}

onMounted(() => {
  fetchGitHubData()
})
</script>

<style scoped>
/* 布局样式 */
.github-container {
    border-radius: 12px;
    padding: 24px;
    backdrop-filter: blur(10px);
    transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
}

.github-loading,
.github-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid;
    border-top-color: inherit;
    border-radius: 50%;
    margin-bottom: 20px;
}

.github-content {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

/* 用户卡片 */
.user-card {
    display: flex;
    gap: 24px;
    padding: 24px;
    border-radius: 12px;
    transition: transform 0.3s ease;
}

.user-card:hover {
    transform: translateY(-4px);
}

.avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid;
    flex-shrink: 0;
}

.user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.user-info h3 {
    margin: 0 0 4px 0;
    font-size: 1.5rem;
}

.username {
    margin: 0 0 8px 0;
    font-size: 0.9rem;
}

.bio {
    margin: 0 0 16px 0;
    font-size: 0.95rem;
    line-height: 1.5;
}

.user-stats {
    display: flex;
    gap: 24px;
    margin-bottom: 16px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-value {
    font-size: 1.3rem;
    font-weight: bold;
}

.stat-label {
    font-size: 0.8rem;
}

.profile-link {
    margin-top: auto;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 6px;
    text-align: center;
    transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
}

.profile-link:hover {
    transform: translateY(-2px);
}

/* 仓库列表 */
.section-title {
    margin: 0 0 16px 0;
    font-size: 1.2rem;
    position: relative;
    padding-left: 16px;
}

.section-title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    border-radius: 2px;
}

.repos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
}

.repo-card {
    padding: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
    border: 1px solid transparent;
}

.repo-card:hover {
    transform: translateY(-4px);
}

.repo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.repo-name {
    font-weight: 600;
    font-size: 1rem;
}

.repo-stars {
    font-size: 0.85rem;
}

.repo-description {
    margin: 0 0 12px 0;
    font-size: 0.9rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.repo-meta {
    display: flex;
    gap: 16px;
    font-size: 0.85rem;
}

.language-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 4px;
}
</style>

<style scoped>
/* 颜色样式 — 使用 CSS 变量，自动适配亮/暗主题 */
.loading-spinner {
  border-color: color-mix(in srgb, var(--common-text) 12%, transparent);
  border-top-color: var(--common-color-1);
}

.user-card {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.95);
  border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
  box-shadow: 0 2px 8px var(--common-shadow);
}

.user-card:hover {
  box-shadow: 0 4px 16px var(--common-shadow);
}

.avatar {
  border-color: color-mix(in srgb, var(--common-text) 8%, transparent);
  box-shadow: 0 4px 12px var(--common-shadow);
}

.user-info h3 {
  color: var(--common-text);
}

.username {
  color: var(--common-text);
  opacity: 0.65;
}

.bio {
  color: var(--common-text);
  opacity: 0.65;
}

.stat-value {
  color: var(--common-text);
}

.stat-label {
  color: var(--common-text);
  opacity: 0.65;
}

.profile-link {
  background: var(--common-color-1);
  color: var(--common-content);
}

.profile-link:hover {
  background: color-mix(in srgb, var(--common-color-1) 85%, black);
}

.section-title {
  color: var(--common-text);
}

.section-title::before {
  background-color: var(--common-color-1);
}

.repo-card {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.95);
  border-color: color-mix(in srgb, var(--common-text) 8%, transparent);
}

.repo-card:hover {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.98);
  border-color: color-mix(in srgb, var(--common-text) 15%, transparent);
  box-shadow: 0 4px 12px var(--common-shadow);
}

.repo-name {
  color: var(--common-color-1);
}

.repo-stars {
  color: #f1c40f;
}

.repo-description {
  color: var(--common-text);
  opacity: 0.65;
}

.repo-meta {
  color: var(--common-text);
  opacity: 0.65;
}

.language-dot {
  background-color: var(--common-text);
  opacity: 0.65;
}

.language-dot.javascript { background-color: #f1e05a; }
.language-dot.python { background-color: #3572a5; }
.language-dot.java { background-color: #b07219; }
.language-dot.html { background-color: #e34c26; }
.language-dot.css { background-color: #563d7c; }
.language-dot.typescript { background-color: #2b7489; }
.language-dot.vue { background-color: #41b883; }
</style>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
    .user-card {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    
    .avatar {
        width: 100px;
        height: 100px;
    }
    
    .user-stats {
        justify-content: center;
    }
    
    .repos-grid {
        grid-template-columns: 1fr;
    }
}
</style>