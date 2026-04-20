<template>
  <div class="door-transition" v-if="isActive">
    <div class="door door-left" :class="{ 'open': isOpening }"></div>
    <div class="door door-right" :class="{ 'open': isOpening }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isActive = ref(false)
const isOpening = ref(false)
let navigationGuard = null

// 监听路由变化，触发动画
const setupNavigationGuard = () => {
  navigationGuard = router.beforeEach((to, from, next) => {
    // 只在从Index页面跳转时触发动画
    if (from.path === '/' && to.path !== '/') {
      isActive.value = true
      
      // 触发开门动画
      setTimeout(() => {
        isOpening.value = true
      }, 100)
      
      // 动画结束后完成跳转
      setTimeout(() => {
        next()
        
        // 重置动画状态
        setTimeout(() => {
          isOpening.value = false
          isActive.value = false
        }, 500)
      }, 1000)
    } else {
      next()
    }
  })
}

onMounted(() => {
  setupNavigationGuard()
})

onUnmounted(() => {
  if (navigationGuard) {
    router.beforeEach(navigationGuard)
  }
})
</script>

<style scoped>
.door-transition {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  pointer-events: none;
}

.door {
  position: absolute;
  top: 0;
  height: 100vh;
  width: 50vw;
  background: var(--logo-gradient);
  background-size: 400% 400%;
  animation: gradient-shift 3s ease infinite;
  transition: transform 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  pointer-events: none;
}

.door-left {
  left: 0;
  transform-origin: left center;
}

.door-right {
  right: 0;
  transform-origin: right center;
}

.door.open {
  transform: rotateY(90deg);
}


</style>