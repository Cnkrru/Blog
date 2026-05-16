<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { useThemeStore } from '../../stores'

const themeStore = useThemeStore()
const isDarkTheme = computed(() => themeStore.isDark)

// 不蒜子 CDN 链接
const busuanziCdnLink = '//cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js'

// 加载不蒜子脚本
const loadBusuanzi = async () => {
  if (typeof window === 'undefined') return
  
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
    console.error('加载不蒜子脚本失败')
  }
  document.head.appendChild(script)
  console.log('不蒜子脚本开始加载:', busuanziCdnLink)
}

onMounted(() => {
  loadBusuanzi()
})

// 监听主题变化，重新渲染以适配主题
watch(() => isDarkTheme.value, () => {
  setTimeout(() => {
    window.busuanzi && window.busuanzi.reload && window.busuanzi.reload()
  }, 100)
})
</script>

<template>
  <div class="site-stats-card" :class="{ 'site-stats-card-dark': isDarkTheme }">
    <h3 class="stats-title">站点统计</h3>
    
    <!-- 统计数据 -->
    <div class="stats-container">
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
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  margin: 20px 0;
  transition: all 0.3s ease;
}

.site-stats-card:hover {
  transform: translateY(-2px);
}

.stats-title {
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
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
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.stats-item:hover {
  transform: translateY(-2px);
}

.stats-label {
  font-size: 0.9rem;
  margin-bottom: 4px;
  font-weight: 500;
}

.stats-value {
  font-size: 1.1rem;
  font-weight: 600;
}

.stats-divider {
  width: 100%;
  height: 1px;
}
</style>

<style scoped>
.site-stats-card {
  background-color: var(--common-bg);
  border: 2px solid var(--common-color-1);
}

.stats-title {
  color: var(--common-color-1);
}

.stats-item {
  background-color: var(--common-color-1);
}

.stats-label {
  color: var(--common-content);
}

.stats-value {
  color: var(--common-content);
}

.stats-divider {
  background-color: var(--common-color-1);
}
</style>

<style scoped>
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
  
}

@media (max-width: 640px) {
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
  
}
</style>
