<script setup>
import VButton from '@/components/__common/VButton.vue'
import VIcon from '@/components/__common/VIcon.vue'
import { useImmersiveStore } from '../../stores'

const immersiveStore = useImmersiveStore()
</script>

<template>
  <VButton
    class="button-style v-btn-primary immersive-btn"
    title="沉浸式阅读"
    style="height:36px;min-width:36px"
    @click="immersiveStore.toggle"
  >
    <VIcon :src="'book-open.svg'" :size="24" />
  </VButton>
</template>

<!-- 布局样式 -->
<style>

@media (max-width: 480px) {
    .immersive-btn {
        display: none !important;
    }
}

/* ===== 沉浸阅读：用 body 级 CSS 变量把状态下发，避免跨界后代组合选择器 =====
   body.immersive-reading（及其 compact 变体）只定义 --ir-* 变量；
   布局/基座类只读 var(--ir-*) 并取自身基础值作兜底，从而去掉「父状态类＋子元素类」的后代组合写法。 */
body.immersive-reading {
    --ir-hide: none;
    --ir-mf-pl: 20px;
    --ir-mf-pr: 20px;
    --ir-mf-ai: flex-start;
    --ir-ccs-w: 1400px;
    --ir-ccs-mw: 1400px;
    --ir-cc-mh: none;
    --ir-cc-h: auto;
}
/* 无空隙布局下进入沉浸阅读：保持贴满，不出现 1400px 收缩与左右留白 */
.layout-compact body.immersive-reading {
    --ir-mf-pl: 0;
    --ir-mf-pr: 0;
    --ir-ccs-w: auto;
    --ir-ccs-mw: none;
}

/* 隐藏左右留白、侧边栏与页脚等布局碎片（兜底取各自基础显示值） */
.left-blank,
.left-center-blank,
.footer-blank {
    display: var(--ir-hide, block);
}
.footer-s {
    display: var(--ir-hide, block);
}
.left-asider-s {
    display: var(--ir-hide, flex) !important;
}
.footer-flex {
    display: var(--ir-hide, flex) !important;
}

/* 主内容版心宽度（immersive 1400px / compact auto） */
.center-s {
    width: var(--ir-ccs-w, 1200px);
    max-width: var(--ir-ccs-mw, none);
}

/* 主内容区左右内边距与纵向对齐 */
.mid-flex {
    padding-left: var(--ir-mf-pl, 0);
    padding-right: var(--ir-mf-pr, 0);
    align-items: var(--ir-mf-ai, flex-start);
}

/* 内容卡片撑满整页 */
.center-card {
    max-height: var(--ir-cc-mh, 680px);
    height: var(--ir-cc-h, 680px);
}

/* 按钮颜色由 Header.vue 统一管理 */

@media (max-width: 480px) {
    body.immersive-reading {
        --ir-ccs-w: 100%;
        --ir-ccs-mw: 100%;
        --ir-mf-pl: 10px;
        --ir-mf-pr: 10px;
    }
}
</style>
