<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => {
  router.push('/')
}

const countdown = ref(10)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      router.push('/')
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const floatingDots = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  style: {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${3 + Math.random() * 4}s`,
    width: `${4 + Math.random() * 8}px`,
    height: `${4 + Math.random() * 8}px`
  }
}))
</script>

<template>
  <div class="not-found-wrapper">
    <div class="floating-dots">
      <span
        v-for="dot in floatingDots"
        :key="dot.id"
        class="dot"
        :style="dot.style"
      ></span>
    </div>

    <div class="not-found-content">
      <div class="error-code">
        <span class="digit">4</span>
        <span class="digit zero">0</span>
        <span class="digit">4</span>
      </div>

      <div class="glitch-text">页面不存在</div>

      <p class="sub-text">
        你来到了没有知识的荒原...
      </p>

      <div class="actions">
        <button class="back-btn" @click="goHome">
          <span class="btn-icon">🏠</span>
          返回首页
        </button>
      </div>

      <p class="countdown-text">
        {{ countdown }} 秒后自动返回首页
      </p>
    </div>
  </div>
</template>

<!-- 布局样式 -->
<style scoped>
.not-found-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.floating-dots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.dot {
  position: absolute;
  border-radius: 50%;
  animation: float ease-in-out infinite;
}

.not-found-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 40px;
}

.error-code {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.digit {
  font-size: 120px;
  font-weight: 900;
  line-height: 1;
  animation: pulse 2s ease-in-out infinite;
}

.digit.zero {
  animation: rotate3d 4s ease-in-out infinite;
}

.glitch-text {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: 4px;
}

.sub-text {
  font-size: 16px;
  margin-bottom: 32px;
  opacity: 0.7;
  line-height: 1.6;
}

.actions {
  margin-bottom: 24px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border: 2px solid;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
}

.back-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px var(--common-shadow);
}

.btn-icon {
  font-size: 18px;
}

.countdown-text {
  font-size: 13px;
  opacity: 0.5;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-30px) scale(1.5);
    opacity: 0.6;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

@keyframes rotate3d {
  0%, 100% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
}
</style>

<!-- 颜色样式 -->
<style scoped>
.not-found-wrapper {
  background: var(--common-bg);
}

.dot {
  background: var(--common-color-1);
}

.digit {
  color: var(--common-color-1);
  text-shadow: 0 4px 20px var(--common-shadow);
}

.glitch-text {
  color: var(--common-text);
}

.sub-text {
  color: var(--common-text);
}

.back-btn {
  color: var(--common-color-1);
  border-color: var(--common-color-1);
}

.back-btn:hover {
  background: var(--common-color-1);
  color: var(--common-content);
}

.countdown-text {
  color: var(--common-text);
}
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
@media (max-width: var(--md)) {
  .digit {
    font-size: 80px;
  }

  .glitch-text {
    font-size: 22px;
  }

  .sub-text {
    font-size: 14px;
  }

  .not-found-content {
    padding: 20px;
  }
}

@media (max-width: var(--sm)) {
  .digit {
    font-size: 60px;
    gap: 6px;
  }

  .error-code {
    gap: 8px;
  }

  .glitch-text {
    font-size: 18px;
  }

  .back-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
