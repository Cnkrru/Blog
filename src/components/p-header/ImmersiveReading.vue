<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const isAnimating = ref(false)
const router = useRouter()

const toggleImmersiveReading = () : void => {
  isAnimating.value = true
  document.body.classList.toggle('immersive-reading')
  setTimeout(() => { isAnimating.value = false }, 400)
}

onMounted(() => {
  router.afterEach(() => {
    document.body.classList.remove('immersive-reading')
  })
})
</script>

<template>
  <div class="button-style immersive-btn" :class="{ animating: isAnimating }" @click="toggleImmersiveReading">
    <img src="../../assets/imgs/svg/book.svg" alt="沉浸式阅读">
    <span v-if="isAnimating" class="emoji-burst">✨</span>
  </div>
</template>

<!-- 布局样式 -->
<style>
.immersive-btn {}

@media (max-width: 480px) {
    .immersive-btn {
        display: none !important;
    }
}

body.immersive-reading .left-blank,
body.immersive-reading .left-asider-S,
body.immersive-reading .left-center-blank,
body.immersive-reading .footer-blank,
body.immersive-reading .footer-flex,
body.immersive-reading .footer-S {
    display: none;
}

body.immersive-reading .center-S {
    width: 1400px;
    max-width: 1400px;
}

body.immersive-reading .mid-flex {
    padding-left: 20px;
    padding-right: 20px;
    align-items: flex-start;
}

body.immersive-reading .center-card {
    max-height: none !important;
    height: auto !important;
}
</style>

<!-- 颜色样式 -->
<style>
/* 按钮颜色由 Header.vue 统一管理 */
</style>

<!-- 响应式设计媒体查询 -->
<style>
@media (max-width: 480px) {
    body.immersive-reading .center-S {
        width: 100% !important;
        max-width: 100% !important;
    }
    body.immersive-reading .mid-flex {
        padding-left: 10px !important;
        padding-right: 10px !important;
    }
}
</style>
