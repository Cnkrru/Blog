<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  output: {
    type: String,
    default: ''
  },
  executionTime: {
    type: Number,
    default: 0
  }
})

const outputRef = ref(null)

watch(() => props.output, () => {
  // 自动滚动到底部
  setTimeout(() => {
    if (outputRef.value) {
      outputRef.value.scrollTop = outputRef.value.scrollHeight
    }
  }, 0)
})
</script>

<template>
  <div class="output-panel">
    <div class="output-header">
      <h3>输出结果</h3>
      <div class="execution-info">
        <span class="time-info">执行时间: {{ executionTime.toFixed(2) }}ms</span>
      </div>
    </div>
    <div class="output-container">
      <div ref="outputRef" class="output-content" v-html="output"></div>
      <div v-if="!output" class="empty-output">
        <p>运行代码后，输出将显示在这里</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.output-panel {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.output-header h3 {
  color: #1a1a2e;
  font-size: 18px;
  font-weight: 600;
}

.execution-info {
  font-size: 12px;
  color: #666;
}

.time-info {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 12px;
}

.output-container {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  min-height: 300px;
}

.output-content {
  padding: 15px;
  height: 100%;
  overflow-y: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  background: #f8f9fa;
}

.empty-output {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* 输出样式 */
:deep(.log) {
  color: #333;
  margin-bottom: 5px;
}

:deep(.error) {
  color: #ff6b6b;
  font-weight: 500;
  margin-bottom: 5px;
}

:deep(.stack) {
  color: #666;
  font-size: 12px;
  margin-top: 5px;
  padding-left: 20px;
  border-left: 3px solid #ff6b6b;
}

/* 滚动条样式 */
.output-content::-webkit-scrollbar {
  width: 8px;
}

.output-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.output-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.output-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>