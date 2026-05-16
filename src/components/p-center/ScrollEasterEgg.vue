<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const showEasterEgg = ref(false)
const hearts = ref<{ id: number; left: number; emoji: string }[]>([])
const heartEmojis = ['❤️', '💖', '💕', '💗', '💓', '💘', '💝']
let heartId = 0

const checkScroll = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (scrollTop >= docHeight - 50) {
    triggerEasterEgg()
  }
}

const triggerEasterEgg = () => {
  if (showEasterEgg.value) return
  showEasterEgg.value = true
  spawnHearts()
  setTimeout(() => {
    showEasterEgg.value = false
    hearts.value = []
  }, 2500)
}

const spawnHearts = () => {
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const left = Math.random() * 80 + 10
      const emoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)]
      hearts.value.push({ id: heartId++, left, emoji })
    }, i * 200)
  }
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<template>
  <div v-if="showEasterEgg" class="scroll-easter-egg">
    <div
      v-for="heart in hearts"
      :key="heart.id"
      class="floating-heart"
      :style="{ left: `${heart.left}%`, animationDelay: `${Math.random() * 0.3}s` }"
    >
      {{ heart.emoji }}
    </div>
  </div>
</template>

<style scoped>
.scroll-easter-egg {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.floating-heart {
  position: absolute;
  bottom: 0;
  font-size: 24px;
  animation: floatUp 2s ease-out forwards;
  opacity: 0;
}

@keyframes floatUp {
  0% {
    opacity: 1;
    transform: translateY(0) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translateY(-30vh) scale(1.2) rotate(-10deg);
  }
  100% {
    opacity: 0;
    transform: translateY(-60vh) scale(0.8) rotate(10deg);
  }
}
</style>