<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import MemoryMonitor from './MemoryMonitor.vue'
import FetchMonitor from './FetchMonitor.vue'

const metrics = ref({
  totalQueries: 0,
  avgResponseTime: 0,
  p95: 0,
  throughput: 0
})

const isVisible = ref(false)
const hasData = ref(false)
const isBrowser = typeof window !== 'undefined'

const updateMetrics = () => {
  if (isBrowser && window.globalMonitor) {
    const stats = window.globalMonitor.getStats()
    if (stats && stats.operations && stats.operations.search) {
      hasData.value = true
      const searchStats = stats.operations.search
      metrics.value = {
        totalQueries: searchStats.count || 0,
        avgResponseTime: searchStats.avg || 0,
        p95: searchStats.max || 0,
        throughput: searchStats.throughput || 0
      }
    }
  }
}

const toggleVisibility = async () => {
  isVisible.value = !isVisible.value

  if (isVisible.value) {
    await nextTick()
    updateMetrics()
  }
}

let updateInterval = null

onMounted(() => {
  if (isVisible.value) {
    updateInterval = setInterval(updateMetrics, 1000)
  }
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})

defineExpose({
  toggleVisibility
})
</script>

<template>
  <div class="performance-monitor">
    <button @click="toggleVisibility" class="monitor-button">
      ⚡ 性能监控
    </button>

    <div v-if="isVisible" class="monitor-panel">
      <div class="monitor-header">
        <h3>性能监控</h3>
        <button @click="toggleVisibility" class="close-button">×</button>
      </div>

      <!-- 搜索性能 -->
      <div class="monitor-section">
        <h4>搜索性能</h4>
        <div v-if="hasData" class="metrics-grid">
          <div class="metric-row">
            <span>总查询数:</span>
            <span class="metric-value">{{ metrics.totalQueries }}</span>
          </div>
          <div class="metric-row">
            <span>平均响应:</span>
            <span class="metric-value">{{ metrics.avgResponseTime.toFixed(2) }}ms</span>
          </div>
          <div class="metric-row">
            <span>P95响应:</span>
            <span class="metric-value">{{ metrics.p95.toFixed(2) }}ms</span>
          </div>
          <div class="metric-row">
            <span>吞吐量:</span>
            <span class="metric-value">{{ metrics.throughput.toFixed(1) }}/h</span>
          </div>
        </div>
        <div v-else class="no-data">
          <p>暂无搜索数据</p>
          <p class="hint">进行搜索操作后，这里将显示性能指标</p>
        </div>
      </div>

      <!-- 内存监控 -->
      <MemoryMonitor />

      <!-- Fetch API监控 -->
      <FetchMonitor />
    </div>
  </div>
</template>

<style scoped>
.performance-monitor {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.monitor-button {
  background-color: var(--button-bg);
  border: 1px solid var(--button-border);
  color: var(--button-text);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.monitor-button:hover {
  background-color: var(--button-hover-bg);
  transform: translateY(-2px);
}

.monitor-panel {
  position: absolute;
  bottom: 50px;
  right: 0;
  width: 400px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 16px var(--shadow-color);
  max-height: 600px;
  overflow-y: auto;
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.monitor-header h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 16px;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--text-color);
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-button:hover {
  background-color: var(--hover-bg);
}

.monitor-section {
  margin-bottom: 16px;
}

.monitor-section h4 {
  margin: 0 0 12px 0;
  color: var(--text-color);
  font-size: 14px;
  font-weight: 600;
}

.metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: var(--hover-bg);
  padding: 12px;
  border-radius: 6px;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.metric-row span:first-child {
  color: var(--text-muted);
}

.metric-value {
  color: var(--text-color);
  font-weight: 500;
}

.no-data {
  text-align: center;
  padding: 20px 0;
  background-color: var(--hover-bg);
  border-radius: 6px;
}

.no-data p {
  margin: 0;
  color: var(--text-muted);
  font-size: 14px;
}

.no-data .hint {
  font-size: 12px;
  margin-top: 8px;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .performance-monitor {
    bottom: 10px;
    right: 10px;
  }

  .monitor-panel {
    width: calc(100vw - 40px);
    right: -10px;
  }
}
</style>