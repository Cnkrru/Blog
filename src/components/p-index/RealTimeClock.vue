<template>
  <div class="real-time-clock" :class="`clock-${size}`">
    <div class="clock-card">
      <div class="card-number">{{ hours }}</div>
      <div class="card-label">时</div>
    </div>
    <div class="clock-separator">:</div>
    <div class="clock-card">
      <div class="card-number">{{ minutes }}</div>
      <div class="card-label">分</div>
    </div>
    <div class="clock-separator">:</div>
    <div class="clock-card">
      <div class="card-number">{{ seconds }}</div>
      <div class="card-label">秒</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const hours = ref('00')
const minutes = ref('00')
const seconds = ref('00')
let timer = null

const updateTime = () => {
  const now = new Date()
  hours.value = String(now.getHours()).padStart(2, '0')
  minutes.value = String(now.getMinutes()).padStart(2, '0')
  seconds.value = String(now.getSeconds()).padStart(2, '0')
}

onMounted(() => {
  // 初始更新时间
  updateTime()
  // 每秒更新一次
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  // 清理定时器
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.real-time-clock {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 30px 0;
  justify-content: center;
}

/* Small size */
.clock-small {
  gap: 10px;
  margin: 15px 0;
}

.clock-small .clock-card {
  padding: 12px;
  min-width: 60px;
}

.clock-small .card-number {
  font-size: 1.5rem;
  margin-bottom: 4px;
}

.clock-small .card-label {
  font-size: 0.8rem;
}

.clock-small .clock-separator {
  font-size: 1.2rem;
}

/* Medium size (default) */
.clock-medium {
  gap: 16px;
  margin: 30px 0;
}

.clock-medium .clock-card {
  padding: 20px;
  min-width: 80px;
}

.clock-medium .card-number {
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.clock-medium .card-label {
  font-size: 0.9rem;
}

.clock-medium .clock-separator {
  font-size: 2rem;
}

/* Large size */
.clock-large {
  gap: 20px;
  margin: 40px 0;
}

.clock-large .clock-card {
  padding: 28px;
  min-width: 100px;
}

.clock-large .card-number {
  font-size: 3.5rem;
  margin-bottom: 12px;
}

.clock-large .card-label {
  font-size: 1rem;
}

.clock-large .clock-separator {
  font-size: 2.5rem;
}

/* Base styles */
.clock-card {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid var(--card-border);
  text-align: center;
  transition: all 0.3s ease;
}

.clock-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border-color: var(--accent-fg);
}

.card-number {
  font-weight: bold;
  background: var(--logo-gradient);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease infinite;
  line-height: 1;
}

.card-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.clock-separator {
  font-weight: bold;
  color: var(--text-primary);
  line-height: 1;
}

/* 响应式设计 */
@media (max-width: 575.98px) {
  .real-time-clock {
    gap: 8px;
  }
  
  .clock-card {
    padding: 12px;
    min-width: 60px;
  }
  
  .card-number {
    font-size: 1.8rem;
  }
  
  .card-label {
    font-size: 0.8rem;
  }
  
  .clock-separator {
    font-size: 1.5rem;
  }
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .real-time-clock {
    gap: 12px;
  }
  
  .clock-card {
    padding: 16px;
    min-width: 70px;
  }
  
  .card-number {
    font-size: 2rem;
  }
  
  .clock-separator {
    font-size: 1.8rem;
  }
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}


</style>