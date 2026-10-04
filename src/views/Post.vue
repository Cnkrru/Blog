<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Component } from 'vue'
import { useSeo } from '../composables/seo'
import PostStatus from '../components/pmain/PostStatus.vue'
import postEdit from '../components/pmain/postEdit.vue'
import Content from '../components/pmain/Content.vue'
import PostShare from '../components/pmain/PostShare.vue'
import PostNav from '../components/pmain/PostNav.vue'
import PostComment from '../components/pmain/PostComment.vue'
import PostToc from '../components/pmain/PostToc.vue'

const route = useRoute()
const comps = import.meta.glob<{ default: Component }>('/.cache/*.vue', { eager: true })
const postKey = computed(() => String(route.params.id))
const content = computed(() => comps[`/.cache/${postKey.value}.vue`]?.default ?? null)

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
      <postEdit />
      <!-- 正文容器：编译期 md 产物经 slot 注入 -->
      <Content v-if="content">
        <component :is="content" />
      </Content>
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

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
  /* [响应式-lg] 大屏 */
}

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
