<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({
      executionCount: 0,
      totalExecutionTime: 0,
      successCount: 0,
      errorCount: 0
    })
  }
})

const averageExecutionTime = computed(() => {
  if (props.stats.executionCount === 0) return 0
  return props.stats.totalExecutionTime / props.stats.executionCount
})

const successRate = computed(() => {
  if (props.stats.executionCount === 0) return 0
  return (props.stats.successCount / props.stats.executionCount) * 100
})
</script>

<template>
  <div class="stats-panel">
    <h3>执行统计</h3>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ stats.executionCount }}</div>
        <div class="stat-label">总执行次数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.successCount }}</div>
        <div class="stat-label">成功次数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.errorCount }}</div>
        <div class="stat-label">错误次数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ averageExecutionTime.toFixed(2) }}ms</div>
        <div class="stat-label">平均执行时间</div>
      </div>
      <div class="stat-card full-width">
        <div class="stat-value">{{ successRate.toFixed(1) }}%</div>
        <div class="stat-label">成功率</div>
      </div>
    </div>
    <div class="stats-chart">
      <canvas id="statsChart"></canvas>
    </div>
  </div>
</template>

<style scoped>
.stats-panel {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.stats-panel h3 {
  color: #1a1a2e;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 5px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-card.full-width {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.stats-chart {
  height: 300px;
  margin-top: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .stat-value {
    font-size: 20px;
  }
}
</style>