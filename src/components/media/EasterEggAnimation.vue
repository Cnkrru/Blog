<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{ text?: string; finalText?: string }>(), {
  text: '欢迎来到我的博客',
  finalText: '欢迎来到我的博客'
})

const isAnimating = ref(false)
const showFinalText = ref(false)
const chars = ref<{ char: string; x: number; y: number; opacity: number; id: number }[]>([])
let charId = 0

function triggerEasterEgg() {
  if (isAnimating.value) return
  isAnimating.value = true
  showFinalText.value = false
  chars.value = []

  const arr = props.text.split('')
  const vw = window.innerWidth
  const charW = Math.min(140, (vw - 40) / arr.length)
  const totalW = arr.length * charW
  const startX = (vw - totalW) / 2

  arr.forEach((c, i) => {
    const x = startX + i * charW + charW / 2
    setTimeout(() => {
      chars.value.push({ char: c, x, y: -80, opacity: 1, id: charId++ })
      setTimeout(() => {
        chars.value = chars.value.map(ch => ch.id === charId - 1 ? { ...ch, y: window.innerHeight / 2 } : ch)
      }, 50)
    }, i * 80 + 200)
  })

  setTimeout(() => {
    chars.value = []
    setTimeout(() => {
      showFinalText.value = true
      setTimeout(() => {
        showFinalText.value = false
        isAnimating.value = false
      }, 2500)
    }, 200)
  }, arr.length * 80 + 1400)
}

onMounted(() => {})
</script>

<template>
  <div class="egg-wrap">
    <button class="egg-btn" @click="triggerEasterEgg" :disabled="isAnimating">
      {{ isAnimating ? '...' : '点击一下试试?' }}
    </button>

    <Teleport to="body">
      <div v-if="isAnimating" class="egg-backdrop"></div>
      <div v-if="isAnimating" class="egg-overlay">
        <div
          v-for="ch in chars"
          :key="ch.id"
          class="egg-char"
          :style="{ left: ch.x + 'px', top: ch.y + 'px', opacity: ch.opacity }"
        >{{ ch.char }}</div>
        <div v-if="showFinalText" class="egg-final">{{ finalText }}</div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.egg-wrap {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}
.egg-btn {
  padding: 8px 28px;
  border-radius: 24px;
  border: 1px solid;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, background-color 0.2s ease;
  background: rgba(255, 192, 203, 0.2);
  border-color: rgba(255, 192, 203, 0.35);
  color: var(--common-text);
}
body.dark-theme .egg-btn {
  background: rgba(58, 170, 231, 0.15);
  border-color: rgba(58, 170, 231, 0.25);
}
.egg-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  background: rgba(255, 192, 203, 0.4);
  box-shadow: 0 4px 12px var(--common-shadow);
}
body.dark-theme .egg-btn:hover:not(:disabled) {
  background: rgba(58, 170, 231, 0.3);
}
.egg-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
.egg-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 99998;
  pointer-events: none;
}
.egg-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.egg-char {
  position: fixed;
  font-size: clamp(60px, 10vw, 140px);
  font-weight: 800;
  color: var(--common-color-1);
  transform: translate(-50%, -50%);
  transition: top 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
  text-shadow: 0 0 40px rgba(255, 192, 203, 0.4);
  will-change: top;
}
.egg-final {
  font-size: clamp(40px, 8vw, 100px);
  font-weight: 800;
  color: var(--common-color-1);
  text-shadow: 0 0 60px rgba(255, 192, 203, 0.5);
  animation: egg-pop 0.5s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes egg-pop {
  from { transform: scale(0.3); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
