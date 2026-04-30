<script setup lang="ts">
const toggleImmersiveReading = () : void => {
  document.body.classList.toggle('immersive-reading');
}
</script>

<template>
  <div class="button-style" @click="toggleImmersiveReading">
    <img src="../../assets/imgs/svg/book.svg" alt="沉浸式阅读">
  </div>
</template>

<!-- 布局样式 -->
<style>
.left-blank,
.left-asider-S,
.left-center-blank,
.center-S,
.mid-flex,
.footer-blank,
.footer-flex,
.footer-S {
    transition: all 0.3s ease;
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
    max-height: none;
    height: auto;
}
</style>

<!-- 颜色样式 -->
<style>
/* 按钮颜色由 Header.vue 统一管理 */
</style>

<!-- 响应式设计媒体查询 -->
<style>
@media (max-width: var(--sm)) {
    body.immersive-reading .center-S {
        width: 100%;
        max-width: 100%;
    }
    body.immersive-reading .mid-flex {
        padding-left: 10px;
        padding-right: 10px;
    }
}

@media (max-width: var(--md)) {
    body.immersive-reading .center-S {
        width: 90%;
        max-width: 90%;
    }
    body.immersive-reading .mid-flex {
        padding-left: 15px;
        padding-right: 15px;
        align-items: flex-start;
    }
    body.immersive-reading .center-card {
        max-height: none;
        height: auto;
    }
}

@media (max-width: var(--lg)) {
    body.immersive-reading .center-S {
        width: 700px;
        max-width: 700px;
    }
    body.immersive-reading .mid-flex {
        padding-left: 20px;
        padding-right: 20px;
        align-items: flex-start;
    }
    body.immersive-reading .center-card {
        max-height: none;
        height: auto;
    }
}

@media (max-width: var(--xl)) {
    body.immersive-reading .center-S {
        width: 900px;
        max-width: 900px;
    }
    body.immersive-reading .mid-flex {
        align-items: flex-start;
    }
    body.immersive-reading .center-card {
        max-height: none;
        height: auto;
    }
}

@media (max-width: var(--2xl)) {
    body.immersive-reading .center-S {
        width: 1400px;
        max-width: 1400px;
    }
    body.immersive-reading .mid-flex {
        align-items: flex-start;
    }
    body.immersive-reading .center-card {
        max-height: none;
        height: auto;
    }
}
</style>
