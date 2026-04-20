<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const fetchStats = ref({
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  avgResponseTime: 0,
  requests: []
})

let originalFetch = null
let isMonitoring = false
const isBrowser = typeof window !== 'undefined'

const monitorFetch = () => {
  if (!isBrowser) return
  if (isMonitoring) return
  isMonitoring = true
  
  originalFetch = window.fetch
  
  window.fetch = async (input, options) => {
    const startTime = performance.now()
    let success = false
    let url = ''
    
    try {
      if (typeof input === 'string') {
        url = input
      } else if (input instanceof Request) {
        url = input.url
      } else if (input && input.url) {
        url = input.url
      }
      
      const response = await originalFetch(input, options)
      success = response.ok
      return response
    } catch (error) {
      success = false
      throw error
    } finally {
      const endTime = performance.now()
      const responseTime = endTime - startTime
      
      fetchStats.value.totalRequests++
      if (success) {
        fetchStats.value.successfulRequests++
      } else {
        fetchStats.value.failedRequests++
      }
      
      const totalTime = fetchStats.value.avgResponseTime * (fetchStats.value.totalRequests - 1)
      fetchStats.value.avgResponseTime = (totalTime + responseTime) / fetchStats.value.totalRequests
      
      fetchStats.value.requests.unshift({
        url: url || 'Unknown',
        responseTime: responseTime,
        success: success,
        timestamp: Date.now()
      })
      
      if (fetchStats.value.requests.length > 10) {
        fetchStats.value.requests = fetchStats.value.requests.slice(0, 10)
      }
    }
  }
}

const resetStats = () => {
  fetchStats.value = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    avgResponseTime: 0,
    requests: []
  }
}

onMounted(() => {
  monitorFetch()
})

onUnmounted(() => {
  if (isBrowser && originalFetch) {
    window.fetch = originalFetch
    isMonitoring = false
  }
})
</script>

<template>
  <div class="fetch-monitor">
    <div class="fetch-header">
      <h4>API请求监控</h4>
      <button @click="resetStats" class="reset-button">重置</button>
    </div>
    
    <div class="fetch-stats">
      <div class="stat-row">
        <span>总请求数:</span>
        <span class="stat-value">{{ fetchStats.totalRequests }}</span>
      </div>
      <div class="stat-row">
        <span>成功请求:</span>
        <span class="stat-value success">{{ fetchStats.successfulRequests }}</span>
      </div>
      <div class="stat-row">
        <span>失败请求:</span>
        <span class="stat-value error">{{ fetchStats.failedRequests }}</span>
      </div>
      <div class="stat-row">
        <span>平均响应:</span>
        <span class="stat-value">{{ fetchStats.avgResponseTime.toFixed(2) }}ms</span>
      </div>
    </div>
    
    <div v-if="fetchStats.requests.length > 0" class="request-list">
      <h5>最近请求</h5>
      <div class="request-items">
        <div 
          v-for="(req, index) in fetchStats.requests" 
          :key="index"
          class="request-item"
          :class="{ 'success': req.success, 'error': !req.success }"
        >
          <div class="request-url">{{ req.url }}</div>
          <div class="request-info">
            <span class="response-time">{{ req.responseTime.toFixed(2) }}ms</span>
            <span class="request-status">{{ req.success ? '成功' : '失败' }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-requests">
      <p>暂无API请求</p>
      <p class="hint">发起fetch请求后，这里将显示监控数据</p>
    </div>
  </div>
</template>

<style scoped>
.fetch-monitor {
  padding: 16px;
  background-color: var(--hover-bg);
  border-radius: 8px;
  margin-bottom: 16px;
}

.fetch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.fetch-header h4 {
  margin: 0;
  color: var(--text-color);
  font-size: 14px;
  font-weight: 600;
}

.reset-button {
  background-color: var(--button-bg);
  border: 1px solid var(--button-border);
  color: var(--button-text);
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.reset-button:hover {
  background-color: var(--button-hover-bg);
}

.fetch-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
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

.stat-value.success {
  color: #4caf50;
}

.stat-value.error {
  color: #f44336;
}

.request-list {
  margin-top: 16px;
}

.request-list h5 {
  margin: 0 0 8px 0;
  color: var(--text-color);
  font-size: 13px;
  font-weight: 500;
}

.request-items {
  max-height: 200px;
  overflow-y: auto;
}

.request-item {
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 12px;
}

.request-item.success {
  border-left: 3px solid #4caf50;
}

.request-item.error {
  border-left: 3px solid #f44336;
}

.request-url {
  color: var(--text-color);
  margin-bottom: 4px;
  word-break: break-all;
}

.request-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-muted);
}

.response-time {
  font-weight: 500;
}

.no-requests {
  text-align: center;
  padding: 20px 0;
  color: var(--text-muted);
  font-size: 14px;
}

.no-requests .hint {
  font-size: 12px;
  margin-top: 4px;
  opacity: 0.7;
}
</style>