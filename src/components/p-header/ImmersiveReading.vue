<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import bookOpenSvg from '@/assets/svg/book-open.svg?raw'

const isImmersiveReading = ref(false)
const isAnimating = ref(false)
const router = useRouter()

const toggleImmersiveReading = () : void => {
  isImmersiveReading.value = true                           //沉浸阅读标志置为true
  isAnimating.value = true                                  //动画标志
  document.body.classList.toggle('immersive-reading')       //切换bodyCSS样式(功能实现)
  setTimeout(() => { isAnimating.value = false }, 400)      //超时时间设置为400ms
}

//路由切换，沉浸阅读功能的生命周期结束
onMounted(() => {
  router.afterEach(() => {
    document.body.classList.remove('immersive-reading')
  })
})
</script>

<template>
  <div class="button-style immersive-btn" title="沉浸式阅读" @click="toggleImmersiveReading">
    <span class="svg-icon" :style="{ width: '24px', height: '24px' }" v-html="bookOpenSvg"></span>
    <span v-if="isAnimating" class="emoji-burst">✨</span>
  </div>
</template>

<!-- 布局样式 -->
<style>

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

/* 无空隙布局下进入沉浸阅读：保持贴满，不出现 1400px 收缩与左右留白 */
html[data-layout="compact"] body.immersive-reading .center-S {
    width: auto;
    max-width: none;
    flex: 1;
}
html[data-layout="compact"] body.immersive-reading .mid-flex {
    padding-left: 0;
    padding-right: 0;
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
    html[data-layout="compact"] body.immersive-reading .mid-flex {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
}
</style>
