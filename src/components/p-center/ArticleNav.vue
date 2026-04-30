<template>
  <div class="post-nav-container">
    <button
      class="post-nav-btn prev"
      :class="{ disabled: !prevPost, loading: loadingPrev }"
      @click="handlePrev"
      :disabled="!prevPost"
    >
      <span class="post-nav-btn-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </span>
      <div class="post-nav-btn-text">
        <span class="post-nav-btn-label">上一篇</span>
        <span class="post-nav-btn-title">{{ prevPost?.title || '暂无' }}</span>
      </div>
      <div v-if="loadingPrev" class="post-nav-loading"></div>
    </button>

    <button
      class="post-nav-btn next"
      :class="{ disabled: !nextPost, loading: loadingNext }"
      @click="handleNext"
      :disabled="!nextPost"
    >
      <div class="post-nav-btn-text">
        <span class="post-nav-btn-label">下一篇</span>
        <span class="post-nav-btn-title">{{ nextPost?.title || '暂无' }}</span>
      </div>
      <span class="post-nav-btn-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </span>
      <div v-if="loadingNext" class="post-nav-loading"></div>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  prevPost: {
    type: Object,
    default: null
  },
  nextPost: {
    type: Object,
    default: null
  }
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
.post-nav-container {
  position: relative;
  width: 100%;
  margin: 30px 0;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-radius: 16px;
}

.post-nav-btn {
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

.post-nav-btn.prev {
  justify-content: flex-start;
  gap: 12px;
}

.post-nav-btn.next {
  justify-content: flex-end;
  gap: 12px;
}

.post-nav-btn-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.post-nav-btn-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
  min-width: 0;
}

.post-nav-btn.prev .post-nav-btn-text {
  align-items: flex-start;
  text-align: left;
}

.post-nav-btn.next .post-nav-btn-text {
  align-items: flex-end;
  text-align: right;
}

.post-nav-btn-label {
  font-size: 12px;
  font-weight: 500;
  opacity: 0.7;
  letter-spacing: 0.5px;
}

.post-nav-btn-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.post-nav-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 交互状态 */
.post-nav-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.post-nav-btn:not(.disabled):hover .post-nav-btn-icon {
  transform: scale(1.1);
}

.post-nav-btn:not(.disabled):hover {
  transform: translateY(-2px);
}

.post-nav-btn:not(.disabled):active {
  transform: translateY(-1px);
}

.post-nav-btn.loading {
  cursor: wait;
}

.post-nav-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.3);
}
</style>

<style scoped>
/* ========== 样式与主题 (Theme) ========== */
.post-nav-container {
  background: var(--common-bg);
  border: 1px solid var(--common-color-1);
}

.post-nav-btn {
  background-color: var(--common-color-1);
  border: 2px solid var(--common-color-2);
  color: var(--common-content);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.post-nav-btn:hover {
  background-color: var(--common-hover);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.post-nav-btn:not(.disabled):active {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-nav-btn-label,
.post-nav-btn-title {
  color: var(--common-content);
}
</style>

<style scoped>
/* ========== 响应式适配 (Responsive) ========== */
@media (max-width: calc(var(--sm) - 1px)) {
  .post-nav-container {
    flex-direction: column;
    gap: 8px;
    padding: 6px;
  }

  .post-nav-btn {
    padding: 12px 15px;
    min-height: 60px;
  }

  .post-nav-btn-label {
    font-size: 11px;
  }

  .post-nav-btn-title {
    font-size: 12px;
  }

  .post-nav-btn-icon {
    width: 20px;
    height: 20px;
  }
}

@media (min-width: var(--sm)) and (max-width: calc(var(--md) - 1px)) {
  .post-nav-container {
    gap: 12px;
    padding: 6px;
  }

  .post-nav-btn {
    padding: 14px 18px;
    min-height: 68px;
  }

  .post-nav-btn-label {
    font-size: 12px;
  }

  .post-nav-btn-title {
    font-size: 13px;
  }
}

@media (min-width: var(--md)) and (max-width: calc(var(--lg) - 1px)) {
  .post-nav-btn {
    padding: 15px 22px;
    min-height: 70px;
  }

  .post-nav-btn-title {
    font-size: 13.5px;
  }
}

@media (min-width: var(--xl)) and (max-width: var(--2xl)) {
  .post-nav-btn {
    padding: 18px 24px;
    min-height: 76px;
  }

  .post-nav-btn-title {
    font-size: 14.5px;
  }
}
</style>