<template>
  <div class="nav-wrap">
    <button
      class="nav-btn prev"
      :class="{ disabled: !prevPost, loading: loadingPrev }"
      @click="handlePrev"
      :disabled="!prevPost"
      aria-label="上一篇文章"
    >
      <span class="nav-icon">
        <span class="svg-icon" :style="{ width: '20px', height: '20px' }" v-html="arrowLeftSvg"></span>
      </span>
      <div class="nav-text">
        <span class="nav-label">上一篇</span>
        <span class="nav-title">{{ prevPost?.title || '暂无' }}</span>
      </div>
      <div v-if="loadingPrev" class="nav-loading"></div>
    </button>

    <button
      class="nav-btn next"
      :class="{ disabled: !nextPost, loading: loadingNext }"
      @click="handleNext"
      :disabled="!nextPost"
      aria-label="下一篇文章"
    >
      <div class="nav-text">
        <span class="nav-label">下一篇</span>
        <span class="nav-title">{{ nextPost?.title || '暂无' }}</span>
      </div>
      <span class="nav-icon">
        <span class="svg-icon" :style="{ width: '20px', height: '20px' }" v-html="arrowRightSvg"></span>
      </span>
      <div v-if="loadingNext" class="nav-loading"></div>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import arrowLeftSvg from '@/assets/svg/arrow-left.svg?raw'
import arrowRightSvg from '@/assets/svg/arrow-right.svg?raw'

const props = defineProps({
  prevPost: { default: null },
  nextPost: { default: null }
})

const emit = defineEmits(['navigate'])

const loadingPrev = ref(false)
const loadingNext = ref(false)

const handlePrev = async () => {
  if (!props.prevPost || loadingPrev.value) return
  loadingPrev.value = true
  try {
    emit('navigate', props.prevPost)
  } finally {
    loadingPrev.value = false
  }
}

const handleNext = async () => {
  if (!props.nextPost || loadingNext.value) return
  loadingNext.value = true
  try {
    emit('navigate', props.nextPost)
  } finally {
    loadingNext.value = false
  }
}

const handleKeydown = (e) => {
  if (e.key === 'ArrowLeft' && props.prevPost) {
    handlePrev()
  } else if (e.key === 'ArrowRight' && props.nextPost) {
    handleNext()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* ========== 布局与结构 (Layout) ========== */
.nav-wrap {
  position: relative;
  width: 100%;
  margin: 30px 0;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-radius: 16px;
}

.nav-btn {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 72px;
  border: none;
}

.nav-btn.prev {
  justify-content: flex-start;
  gap: 12px;
}

.nav-btn.next {
  justify-content: flex-end;
  gap: 12px;
}

.nav-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.nav-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
  min-width: 0;
}

.nav-btn.prev .nav-text {
  align-items: flex-start;
  text-align: left;
}

.nav-btn.next .nav-text {
  align-items: flex-end;
  text-align: right;
}

.nav-label {
  font-size: 12px;
  font-weight: 500;
  opacity: 0.7;
  letter-spacing: 0.5px;
}

.nav-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.nav-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--common-color-1) 20%, transparent), transparent);
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 交互状态 */
.nav-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn:not(.disabled):hover .nav-icon {
  transform: scale(1.1);
}

.nav-btn:not(.disabled):hover {
  transform: translateY(-2px);
}

.nav-btn:not(.disabled):active {
  transform: translateY(-1px);
}

.nav-btn.loading {
  cursor: wait;
}

.nav-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--common-color-1) 40%, transparent);
}
</style>

<style scoped>
/* ========== 样式与主题 (Theme) — 使用 CSS 变量，无 body.dark-theme 硬编码 ========== */
.nav-wrap {
  background: transparent;
  border: none;
}

.nav-btn {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) * 0.6));
  border: 1px solid color-mix(in srgb, var(--common-color-1) 12%, transparent);
  color: var(--common-text);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.nav-btn:hover {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) * 0.8));
  border-color: var(--common-color-1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.nav-label,
.nav-title {
  color: var(--common-text);
}

.nav-icon {
  color: var(--common-color-1);
}
</style>

<style scoped>
/* ========== 响应式适配 (Responsive) ========== */
@media (max-width: 640px) {
  .nav-wrap {
    flex-direction: column;
    gap: 8px;
    padding: 6px;
  }

  .nav-btn {
    padding: 12px 15px;
    min-height: 60px;
  }

  .nav-label {
    font-size: 11px;
  }

  .nav-title {
    font-size: 12px;
  }

  .nav-icon {
    width: 20px;
    height: 20px;
  }
}

@media (min-width: 640px) and (max-width: 767px) {
  .nav-wrap {
    gap: 12px;
    padding: 6px;
  }

  .nav-btn {
    padding: 14px 18px;
    min-height: 68px;
  }

  .nav-label {
    font-size: 12px;
  }

  .nav-title {
    font-size: 13px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .nav-btn {
    padding: 15px 22px;
    min-height: 70px;
  }

  .nav-title {
    font-size: 13.5px;
  }
}

@media (min-width: 1280px) and (max-width: 1536px) {
  .nav-btn {
    padding: 18px 24px;
    min-height: 76px;
  }

  .nav-title {
    font-size: 14.5px;
  }
}
</style>