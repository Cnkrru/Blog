<script setup lang="ts">
import { onMounted } from 'vue'
import { comment } from '../../composables/pamin/post.ts'

onMounted(() => {
  import('giscus')
})
</script>

<template>
  <div class="comment">
    <p class="comment-head">评论</p>
    <p class="comment-text">想说点什么呢……</p>
    <div class="comment-box">
      <!-- giscus-widget 是 giscus 包注册的自定义元素，无需 vue 组件解析；
           ClientOnly 保证只在客户端渲染，computed 里访问 window 不会在构建期报错 -->
      <ClientOnly>
        <giscus-widget
          repo="Cnkrru/Blog"
          repo-id="R_kgDOSIEQLQ"
          category="General"
          category-id="DIC_kwDOSIEQLc4DDcAm"
          mapping="pathname"
          strict="0"
          reactions-enabled="1"
          emit-metadata="0"
          input-position="bottom"
          :theme="comment"
          lang="zh-CN"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.comment {
  width: 100%;
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: var(--space-sm);

  /* 边框统一主色 25%，全站视觉一致 */
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
  border-radius: var(--space-lg);
  margin: var(--space-sm);
}

.comment-head {
  width: 100%;
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;

  /* 分隔线统一主色 25%，全站视觉一致 */
  border-bottom: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
  margin: var(--space-sm);

  color: var(--g-text);
}

.comment-text {
  width: 100%;
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;

  color: var(--g-color);
  font-style: italic;
}

.comment-box {
  width: 100%;
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: var(--space-lg);
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
  /* [响应式-lg] 大屏 */
}

@media (max-width: 1024px) {
  /* [响应式-md] 平板 */
}

@media (max-width: 768px) {
  /* [响应式-sm] 手机：卡片外边距收紧，主体评论由 giscus 内部自适应 */
  .comment {
    margin: var(--space-xs);
  }
}

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏：内边距进一步收紧 */
  .comment-box {
    padding: var(--space-sm);
  }
}
</style>
