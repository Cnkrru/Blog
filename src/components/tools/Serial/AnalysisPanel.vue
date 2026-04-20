<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  receivedData: {
    type: String,
    default: ''
  },
  isConnected: {
    type: Boolean,
    default: false
  },
  analysisConfig: {
    type: Object,
    default: () => ({
      enabled: false,
      maxDataPoints: 100,
      refreshInterval: 1000,
      chartType: 'line'
    })
  }
})

const emit = defineEmits(['analysis-config'])

// 图表相关
const chartCanvas = ref(null)
const chartInstance = ref(null)
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: '串口数据',
      data: [],
      borderColor: 'rgba(102, 126, 234, 1)',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }
  ]
})

// 配置选项
const config = ref({
  enabled: false,
  maxDataPoints: 100,
  refreshInterval: 1000,
  chartType: 'line'
})

const chartTypes = [
  { value: 'line', label: '折线图' },
  { value: 'bar', label: '柱状图' },
  { value: 'scatter', label: '散点图' }
]

// 数据处理
const processData = (data) => {
  if (!config.value.enabled) return
  
  // 提取数字数据（固定正则表达式�?  const matches = data.match(/\d+(\.\d+)?/g)
  if (matches) {
    matches.forEach(match => {
      const value = parseFloat(match)
      if (!isNaN(value)) {
        addDataPoint(value)
      }
    })
  }
}



// 添加数据点
const addDataPoint = (value) => {
  const now = new Date()
  const timeLabel = now.toLocaleTimeString()
  
  chartData.value.labels.push(timeLabel)
  chartData.value.datasets[0].data.push(value)
  
  // 限制数据点数
  if (chartData.value.labels.length > config.value.maxDataPoints) {
    chartData.value.labels.shift()
    chartData.value.datasets[0].data.shift()
  }
  
  updateChart()
} 

// 更新图表
const updateChart = () => {
  if (chartInstance.value) {
    chartInstance.value.update()
  }
}

// 初始化图表
const initChart = () => {
  if (!chartCanvas.value) return
  
  const ctx = chartCanvas.value.getContext('2d')
  
  chartInstance.value = new Chart(ctx, {
    type: config.value.chartType,
    data: chartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: config.value.chartType !== 'scatter' ? {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '数值'
          }
        },
        x: {
          title: {
            display: true,
            text: '时间'
          }
        }
      } : undefined,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      }
    }
  })
}

// 切换图表类型
const changeChartType = (type) => {
  config.value.chartType = type
  emit('analysis-config', config.value)
  
  // 重新初始化图表
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
  initChart()
}

// 清除图表数据
const clearChart = () => {
  chartData.value.labels = []
  chartData.value.datasets[0].data = []
  updateChart()
}

// 切换分析功能
const toggleAnalysis = () => {
  config.value.enabled = !config.value.enabled
  emit('analysis-config', config.value)
  
  if (!config.value.enabled) {
    clearChart()
  }
}

// 监听接收数据
watch(() => props.receivedData, (newData) => {
  if (newData) {
    processData(newData)
  }
}, { deep: true })

onMounted(() => {
  // 确保 Chart.js 已加载
  if (typeof Chart !== 'undefined') {
    initChart()
  }
})

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
})
</script>

<template>
  <div class="analysis-panel">
    <div class="analysis-header">
      <h2>数据分析</h2>
      <div class="analysis-controls">
        <label class="checkbox-label">
          <input type="checkbox" v-model="config.enabled" @change="toggleAnalysis"> 启用分析
        </label>
        <button class="clear-button" @click="clearChart">清空数据</button>
      </div>
    </div>
    
    <div class="analysis-content">
      <div class="analysis-config">
        <h3>配置</h3>
        <div class="config-grid">
          <div class="config-item">
            <label>图表类型:</label>
            <select 
              v-model="config.chartType"
              @change="changeChartType(config.chartType)"
            >
              <option v-for="type in chartTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>
          <div class="config-item">
            <label>最大数据点:</label>
            <input 
              type="number" 
              v-model.number="config.maxDataPoints"
              min="10"
              max="1000"
              @change="emit('analysis-config', config)"
            >
          </div>
          <div class="config-item">
            <label>刷新间隔(ms):</label>
            <input 
              type="number" 
              v-model.number="config.refreshInterval"
              min="100"
              max="5000"
              @change="emit('analysis-config', config)"
            >
          </div>
        </div>
      </div>
      
      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
      
      <div class="analysis-info">
        <h3>使用说明</h3>
        <ul>
          <li>1. 启用分析功能</li>
          <li>2. 配置数据提取正则表达式</li>
          <li>3. 串口发送包含数字的数据</li>
          <li>4. 查看实时数据图表</li>
          <li>5. 调整配置以获得最佳效果</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.analysis-panel {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.analysis-header h2 {
  color: #333333;
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.analysis-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #555555;
  cursor: pointer;
  font-weight: 500;
}

.clear-button {
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  color: #555555;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.clear-button:hover {
  background-color: #f8f9fa;
  border-color: #667eea;
  color: #667eea;
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-container {
  height: 400px;
  position: relative;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e0e0e0;
}

.analysis-config {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e0e0e0;
}

.analysis-config h3 {
  color: #333333;
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.config-item label {
  color: #555555;
  font-size: 14px;
  font-weight: 500;
}

.config-item input {
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  color: #333333;
  font-size: 14px;
  transition: all 0.3s ease;
}

.config-item input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.analysis-info {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e0e0e0;
}

.analysis-info h3 {
  color: #333333;
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.analysis-info ul {
  margin: 0;
  padding-left: 20px;
  color: #555555;
  font-size: 14px;
  line-height: 1.5;
}

.analysis-info li {
  margin-bottom: 5px;
}

@media (max-width: 768px) {
  .analysis-panel {
    padding: 20px;
  }
  
  .analysis-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .analysis-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .chart-container {
    height: 300px;
  }
  
  .config-grid {
    grid-template-columns: 1fr;
  }
}
</style>