<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useThemeStore } from '../../stores'

const isLoading = ref(true)
const error = ref(null)
const statsLoaded = ref(false)

const themeStore = useThemeStore()
const isDarkTheme = computed(() => themeStore.isDark)

// 不蒜子 CDN 链接
const busuanziCdnLink = '//cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js'

// 加载不蒜子脚本
const loadBusuanzi = async () => {
  if (typeof window === 'undefined') return
  
  // 直接标记为加载完成，因为不蒜子脚本会自动处理数据显示
  statsLoaded.value = true
  isLoading.value = false
  
  // 检查是否已经加载过不蒜子脚本
  if (document.querySelector('script[src*="busuanzi"]')) {
    console.log('不蒜子脚本已加载')
    return
  }

  // 加载不蒜子脚本
  const script = document.createElement('script')
  script.src = busuanziCdnLink
  script.defer = true
  script.onload = () => {
    console.log('不蒜子脚本加载完成')
  }
  script.onerror = () => {
    error.value = '统计脚本加载失败'
    console.error('加载不蒜子脚本失败')
  }
  document.head.appendChild(script)
  console.log('不蒜子脚本开始加载:', busuanziCdnLink)
}

// 重试加载
const retryLoad = () => {
  isLoading.value = true
  error.value = null
  statsLoaded.value = false
  loadBusuanzi()
}

onMounted(() => {
  loadBusuanzi()
})

// 监听主题变化，重新渲染以适配主题
watch(() => isDarkTheme.value, () => {
  // 主题变化时不需要重新加载脚本，只需要确保样式正确
  if (statsLoaded.value) {
    // 强制重绘以应用新主题
    setTimeout(() => {
      window.busuanzi && window.busuanzi.reload && window.busuanzi.reload()
    }, 100)
  }
})
</script>

<template>
  <div class="site-stats-card" :class="{ 'site-stats-card-dark': isDarkTheme }">
    <h3 class="stats-title">站点统计</h3>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="stats-loading">
      <div class="loading-spinner"></div>
      <span class="loading-text">加载统计数据中...</span>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="stats-error">
      <span class="error-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </span>
      <span class="error-text">{{ error }}</span>
      <button @click="retryLoad" class="retry-button">重试</button>
    </div>
    
    <!-- 统计数据 -->
    <div v-else class="stats-container">
      <div class="stats-row">
        <div class="stats-item">
          <div class="stats-label">今日总访问量</div>
          <div class="stats-value"><span id="busuanzi_today_pv">加载中...</span> </div>
        </div>
        <div class="stats-item">
          <div class="stats-label">今日总访客数</div>
          <div class="stats-value"><span id="busuanzi_today_uv">加载中...</span> </div>
        </div>
      </div>
      
      <div class="stats-divider"></div>
      
      <div class="stats-row">
        <div class="stats-item">
          <div class="stats-label">本站总访问量</div>
          <div class="stats-value"><span id="busuanzi_site_pv">加载中...</span> </div>
        </div>
        <div class="stats-item">
          <div class="stats-label">本站总访客数</div>
          <div class="stats-value"><span id="busuanzi_site_uv">加载中...</span> </div>
        </div>
      </div>
      
      <div class="stats-divider"></div>
      
      <div class="stats-row">
        <div class="stats-item">
          <div class="stats-label">本页总阅读量</div>
          <div class="stats-value"><span id="busuanzi_page_pv">加载中...</span> </div>
        </div>
        <div class="stats-item">
          <div class="stats-label">本页总访客数</div>
          <div class="stats-value"><span id="busuanzi_page_uv">加载中...</span> </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.site-stats-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  margin: 20px 0;
  transition: all 0.3s ease;
}

.site-stats-card-dark {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.site-stats-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.site-stats-card-dark:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.stats-title {
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--center-card-title-color);
  text-align: center;
}

/* 加载状态样式 */
.stats-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 200px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--accent-fg);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 错误状态样式 */
.stats-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 200px;
  color: var(--error-color);
}

.error-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 12px;
}

.error-icon svg {
  width: 100%;
  height: 100%;
}

.error-text {
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
}

.retry-button {
  padding: 8px 16px;
  background-color: var(--accent-fg);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background-color: var(--accent-hover);
  transform: translateY(-2px);
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.stats-item {
  flex: 1;
  text-align: center;
  padding: 12px;
  background: var(--hover-bg);
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.stats-item:hover {
  transform: translateY(-2px);
}

.stats-label {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 4px;
  font-weight: 500;
}

.stats-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.stats-value span {
  font-weight: bold;
  color: var(--text-color);
}

.stats-divider {
  width: 100%;
  height: 1px;
  background-color: var(--center-card-hr-color);
}

/* 响应式设计媒体查询 */
@media (max-width: 768px) {
  .site-stats-card {
    padding: 16px;
  }
  
  .stats-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .stats-item {
    padding: 10px;
  }
  
  .stats-title {
    font-size: 1.1rem;
  }
  
  .stats-label {
    font-size: 0.8rem;
  }
  
  .stats-value {
    font-size: 1rem;
  }
  
  .stats-loading,
  .stats-error {
    padding: 30px 15px;
    min-height: 150px;
  }
  
  .loading-spinner {
    width: 24px;
    height: 24px;
  }
  
  .loading-text,
  .error-text {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .site-stats-card {
    padding: 12px;
  }
  
  .stats-item {
    padding: 8px;
  }
  
  .stats-title {
    font-size: 1rem;
  }
  
  .stats-label {
    font-size: 0.75rem;
  }
  
  .stats-value {
    font-size: 0.9rem;
  }
  
  .stats-loading,
  .stats-error {
    padding: 20px 10px;
    min-height: 120px;
  }
  
  .retry-button {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>