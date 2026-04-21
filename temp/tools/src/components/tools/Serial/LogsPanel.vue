<script setup>
import { ref, onMounted } from 'vue'

const logs = ref([])
const isLoading = ref(true)

// 加载日志
const loadLogs = () => {
  try {
    const storedLogs = localStorage.getItem('serialToolLogs')
    if (storedLogs) {
      logs.value = JSON.parse(storedLogs)
    } else {
      logs.value = []
    }
  } catch (error) {
    logs.value = []
  } finally {
    isLoading.value = false
  }
}

// 清除日志
const clearLogs = () => {
  if (confirm('确定要清除所有日志吗？')) {
    logs.value = []
    try {
      localStorage.removeItem('serialToolLogs')
      addLog('系统', '日志已清除')
    } catch (error) {
      // 静默处理错误
    }
  }
}

// 添加日志（外部调用）
const addLog = (source, message) => {
  const log = {
    id: Date.now(),
    timestamp: new Date().toLocaleString(),
    source,
    message
  }
  logs.value.unshift(log)
  
  // 限制日志数量
  if (logs.value.length > 1000) {
    logs.value = logs.value.slice(0, 1000)
  }
  
  // 保存到本地存储
  try {
    localStorage.setItem('serialToolLogs', JSON.stringify(logs.value))
  } catch (error) {
    // 静默处理错误
  }
}

// 导出日志
const exportLogs = () => {
  const logText = logs.value.map(log => `${log.timestamp} [${log.source}] ${log.message}`).join('\n')
  const blob = new Blob([logText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `serial-tool-logs-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

onMounted(() => {
  loadLogs()
})

// 暴露方法给父组件
defineExpose({
  addLog
})
</script>

<template>
  <div class="logs-panel">
    <div class="logs-header">
      <h2>操作日志</h2>
      <div class="logs-controls">
        <button class="control-button export" @click="exportLogs">
          导出
        </button>
        <button class="control-button clear" @click="clearLogs">
          清除
        </button>
      </div>
    </div>
    
    <div class="logs-content">
      <div v-if="isLoading" class="loading">
        <p>加载日志...</p>
      </div>
      <div v-else-if="logs.length === 0" class="empty">
        <p>暂无日志记录</p>
      </div>
      <div v-else class="logs-list">
        <div v-for="log in logs" :key="log.id" class="log-item">
          <div class="log-header">
            <span class="log-timestamp">{{ log.timestamp }}</span>
            <span class="log-source">{{ log.source }}</span>
          </div>
          <div class="log-message">{{ log.message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.logs-panel {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.logs-header h2 {
  color: #333333;
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.logs-controls {
  display: flex;
  gap: 10px;
}

.control-button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-button.export {
  background-color: #667eea;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.control-button.export:hover {
  background-color: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.control-button.clear {
  background-color: #dc3545;
  color: white;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.control-button.clear:hover {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(220, 53, 69, 0.4);
}

.logs-content {
  flex: 1;
  overflow-y: auto;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.loading,
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666666;
  font-size: 14px;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.log-item {
  background-color: white;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.log-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
}

.log-timestamp {
  color: #666666;
  font-family: 'Courier New', monospace;
}

.log-source {
  background-color: #667eea;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 11px;
}

.log-message {
  color: #333333;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.logs-content::-webkit-scrollbar {
  width: 8px;
}

.logs-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.logs-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.logs-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (max-width: 768px) {
  .logs-panel {
    padding: 20px;
    height: 500px;
  }
  
  .logs-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .logs-controls {
    width: 100%;
    justify-content: space-between;
  }
}
</style>