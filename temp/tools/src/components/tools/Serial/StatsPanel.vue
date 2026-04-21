<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({
      rxBytes: 0,
      txBytes: 0,
      rxCount: 0,
      txCount: 0,
      lastRxTime: null,
      lastTxTime: null,
      rxRate: 0,
      txRate: 0
    })
  }
})
</script>

<template>
  <div class="stats-section">
    <h2>统计信息</h2>
    <div class="stats-columns">
      <!-- 接收统计 -->
      <div class="stats-column">
        <div class="column-header">
          <h3>接收统计</h3>
        </div>
        <div class="stat-items">
          <div class="stat-item">
            <span class="stat-label">接收字节:</span>
            <span class="stat-value">{{ stats.rxBytes }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">接收次数:</span>
            <span class="stat-value">{{ stats.rxCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">接收速率:</span>
            <span class="stat-value">{{ stats.rxRate.toFixed(2) }} B/s</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">最后接收:</span>
            <span class="stat-value">{{ stats.lastRxTime || '-' }}</span>
          </div>
        </div>
      </div>
      
      <!-- 发送统计 -->
      <div class="stats-column">
        <div class="column-header">
          <h3>发送统计</h3>
        </div>
        <div class="stat-items">
          <div class="stat-item">
            <span class="stat-label">发送字节:</span>
            <span class="stat-value">{{ stats.txBytes }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">发送次数:</span>
            <span class="stat-value">{{ stats.txCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">发送速率:</span>
            <span class="stat-value">{{ stats.txRate.toFixed(2) }} B/s</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">最后发送:</span>
            <span class="stat-value">{{ stats.lastTxTime || '-' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.stats-section {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.stats-section h2 {
  color: #333333;
  margin-bottom: 20px;
  font-size: 1.3rem;
  font-weight: 600;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.stats-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.stats-column {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e0e0e0;
}

.column-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

.column-header h3 {
  color: #333333;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.stat-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.stat-label {
  color: #555555;
  font-size: 14px;
  font-weight: 500;
}

.stat-value {
  color: #667eea;
  font-weight: bold;
  font-size: 14px;
  font-family: 'Courier New', monospace;
}

@media (max-width: 768px) {
  .stats-section {
    padding: 20px;
  }
  
  .stats-columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-column {
    padding: 15px;
  }
  
  .column-header h3 {
    font-size: 1rem;
  }
  
  .stat-item {
    padding: 12px;
  }
}
</style>