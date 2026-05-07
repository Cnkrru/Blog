<template>
  <div class="github-container">
    <div v-if="loading" class="github-loading">
      <div class="loading-spinner"></div>
      <p>加载GitHub信息中...</p>
    </div>
    
    <div v-else-if="error" class="github-error">
      <p>{{ error }}</p>
      <button @click="fetchGitHubData" class="retry-button">重试</button>
    </div>
    
    <div v-else-if="userData" class="github-content">
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <img :src="userData.avatar_url" :alt="userData.login" class="avatar" />
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
              <span class="repo-forks">🍴 {{ repo.forks_count }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 贡献日历 -->
      <div class="contribution-section" v-if="contributionData">
        <h3 class="section-title">贡献统计</h3>
        <div class="contribution-stats">
          <div class="contribution-item">
            <span class="contribution-value">{{ contributionData.totalContributions }}</span>
            <span class="contribution-label">今年贡献</span>
          </div>
          <div class="contribution-item">
            <span class="contribution-value">{{ contributionData.longestStreak }}</span>
            <span class="contribution-label">最长连续贡献</span>
          </div>
          <div class="contribution-item">
            <span class="contribution-value">{{ contributionData.currentStreak }}</span>
            <span class="contribution-label">当前连续贡献</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ username: string }>()

const loading = ref(false)
const error = ref('')
const userData = ref(null)
const reposData = ref([])
const contributionData = ref(null)

// 获取GitHub用户数据
const fetchGitHubData = async () => {
  loading.value = true
  error.value = ''

  try {
    // 创建带超时的 fetch
    const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error('请求超时'))
        }, timeout)
        
        fetch(url, options)
          .then(response => {
            clearTimeout(timer)
            resolve(response)
          })
          .catch(err => {
            clearTimeout(timer)
            reject(err)
          })
      })
    }

    // 获取用户信息
    const userResponse = await fetchWithTimeout(`https://api.github.com/users/${props.username}`)
    if (!userResponse.ok) {
      if (userResponse.status === 403) {
        throw new Error('GitHub API 请求已达上限，请稍后再试')
      } else if (userResponse.status === 404) {
        throw new Error('未找到该用户')
      } else {
        throw new Error(`获取用户信息失败 (${userResponse.status})`)
      }
    }
    userData.value = await userResponse.json()

    // 获取用户仓库（按星标数排序）
    const reposResponse = await fetchWithTimeout(
      `https://api.github.com/users/${props.username}/repos?sort=stars&per_page=6`
    )
    if (reposResponse.ok) {
      const repos = await reposResponse.json()
      reposData.value = repos.filter(repo => !repo.fork).slice(0, 6)
    }

    // 获取贡献数据
    try {
      const contributionsResponse = await fetchWithTimeout(
        `https://github-contributions-api.jogruber.de/v4/${props.username}`
      )
      if (contributionsResponse.ok) {
        const contributionJson = await contributionsResponse.json()
        contributionData.value = calculateContributions(contributionJson)
      }
    } catch (contribError) {
      console.warn('获取贡献数据失败:', contribError)
      contributionData.value = null
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 计算贡献统计
const calculateContributions = (data) => {
  // 安全检查
  if (!data || !data.years || data.years.length === 0) {
    return {
      totalContributions: 0,
      longestStreak: 0,
      currentStreak: 0
    }
  }

  const years = data.years
  const currentYear = years[years.length - 1]
  if (!currentYear || !currentYear.contributions) {
    return {
      totalContributions: 0,
      longestStreak: 0,
      currentStreak: 0
    }
  }

  let totalContributions = 0
  let longestStreak = 0
  let currentStreak = 0
  let tempStreak = 0

  // 遍历所有周
  currentYear.contributions.forEach((week) => {
    let weekHasContribution = false
    week.contributions.forEach(day => {
      totalContributions += day.count
      if (day.count > 0) {
        weekHasContribution = true
      }
    })

    if (weekHasContribution) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 0
    }
  })

  // 计算当前连续贡献 - 从后往前遍历所有周
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let foundGap = false
  // 反向遍历所有周
  for (let weekIndex = currentYear.contributions.length - 1; weekIndex >= 0 && !foundGap; weekIndex--) {
    const week = currentYear.contributions[weekIndex]
    // 反向遍历这一周内的每天
    for (let dayIndex = week.contributions.length - 1; dayIndex >= 0; dayIndex--) {
      const day = week.contributions[dayIndex]
      const dayDate = new Date(day.date)
      dayDate.setHours(0, 0, 0, 0)

      if (dayDate > today) continue

      if (day.count > 0) {
        currentStreak++
      } else {
        foundGap = true
        break
      }
    }
  }

  return {
    totalContributions,
    longestStreak,
    currentStreak
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
    transition: all 0.3s ease;
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

.retry-button {
    margin-top: 16px;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.retry-button:hover {
    transform: translateY(-2px);
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
    transition: all 0.3s ease;
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
    transition: all 0.3s ease;
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

/* 贡献统计 */
.contribution-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.contribution-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-radius: 8px;
    transition: transform 0.3s ease;
}

.contribution-item:hover {
    transform: translateY(-4px);
}

.contribution-value {
    font-size: 2rem;
    font-weight: bold;
}

.contribution-label {
    font-size: 0.85rem;
    margin-top: 4px;
}
</style>

<style scoped>
/* 颜色样式 */
.loading-spinner {
  border-color: #e0e0e0;
  border-top-color: #3498db;
}

.retry-button {
  background-color: #3498db;
  color: white;
}

.retry-button:hover {
  background-color: #2980b9;
}

.user-card {
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.user-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.avatar {
  border-color: #f0f0f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-info h3 {
  color: #24292e;
}

.username {
  color: #586069;
}

.bio {
  color: #586069;
}

.stat-value {
  color: #24292e;
}

.stat-label {
  color: #586069;
}

.profile-link {
  background-color: #3498db;
  color: white;
}

.profile-link:hover {
  background-color: #2980b9;
}

.section-title {
  color: #24292e;
}

.section-title::before {
  background-color: #3498db;
}

.repo-card {
  background-color: #ffffff;
  border-color: #e8e8e8;
}

.repo-card:hover {
  background-color: #fafbfc;
  border-color: #d1d5da;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.repo-name {
  color: #0366d6;
}

.repo-stars {
  color: #f1c40f;
}

.repo-description {
  color: #586069;
}

.repo-meta {
  color: #586069;
}

.language-dot {
  background-color: #586069;
}

.language-dot.javascript {
  background-color: #f1e05a;
}

.language-dot.python {
  background-color: #3572a5;
}

.language-dot.java {
  background-color: #b07219;
}

.language-dot.html {
  background-color: #e34c26;
}

.language-dot.css {
  background-color: #563d7c;
}

.language-dot.typescript {
  background-color: #2b7489;
}

.language-dot.vue {
  background-color: #41b883;
}

.contribution-item {
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
}

.contribution-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.contribution-value {
  color: #3498db;
}

.contribution-label {
  color: #586069;
}

/* 暗色主题适配 */
:deep(html.dark) .loading-spinner {
  border-color: #333;
  border-top-color: #64b5f6;
}

:deep(html.dark) .retry-button {
  background-color: #64b5f6;
  color: #1e1e1e;
}

:deep(html.dark) .retry-button:hover {
  background-color: #90caf9;
}

:deep(html.dark) .user-card {
  background-color: #2d2d2d;
  border-color: #444;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:deep(html.dark) .user-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

:deep(html.dark) .avatar {
  border-color: #444;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

:deep(html.dark) .user-info h3 {
  color: #e0e0e0;
}

:deep(html.dark) .username {
  color: #a0a0a0;
}

:deep(html.dark) .bio {
  color: #a0a0a0;
}

:deep(html.dark) .stat-value {
  color: #e0e0e0;
}

:deep(html.dark) .stat-label {
  color: #a0a0a0;
}

:deep(html.dark) .profile-link {
  background-color: #64b5f6;
  color: #1e1e1e;
}

:deep(html.dark) .profile-link:hover {
  background-color: #90caf9;
}

:deep(html.dark) .section-title {
  color: #e0e0e0;
}

:deep(html.dark) .section-title::before {
  background-color: #64b5f6;
}

:deep(html.dark) .repo-card {
  background-color: #2d2d2d;
  border-color: #444;
}

:deep(html.dark) .repo-card:hover {
  background-color: #333;
  border-color: #555;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:deep(html.dark) .repo-name {
  color: #64b5f6;
}

:deep(html.dark) .repo-stars {
  color: #ffd54f;
}

:deep(html.dark) .repo-description {
  color: #a0a0a0;
}

:deep(html.dark) .repo-meta {
  color: #a0a0a0;
}

:deep(html.dark) .language-dot {
  background-color: #a0a0a0;
}

:deep(html.dark) .contribution-item {
  background-color: #2d2d2d;
  border-color: #444;
}

:deep(html.dark) .contribution-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:deep(html.dark) .contribution-value {
  color: #64b5f6;
}

:deep(html.dark) .contribution-label {
  color: #a0a0a0;
}
</style>

<style scoped>
/* 响应式设计 */
@media (max-width: var(--md)) {
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
    
    .contribution-stats {
        grid-template-columns: 1fr;
    }
    
    .contribution-value {
        font-size: 1.5rem;
    }
}
</style>