<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import type { Component } from 'vue'
import { useSeo } from '../composables/seo'
import { refText } from '../composables/i18n'
import { contentReady } from '../composables/pamin/post.ts'
import PostStatus from '../components/pmain/PostStatus.vue'
import PostEdit from '../components/pmain/PostEdit.vue'
import Content from '../components/pmain/Content.vue'
import PostShare from '../components/pmain/PostShare.vue'
import PostNav from '../components/pmain/PostNav.vue'
import PostComment from '../components/pmain/PostComment.vue'
import PostToc from '../components/pmain/PostToc.vue'

const route = useRoute()
// 正文改为非 eager + 异步组件按需加载（原先 eager 会把全部文章的编译产物打进同一分包）
const comps = import.meta.glob<{ default: Component }>('/.cache/*.vue')
const postKey = computed(() => String(route.params.id))
const content = computed(() => {
  const loader = comps[`/.cache/${postKey.value}.vue`]
  return loader ? defineAsyncComponent(loader) : null
})

// SEO 元数据：.cache/post.json 是构建期从 public/config/post.json 复制的可 import 同源副本
type PostSeo = {
  title?: string
  description?: string
  keywords?: string
  date?: string
  updated?: string
  category?: string
  tags?: string[]
  cover?: string
}
const metaMap = import.meta.glob<Record<string, PostSeo>>('/.cache/post.json', {
  eager: true,
  import: 'default',
})
const postMeta = computed(() => metaMap['/.cache/post.json']?.[postKey.value])

useSeo({
  title: postMeta.value?.title,
  description: postMeta.value?.description,
  keywords: postMeta.value?.keywords,
  path: `/post/${postKey.value}`,
  type: 'article',
  publishedTime: postMeta.value?.date,
  updatedTime: postMeta.value?.updated,
  tags: postMeta.value?.tags,
  // frontmatter 的 cover 优先，未指定时 useSeo 回退站点默认封面
  image: postMeta.value?.cover,
})
</script>

<template>
  <!-- 文档站式：左侧正文区 + 右侧常驻目录侧栏 -->
  <div class="post-layout">
    <div class="post-main">
      <PostStatus />
      <PostEdit />
      <!-- 正文容器：编译期 md 产物经 slot 注入 -->
      <Content v-if="content">
        <!-- Suspense 让 SSR/hydration 等正文就绪；@resolve 后再做图片放大与 mermaid 渲染 -->
        <Suspense @resolve="contentReady">
          <component :is="content" />
          <template #fallback>
            <div class="post-skeleton" aria-hidden="true">
              <div class="post-skeleton-title"></div>
              <div class="post-skeleton-line"></div>
              <div class="post-skeleton-line"></div>
              <div class="post-skeleton-line"></div>
              <div class="post-skeleton-line"></div>
            </div>
          </template>
        </Suspense>
      </Content>
      <!-- 无效文章 id 兜底，避免整页空白 -->
      <div v-else class="post-empty">
        <p>{{ refText.postNotFound }}<RouterLink to="/">{{ refText.backHome }}</RouterLink></p>
      </div>
      <div class="end-components">
        <PostShare />
        <PostNav />
        <PostComment />
      </div>
    </div>
    <PostToc />
  </div>
</template>

<style scoped>
.post-layout {
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);
}

.post-main {
  flex: 1;
  min-width: 0;
}

.end-components {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* 无效文章 id 的兜底提示 */
.post-empty {
  padding: 80px 0;
  text-align: center;
  color: var(--g-text);
}

/* 正文组件懒加载骨架：延迟淡入，避免秒开时闪烁 */
.post-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);

  padding: var(--space-md) 0;

  opacity: 0;
  animation: skeleton-fade 0.2s ease 0.15s forwards;
}

.post-skeleton-title {
  width: 55%;
  height: 26px;
  margin-bottom: var(--space-sm);
}

.post-skeleton-line {
  width: 100%;
  height: 14px;
}

.post-skeleton-line:nth-child(3) {
  width: 94%;
}

.post-skeleton-line:nth-child(4) {
  width: 88%;
}

.post-skeleton-line:last-child {
  width: 62%;
}

.post-skeleton-title,
.post-skeleton-line {
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--g-text) 10%, transparent);
  animation: skeleton-pulse 1.2s ease-in-out infinite;
}

@keyframes skeleton-fade {
  to {
    opacity: 1;
  }
}

@keyframes skeleton-pulse {
  50% {
    opacity: 0.5;
  }
}

/* ====================<响应式>==================== */

@media (max-width: 1024px) {
  /* [响应式-md] 平板：目录列已缩到 180px，双栏间距收窄 */
  .post-layout {
    gap: var(--space-md);
  }
  .end-components {
    gap: var(--space-md);
  }
}

@media (max-width: 768px) {
  /* [响应式-sm] 手机：目录列隐藏，正文双栏转单列全宽 */
  .post-layout {
    flex-direction: column;
    gap: var(--space-md);
    align-items: stretch;
  }
  .post-main {
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏 */
  .post-layout {
    gap: var(--space-sm);
  }
}
</style>
