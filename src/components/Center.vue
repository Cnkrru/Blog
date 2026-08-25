<script setup>
// Center组件作为内容外壳，不包含具体内容
</script>

<template>
    <section class="center-s">
        <div class="center-container">
            <div class="center-card">
                <!-- 头部区域 -->
                <div class="center-header-area">
                    <slot></slot>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* 主体部分的面积分配 */
.center-s {
    width: 1200px;
    height: 100%;
    display: flex;
}

/* 主体版心设计 */
.center-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

/* 主体部分卡片设计 */
.center-card {
    width: 100%;
    max-height: 680px;
    height: 680px;
    padding: 14px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* 头部区域容器 */
.center-header-area {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 6px;
    overflow: hidden;
}
</style>

<style>
/* ===== Center 布局基座 =====
   .center-head-card/.center-card-content 等为跨页面复用的全局根类，且被
   Toc/ReadingTime/ReadingProgress/MarkdownRender 的 JS 依赖（querySelector 滚动语义），
   故以非 scoped 全局定义，命中 slot 内各页面根元素。 */

/* 头部卡片 — 固定 */
.center-head-card {
    flex-shrink: 0;
    width: 100%;
    padding: 8px 14px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* 头部标题 */
.center-head-card h2 {
    color: var(--common-text);
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.2px;
    text-shadow: 0 0 20px color-mix(in srgb, var(--common-text) 25%, transparent);
}

/* 内容区域 — 可滚动 */
.center-card-content {
    flex: 1;
    overflow-y: auto;
    padding: 14px;
    border-radius: 10px;
}

/* 分割线 */
.center-card-content hr,
.center-card hr {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--common-color-1), transparent);
    margin: 8px 0;
    opacity: 0.3;
}

/* 内部带边框卡片 — 加深边框，与毛玻璃背景有区分度 */
.center-card-bordered {
    border: 1px solid color-mix(in srgb, var(--common-text) 10%, transparent);
    border-radius: 12px;
}

@media (max-width: 768px) {
    .center-head-card {
        flex-wrap: wrap;
        gap: 6px;
        padding: 6px 10px;
    }
    .center-head-card h2 {
        font-size: 15px;
    }
    .center-card-content {
        padding: 10px;
    }
}

@media (max-width: 480px) {
    .center-head-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        padding: 5px 8px;
        border-radius: 8px;
    }
    .center-head-card h2 {
        font-size: 14px;
        width: 100%;
    }
    .center-card-content {
        padding: 6px;
        border-radius: 8px;
    }
}
</style>

<style scoped>
@media (max-width: 768px) {
    .center-s {
        width: 100%;
        padding: 0;
    }
    .center-card {
        height: auto;
        min-height: 500px;
        padding: 6px;
        border-radius: 12px;
    }
    .center-header-area {
        gap: 4px;
    }
}

@media (max-width: 480px) {
    .center-s {
        width: 100%;
        padding: 0;
    }
    .center-card {
        height: auto;
        max-height: none;
        min-height: calc(100vh - 160px);
        padding: 3px;
        border-radius: 10px;
    }
    .center-header-area {
        gap: 3px;
    }
}


</style>
