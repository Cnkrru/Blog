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

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{ size?: 'small' | 'medium' | 'large' }>(), {
  size: 'medium'
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
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
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

.clock-card {
  border-radius: 14px;
  text-align: center;
  border: 1px solid;
}

.card-number {
  line-height: 1;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 2px;
}

.card-label {
  font-weight: 500;
  font-size: 12px;
  opacity: 0.5;
}

.clock-separator {
  font-weight: 300;
  line-height: 1;
}
</style>

<style scoped>
.clock-card {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

body.dark-theme .clock-card {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.06);
}

.card-number {
  color: var(--common-text);
}

body.dark-theme .card-number {
  color: #fff;
}

.card-label {
  color: var(--common-text);
}

.clock-separator {
  color: var(--common-text);
  opacity: 0.4;
}
</style>

<style scoped>
@media (max-width: 639px) {
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

@media (max-width: 640px) {
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
</style>
