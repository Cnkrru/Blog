<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 加载不蒜子脚本
  if (typeof window !== 'undefined' && !window.busuanzi) {
    const script = document.createElement('script')
    script.src = '//cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js'
    script.defer = true
    document.head.appendChild(script)
  }
})  
</script>

<template>
  <div class="site-stats-card">
    <h3 class="stats-title">站点统计</h3>
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
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  margin: 20px 0;
  transition: all 0.3s ease;
}

.site-stats-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.stats-title {
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--center-card-title-color);
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
}


</style>