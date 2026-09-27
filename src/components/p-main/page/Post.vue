<script setup>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

import ContentRender from '../content/ContentRender.vue'
import Comment from '../content/Comment.vue'
import ShareBtn from '../content/ShareBtn.vue'
import PostNav from '../content/PostNav.vue'
import ArticleStatus from '../content/ArticleStatus.vue'
import EditHistory from '../content/EditHistory.vue'
import RelatedPosts from '../content/RelatedPosts.vue'
import PostToc from '../content/PostToc.vue'
import MobileToc from '../content/MobileToc.vue'
import { page } from '@/modules/page'

// 组件绑定：不再依赖预生成的映射模块，编译期用 import.meta.glob 扫出所有文章中间件，
// 运行时按当前路由 id 直接取对应 loader（数据源与 SSG 的 /config/post.json 都是 docs/*.md）
// 注意：glob 返回的 key 是"以项目根为基准的绝对路径"（/... 前导 /），不是 alias 串 @data/...
const comps = import.meta.glob('/.cache/compile/*.vue')

const route = useRoute()
const id = computed(() => String(route.params.id))

// head 标题：直接读 public/config/post.json（构建期由 parseArticle 生成），
// 标题同时填到 page.head_title（页面顶部标题栏 MainHeader 读它）和 document.title；
// SSR 阶段无网络，预渲染 HTML 里是 page_titles 兜底'文章'，客户端挂载后覆盖为文章标题
function set_post_title(t) {
    page.set_head_title(t)                                   // 页面顶部标题栏（MainHeader 读 page.head_title）
    post_title.value = t                                     // document.title（useHead）
}

const post_title = ref('')
onMounted(async () => {
    // 兜底：切到文章页先清掉上个页面的标题，避免显示残留; 直接读 public/config/post.json
    set_post_title(page.page_titles[route.name] || '')
    try {
        const table = await (await fetch('/config/post.json')).json()
        set_post_title(table[id.value]?.title || '')
    }
    catch {
        console.error('[ERR]:文章元数据加载失败,标题保持默认')
    }
})

useHead({
    title: computed(() => post_title.value ? `${post_title.value} - Cnkrru` : 'Cnkrru'),
})

const content = computed(() => {
    const loader = comps[`/.cache/compile/${id.value}.vue`]
    return loader ? defineAsyncComponent(loader) : null
})
</script>

<template>
<ContentRender v-if="content">
    <div class="post-layout">
        <div class="post-main">
            <MobileToc/>
            <ArticleStatus/>
            <EditHistory/>
            <component :is="content" />
            <div class="end-components">
                <ShareBtn/>
                <PostNav/>
                <RelatedPosts/>
                <Comment/>
            </div>
        </div>
        <PostToc/>
    </div>
</ContentRender>
</template>

<style scoped>
/* 文档站式：横向布局，左侧正文区，右侧常驻目录侧栏 */
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
    .post-layout { gap: var(--space-md); }
    .end-components { gap: var(--space-md); }
}

@media (max-width: 768px) {
    /* [响应式-sm] 手机：目录列隐藏，正文双栏转单列全宽 */
    /* align-items:stretch + .post-main 显式 100% 宽：column 布局下原 base 的 flex-start 会让
       .post-main 走 fit-content，被内部长代码行/长公式的 min-content 撑到超过视口宽，
       必须锁死为单列全宽，超宽内容交回内部滚动容器处理 */
    .post-layout { flex-direction: column; gap: var(--space-md); align-items: stretch; }
    .post-main { width: 100%; max-width: 100%; }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
    .post-layout { gap: var(--space-sm); }
}

</style>
