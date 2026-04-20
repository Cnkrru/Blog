<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const memoryStats = ref({
  heapSizeLimit: 0,
  totalJSHeapSize: 0,
  usedJSHeapSize: 0,
  memoryUsage: 0
})

const hasMemoryAPI = ref(false)

const updateMemoryStats = () => {
  if (performance && performance.memory) {
    hasMemoryAPI.value = true
    const memory = performance.memory
    const heapSizeLimit = memory.heapSizeLimit || 1
    const usedJSHeapSize = memory.usedJSHeapSize || 0
    
    memoryStats.value = {
      heapSizeLimit: heapSizeLimit,
      totalJSHeapSize: memory.totalJSHeapSize || 0,
      usedJSHeapSize: usedJSHeapSize,
      memoryUsage: (usedJSHeapSize / heapSizeLimit) * 100
    }
  } else {
    hasMemoryAPI.value = false
  }
}

let updateInterval = null

onMounted(() => {
  updateMemoryStats()
  updateInterval = setInterval(updateMemoryStats, 2000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<template>
  <div class="memory-monitor">
    <h4>内存监控</h4>
    
    <div v-if="hasMemoryAPI" class="memory-stats">
      <div class="stat-row">
        <span>已用内存:</span>
        <span class="stat-value">{{ (memoryStats.usedJSHeapSize / 1024 / 1024).toFixed(2) }} MB</span>
      </div>
      <div class="stat-row">
        <span>总内存:</span>
        <span class="stat-value">{{ (memoryStats.totalJSHeapSize / 1024 / 1024).toFixed(2) }} MB</span>
      </div>
    </div>
    
    <div v-else class="no-support">
      <p>浏览器不支持内存API</p>
      <p class="hint">仅Chrome DevTools中可用</p>
    </div>
  </div>
</template>

<style scoped>
.memory-monitor {
  padding: 16px;
  background-color: var(--hover-bg);
  border-radius: 8px;
  margin-bottom: 16px;
}

.memory-monitor h4 {
  margin: 0 0 12px 0;
  color: var(--text-color);
  font-size: 14px;
  font-weight: 600;
}

.memory-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.stat-row span:first-child {
  color: var(--text-muted);
}

.stat-value {
  color: var(--text-color);
  font-weight: 500;
}

.no-support {
  text-align: center;
  padding: 20px 0;
  color: var(--text-muted);
  font-size: 14px;
}

.no-support .hint {
  font-size: 12px;
  margin-top: 4px;
  opacity: 0.7;
}
</style>