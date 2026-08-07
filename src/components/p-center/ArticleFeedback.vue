<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ postId: string }>()

type Feedback = 'up' | 'down' | null

const feedback = ref<Feedback>(null)
const storageKey = `article-feedback-${props.postId}`

onMounted(() => {
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved === 'up' || saved === 'down') {
      feedback.value = saved
    }
  } catch {}
})

function submit(type: Feedback) {
  if (feedback.value === type) {
    feedback.value = null
    try { localStorage.removeItem(storageKey) } catch {}
    return
  }
  feedback.value = type
  try { localStorage.setItem(storageKey, type) } catch {}
}
</script>

<template>
  <div class="article-feedback">
    <span class="feedback-label">这篇文章对你有用吗？</span>
    <div class="feedback-buttons">
      <button
        class="feedback-btn"
        :class="{ active: feedback === 'up' }"
        title="有用"
        @click="submit('up')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
        </svg>
        <span>有用</span>
      </button>
      <button
        class="feedback-btn"
        :class="{ active: feedback === 'down' }"
        title="没用"
        @click="submit('down')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
          <path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/>
        </svg>
        <span>没用</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 布局 */
.article-feedback {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
  flex-wrap: wrap;
}

.feedback-label {
  font-size: 0.95rem;
}

.feedback-buttons {
  display: flex;
  gap: 8px;
}

.feedback-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 20px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background: transparent;
}

.feedback-btn:hover {
  transform: translateY(-1px);
}

.feedback-btn.active {
  transform: scale(1.05);
}

/* 颜色 — 使用 CSS 变量适配主题 */
.feedback-label {
  color: var(--common-text);
  opacity: 0.7;
}

.feedback-btn {
  color: var(--common-text);
  opacity: 0.55;
  border-color: color-mix(in srgb, var(--common-text) 15%, transparent);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.4);
}

.feedback-btn:hover {
  opacity: 0.8;
  border-color: color-mix(in srgb, var(--common-text) 25%, transparent);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.6);
}

.feedback-btn.active {
  opacity: 1;
  border-color: var(--common-color-1);
  background: color-mix(in srgb, var(--common-color-1) 15%, transparent);
  color: var(--common-color-1);
}
</style>