<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import { comment, refCommentFailed, refCommentLoading } from '../../composables/pamin/post.ts'
import { refText } from '../../composables/i18n.ts'

// 每次进入文章页重新走一次加载态：脚本虽已缓存，iframe 仍需重新构建
refCommentLoading.value = true
refCommentFailed.value = false

onMounted(async () => {
  try {
    await import('giscus')
    // 等自定义元素完成一次渲染再收起骨架
    await nextTick()
  } catch {
    refCommentFailed.value = true
  } finally {
    refCommentLoading.value = false
  }
})
</script>

<template>
  <div class="comment">
    <p class="comment-head">{{ refText.commentTitle }}</p>
    <p class="comment-text">{{ refText.commentPlaceholder }}</p>
    <div
      class="comment-box"
      :class="{ 'comment-box-loading': refCommentLoading }"
      :aria-busy="refCommentLoading"
    >
      <!-- vite-ssg组件，只在客户端渲染 -->
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

      <!-- 加载态骨架：覆盖在未就绪的 iframe 上，widget 本身保持挂载 -->
      <div v-if="refCommentLoading" class="comment-skeleton" aria-hidden="true">
        <div class="comment-skeleton-head">
          <span class="comment-skeleton-avatar"></span>
          <div class="comment-skeleton-lines">
            <span class="comment-skeleton-line comment-skeleton-line-long"></span>
            <span class="comment-skeleton-line comment-skeleton-line-short"></span>
          </div>
        </div>
        <div class="comment-skeleton-input"></div>
      </div>

      <!-- 脚本导入失败时的可操作提示 -->
      <p v-if="refCommentFailed" class="comment-failed">{{ refText.commentFailed }}</p>
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
  position: relative;

  width: 100%;
  height: fit-content;
  min-height: 220px;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: var(--space-lg);
}

/* iframe 就绪前隐藏，避免骨架下面透出空白 iframe */
.comment-box-loading :deep(giscus-widget) {
  opacity: 0;
}

.comment-box :deep(giscus-widget) {
  transition: opacity 0.2s ease;
}

/* 评论骨架：绝对覆盖在 iframe 上，不参与鼠标事件 */
.comment-skeleton {
  position: absolute;
  inset: 0;
  z-index: 1;

  display: flex;
  flex-direction: column;
  gap: var(--space-md);

  padding: var(--space-lg);

  pointer-events: none;
}

.comment-skeleton-head {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.comment-skeleton-avatar {
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: var(--radius-full);
}

.comment-skeleton-lines {
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.comment-skeleton-line {
  height: 12px;
  border-radius: var(--radius-full);
}

.comment-skeleton-line-long {
  width: 58%;
}

.comment-skeleton-line-short {
  width: 34%;
}

.comment-skeleton-input {
  height: 96px;
  border-radius: var(--radius-md);
}

.comment-skeleton-avatar,
.comment-skeleton-line,
.comment-skeleton-input {
  background: color-mix(in srgb, var(--g-text) 10%, transparent);
  animation: comment-pulse 1.2s ease-in-out infinite;
}

@keyframes comment-pulse {
  50% {
    opacity: 0.45;
  }
}

.comment-failed {
  color: var(--g-text);
  font-size: 13px;
  opacity: 0.7;
}

/* ====================<响应式>==================== */

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

  .comment-skeleton {
    padding: var(--space-sm);
  }
}
</style>
