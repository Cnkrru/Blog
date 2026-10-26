<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <main class="main">
    <RouterView v-slot="{ Component }">
      <!-- 以 path 作 key：/post/:id 是同一条路由记录，不换 key 会复用组件实例、setup 不重跑，子组件残留上一篇数据 -->
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>
</template>

<style scoped>
.main {
  width: 85%;
  /* 固定高度改为最大高度：正文最高 600px，超出部分在容器内滚动 */
  max-height: 600px;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  gap: var(--space-sm);

  padding: var(--space-md);

  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), var(--glass-opacity, 0.6));
  border: var(--border-width) solid color-mix(in srgb, var(--g-text) 10%, transparent);
}

/* 页面切换：淡入 + 8px 横向位移。
   mode="out-in" 保证同一时刻只有一个页面在动画，且页面内 fixed 浮层（PostToc）已 Teleport 到 body，
   不受 transform 包含块影响 */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateX(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

/* ====================<响应式>==================== */

@media (max-width: 768px) {
  /* [响应式-sm] 手机：主内容占满宽度 */
  .main {
    width: 100%;
    /* 解除基础样式的 max-height:600px 与内部滚动，改回整页滚动
       （scrollProgress 检测到 .main 不可滚会自动回落 window，进度环不受影响） */
    max-height: none;
    overflow-y: visible;
  }
}
</style>
