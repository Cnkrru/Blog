<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

import ContentRender from '../content/ContentRender.vue'
import Comment from '../content/Comment.vue'
import ShareBtn from '../content/ShareBtn.vue'
import UsefulBtn from '../content/UsefulBtn.vue'
import PostNav from '../content/PostNav.vue'
import ArticleStatus from '../content/ArticleStatus.vue'
import EditHistory from '../content/EditHistory.vue'
import RelatedPosts from '../content/RelatedPosts.vue'

// 组件绑定：不再依赖预生成的映射模块，编译期用 import.meta.glob 扫出所有文章中间件，
// 运行时按当前路由 id 直接取对应 loader（数据源与 SSG 的 /config/post.json 都是 docs/*.md）
// 注意：glob 返回的 key 是"以项目根为基准的绝对路径"（/... 前导 /），不是 alias 串 @data/...
const comps = import.meta.glob('/.cache/compile/*.vue')

const route = useRoute()
const id = computed(() => String(route.params.id))

const content = computed(() => {
    const loader = comps[`/.cache/compile/${id.value}.vue`]
    return loader ? defineAsyncComponent(loader) : null
})
</script>

<template>
<ContentRender v-if="content">
    <ArticleStatus/>
    <EditHistory/>
    <component :is="content" />
    <div class="end-components">
        <UsefulBtn/>
        <ShareBtn/>
        <PostNav/>
        <RelatedPosts/>
        <Comment/>
    </div>
</ContentRender>
</template>

<style scoped>
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
    /* [响应式-md] 平板 */
}

@media (max-width: 768px) {
    /* [响应式-sm] 手机 */
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
}

</style>
