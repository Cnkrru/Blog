<script setup lang="ts">
// Center组件作为内容外壳，不包含具体内容
</script>

<template>
    <section class="center-S">
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
.center-S {
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

/* 头部区域 - 固定 */
.center-header-area :deep(.center-head-card) {
    flex-shrink: 0;
    width: 100%;
    padding: 8px 14px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

/* 内容区域 - 可滚动 */
.center-header-area :deep(.center-card-content) {
    flex: 1;
    overflow-y: auto;
    padding: 14px;
    border-radius: 10px;
}
</style>

<style scoped>
/* 头部区域 — 略深一点的半透明 */
:deep(.center-head-card) {
    background-color: rgba(255, 255, 255, 0.55);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.4);
}

body.dark-theme :deep(.center-head-card) {
    background-color: rgba(21, 7, 60, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.06);
}

/* 内容区域 — 最浅，保证文字可读 */
:deep(.center-card-content) {
    background-color: rgba(255, 255, 255, 0.35);
}

body.dark-theme :deep(.center-card-content) {
    background-color: rgba(21, 7, 60, 0.25);
}

/* 头部标题 */
:deep(.center-head-card h2) {
    color: var(--common-text);
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.2px;
}

body.dark-theme :deep(.center-head-card h2) {
    color: #fff;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.25);
}

/* 分割线 */
:deep(.center-card-content hr) {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--common-color-1), transparent);
    margin: 8px 0;
    opacity: 0.3;
}

:deep(.center-card hr) {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--common-color-1), transparent);
    margin: 8px 0;
    opacity: 0.3;
}

/* 内部带边框卡片 — 加深边框，与毛玻璃背景有区分度 */
:deep(.center-card-bordered) {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
}

body.dark-theme :deep(.center-card-bordered) {
    border: 1px solid rgba(255, 255, 255, 0.12);
}
</style>

<style scoped>
@media (max-width: 768px) {
    .center-S {
        width: 100%;
        padding: 0;
    }
    .center-card {
        height: auto;
        min-height: 500px;
        padding: 10px;
        border-radius: 14px;
    }
    .center-header-area {
        gap: 6px;
    }
    .center-header-area :deep(.center-head-card) {
        flex-wrap: wrap;
        gap: 8px;
        padding: 8px 12px;
    }
    .center-header-area :deep(.center-head-card h2) {
        font-size: 16px;
    }
}

@media (max-width: 480px) {
    .center-S {
        width: 100%;
        padding: 0;
    }
    .center-card {
        height: auto;
        max-height: none;
        min-height: calc(100vh - 180px);
        padding: 6px;
        border-radius: 10px;
    }
    .center-header-area {
        gap: 4px;
    }
    .center-header-area :deep(.center-head-card) {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 10px;
    }
    .center-header-area :deep(.center-head-card h2) {
        font-size: 15px;
        width: 100%;
    }
    .center-header-area :deep(.center-card-content) {
        padding: 8px;
        border-radius: 8px;
    }
}

@media (max-width: 1024px) {
    .center-S {
        width: calc(100% - 20% - 15px);
    }
    .center-card {
        height: 580px;
        border-radius: 14px;
    }
}

@media (max-width: 1280px) {
    .center-S {
        width: calc(100% - 18% - 20px);
    }
    .center-card {
        height: 640px;
        border-radius: 16px;
    }
}

@media (min-width: 1281px) {
    .center-S {
        width: 1200px;
    }
    .center-card {
        height: 680px;
    }
}
</style>
