<template>
  <main class="hero-content">
    <div class="hero-text">
      <h1 class="hero-title">{{ typingText }}<span class="cursor-blink">|</span></h1>
    </div>

    <div class="hero-buttons">
      <button class="btn btn-primary" @click="navigateTo('/home')">开始阅读</button>
      <button class="btn btn-secondary" @click="navigateTo('/about')">关于我</button>
    </div>

    <div class="hero-cards">
      <div class="glass-card">
        <Heatmap />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Heatmap from './Heatmap.vue'

const router = useRouter()
const navigateTo = (path) => router.push(path)

const texts = [
  'Welcome to Cnkrru\'s Blog',
  '欢迎来到 Cnkrru 的博客'
]
let textIdx = 0
let charIdx = 0
let isDeleting = false
const typingText = ref('')
let timer = null

function type() {
  const current = texts[textIdx]
  if (!isDeleting) {
    typingText.value = current.slice(0, charIdx + 1)
    charIdx++
    if (charIdx === current.length) {
      timer = setTimeout(() => { isDeleting = true; type() }, 3000)
      return
    }
  } else {
    typingText.value = current.slice(0, charIdx - 1)
    charIdx--
    if (charIdx === 0) {
      isDeleting = false
      textIdx = (textIdx + 1) % texts.length
    }
  }
  timer = setTimeout(type, isDeleting ? 40 : 100)
}

onMounted(() => { timer = setTimeout(type, 500) })
onUnmounted(() => { if (timer) clearTimeout(timer) })
</script>

<style scoped>
.hero-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh + 30px);
  padding: 100px 2rem 3rem;
  text-align: center;
}

.hero-text {
  margin-bottom: 2rem;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
  color: var(--common-color-1);
}

.cursor-blink {
  color: var(--common-color-1);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn {
  padding: 12px 32px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 28px;
  border: none;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, opacity 0.2s ease;
}

.btn:hover { transform: translateY(-2px); }

.btn-primary {
  background: var(--common-color-1);
  color: #fff;
  box-shadow: 0 4px 16px var(--common-shadow);
}

.btn-primary:hover { box-shadow: 0 8px 24px var(--common-shadow); }

.btn-secondary {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
  color: var(--common-text);
  border: 1px solid color-mix(in srgb, var(--common-text) 10%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.btn-secondary:hover { background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5); }

.hero-cards {
  max-width: 720px;
  width: 100%;
}

.glass-card {
  border-radius: 16px;
  padding: 24px;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
  display: flex;
  justify-content: center;
}
</style>

<style scoped>
@media (max-width: 768px) {
  .hero-content {
    padding: 3rem 1.5rem 2rem;
  }
  .hero-title {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
  }
  .glass-card {
    padding: 16px;
  }
}

@media (max-width: 640px) {
  .hero-content {
    padding: 3rem 1rem 2rem;
  }
  .hero-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 280px;
    margin-bottom: 2.5rem;
  }
  .btn { width: 100%; }
  .glass-card {
    padding: 14px;
  }
}
</style>
