<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useHead } from '@vueuse/head'
import PageNav from '../components/p-center/PageNav.vue'

// SEO 配置
useHead({
  title: '友链 - Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: 'Cnkrru\'s Blog推荐的有趣网站和资源链接，包括技术博客、工具网站和其他优秀项目' },
    { name: 'keywords', content: '友链,链接,推荐,资源网站,技术博客' },
    { name: 'author', content: 'Cnkrru' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://cnkrru.top/links' },
    { property: 'og:title', content: '友链 - Cnkrru\'s Blog' },
    { property: 'og:description', content: 'Cnkrru\'s Blog推荐的有趣网站和资源链接' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: "Cnkrru's Blog" },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top/links' },
    { name: 'twitter:title', content: '友链 - Cnkrru\'s Blog' },
    { name: 'twitter:description', content: 'Cnkrru\'s Blog推荐的有趣网站和资源链接' }
  ],
  link: [
    { rel: 'canonical', href: 'https://cnkrru.top/links' }
  ]
})

const links = ref<any[]>([])
const categories = ref<any[]>([])
const currentPage = ref(1)
const totalPages = ref(1)

// 友链状态检测
const linkStatus = reactive<Record<string, 'checking' | 'online' | 'offline'>>({})
const checkedCount = ref(0)
const totalLinks = ref(0)

async function checkLink(link: any) {
  const id = link.id
  linkStatus[id] = 'checking'
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const resp = await fetch(link.url, {
      mode: 'no-cors',
      signal: controller.signal
    })
    clearTimeout(timeout)
    linkStatus[id] = 'online'
  } catch {
    linkStatus[id] = 'offline'
  }
  checkedCount.value++
}

function checkAllLinks() {
  totalLinks.value = links.value.length
  checkedCount.value = 0
  links.value.forEach(link => {
    linkStatus[link.id] = 'checking'
    checkLink(link)
  })
}

const loadLinks = async () => {
    try {
        const response = await fetch('/config/links.json')
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }
        const data = await response.json()
        links.value = data
        categorizeLinks()
        checkAllLinks()
    } catch (error) {
        console.error('加载链接失败:', error)
        links.value = []
    }
}

const categorizeLinks = () => {
    const categoryMap: Record<string, any[]> = {}

    links.value.forEach(link => {
        const category = link.category
        if (!categoryMap[category]) {
            categoryMap[category] = []
        }
        categoryMap[category].push(link)
    })

    categories.value = Object.keys(categoryMap).map(category => {
        return {
            name: category,
            links: categoryMap[category].sort((a: any, b: any) => {
                return parseInt(b.id) - parseInt(a.id)
            })
        }
    }).sort((a, b) => {
        return a.name.localeCompare(b.name)
    })

    totalPages.value = categories.value.length
}

const getCurrentCategory = () => {
    return categories.value[currentPage.value - 1]
}

const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const onlineCount = () => Object.values(linkStatus).filter(s => s === 'online').length
const offlineCount = () => Object.values(linkStatus).filter(s => s === 'offline').length

onMounted(() => {
    loadLinks()
})
</script>

<template>
    <div id="site-stats-container"></div>
    <!-- 中心卡片头部区域 -->
    <div class="center-head-card">
        <h2>友情链接</h2>
        <div class="status-summary">
          <span class="status-dot online"></span>{{ onlineCount() }} 在线
          <span class="status-dot offline"></span>{{ offlineCount() }} 离线
          <span class="status-dot checking"></span>{{ totalLinks - checkedCount }} 检测中
        </div>
    </div>
    <hr>
    <!-- 中心卡片内容 -->
    <div class="center-card-content">
        <template v-if="getCurrentCategory()">
            <!-- 分类链接列表 -->
            <div class="links-content">
                <a
                  v-for="link in getCurrentCategory().links"
                  :key="link.id"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-card"
                  :class="{ offline: linkStatus[link.id] === 'offline' }"
                >
                    <div class="link-name">
                      {{ link.name }}
                      <span
                        class="link-status-icon"
                        :class="linkStatus[link.id] || 'checking'"
                      ></span>
                    </div>
                    <div class="link-description">{{ link.description }}</div>
                    <div class="link-status-text" :class="linkStatus[link.id] || 'checking'">
                      {{ linkStatus[link.id] === 'online' ? '在线' : linkStatus[link.id] === 'offline' ? '无法访问' : '检测中...' }}
                    </div>
                </a>
            </div>
        </template>
    </div>
    <hr>
    <div class="apply-link-wrap">
      <RouterLink to="/links/apply" class="apply-link">📬 申请友链</RouterLink>
    </div>

    <PageNav
      type="links"
      :current-page="currentPage"
      :total-pages="totalPages"
      :categories="categories"
      :current-category="getCurrentCategory()?.name || ''"
      @change="changePage"
    />
</template>

<style scoped>
/* 布局样式 */
.links-content {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}
.links-content > * {
    flex: 1 1 300px;
    max-width: 100%;
}

.link-card {
    display: block;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    text-decoration: none;
    transition:
        transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.3s ease,
        border-color 0.3s ease;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.4);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

body.dark-theme .link-card {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.06);
}

.link-card:hover {
    transform: translateY(-3px);
    box-shadow:
        0 2px 6px rgba(0, 0, 0, 0.06),
        0 8px 20px rgba(0, 0, 0, 0.08);
    border-color: rgba(255, 192, 203, 0.25);
}

body.dark-theme .link-card:hover {
    border-color: rgba(58, 170, 231, 0.25);
}

.link-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 8px;
}

.link-description {
    font-size: 0.9rem;
    opacity: 0.8;
    flex: 1;
}

/* 分页样式 */
.pagination-container {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
}

.pagination {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
}

.pagination li {
    margin: 0 5px;
}

.pagination a {
    display: inline-block;
    padding: 8px 12px;
    text-decoration: none;
    border: 1px solid;
    border-radius: 4px;
    transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
    cursor: pointer;
}

.pagination a:hover {
    transform: none;
}

.pagination .active a {
    border-color: inherit;
}

.pagination .disabled a {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination .disabled a:hover {
    transform: none;
}

.apply-link-wrap {
  text-align: center;
  padding: 16px 0;
}

.apply-link {
  font-size: 13px;
  color: var(--common-color-1);
  text-decoration: none;
  padding: 6px 18px;
  border-radius: 20px;
  border: 1px solid var(--common-color-1);
  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.apply-link:hover {
  background: var(--common-color-1);
  color: var(--common-content);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--common-shadow);
}
</style>

<style scoped>
/* 状态检测样式 */
.status-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--common-text);
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.online {
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
}

.status-dot.offline {
  background: #ef4444;
  box-shadow: 0 0 6px #ef4444;
}

.status-dot.checking {
  background: #f59e0b;
  animation: dotPulse 1.2s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.link-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.link-status-icon {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.link-status-icon.online {
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
}

.link-status-icon.offline {
  background: #ef4444;
  box-shadow: 0 0 6px #ef4444;
}

.link-status-icon.checking {
  background: #f59e0b;
  animation: dotPulse 1.2s ease-in-out infinite;
}

.link-status-text {
  font-size: 11px;
  margin-top: 4px;
}

.link-status-text.online {
  color: #22c55e;
}

.link-status-text.offline {
  color: #ef4444;
}

.link-status-text.checking {
  color: #f59e0b;
}

.link-card.offline {
  opacity: 0.5;
}

/* 颜色样式 */
.link-card {
    color: var(--common-text);
}

.link-name {
    color: var(--common-text);
}

.link-description {
    color: var(--common-text);
}

.pagination a {
    color: var(--common-text);
    background: rgba(255, 255, 255, 0.4);
    border-color: rgba(0, 0, 0, 0.08);
    border-radius: 12px;
}

body.dark-theme .pagination a {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.08);
}

.pagination a:hover {
    background: rgba(255, 192, 203, 0.2);
}

body.dark-theme .pagination a:hover {
    background: rgba(58, 170, 231, 0.15);
}

.pagination .active a {
    background: var(--common-color-1);
    color: #fff;
    border-color: var(--common-color-1);
}

.pagination .disabled a {
    background: transparent;
    color: var(--common-text);
    opacity: 0.4;
}

.pagination .disabled a:hover {
    background: transparent;
}
</style>

<style scoped>
/* 响应式设计媒体查询 */
@media (max-width: 639px) {
    .links-content {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
    }
    
    .link-card {
        height: 120px;
        padding: 12px;
    }
    
    .link-name {
        font-size: 1rem;
    }
    
    .link-description {
        font-size: 0.8rem;
    }
    
    .pagination a {
        padding: 5px 8px;
        font-size: 13px;
    }
    
    .pagination li {
        margin: 0 2px;
    }
}

@media (max-width: 768px) {
    .links-content {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
    }
    
    .link-card {
        height: 130px;
        padding: 15px;
    }
    
    .link-name {
        font-size: 1.1rem;
    }
    
    .link-description {
        font-size: 0.85rem;
    }
    
    .pagination a {
        padding: 6px 10px;
        font-size: 14px;
    }
    
    .pagination li {
        margin: 0 3px;
    }
}

@media (max-width: 1024px) {
    .links-content {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
    }
}

@media (max-width: 1280px) {
    .links-content {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 1536px) {
    .links-content {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>
