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
    max-height: 600px;
    height: 600px;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 3px solid var(--common-color-1);
}

/* 头部区域容器 */
.center-header-area {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

/* 头部区域 - 固定 */
.center-header-area :deep(.center-head-card) {
    flex-shrink: 0;
    width: 100%;
}

/* 内容区域 - 可滚动 */
.center-header-area :deep(.center-card-content) {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}
</style>

<style scoped>
/* 中心卡片内容区域背景 */
:deep(.center-card-content) {
    background-color: var(--common-bg);
}

/* 中心卡片头部区域样式 */
:deep(.center-head-card) {
    background-color: var(--common-bg);
    transition: background-color 0.3s ease;
}

/* 中心卡片头部标题样式 */
:deep(.center-head-card h2) {
    color: var(--common-color-1);
    transition: color 0.3s ease;
}

/* 中心卡片内部hr样式 */
:deep(.center-card-content hr) {
    border: none;
    height: 1px;
    background-color: var(--common-color-1);
    margin: 10px 0;
    transition: background-color 0.3s ease;
}

/* 中心卡片中直接的hr样式 */
:deep(.center-card hr) {
    border: none;
    height: 1px;
    background-color: var(--common-color-1);
    margin: 10px 0;
    transition: background-color 0.3s ease;
}

/* 中心卡片内部边框样式 */
:deep(.center-card-bordered) {
    border: 2px solid var(--common-color-1);
    transition: border-color 0.3s ease;
}
</style>

<style scoped>
@media (max-width: 480px) {
    .center-S {
        width: 100%;
        padding: 0;
    }
    .center-card {
        height: auto;
        max-height: none;
        min-height: calc(100vh - 200px);
        padding: 6px;
        border-width: 2px;
    }
    .center-header-area :deep(.center-card-content) {
        padding: 6px 2px;
    }
}

@media (max-width: 768px) {
    .center-S {
        width: 100%;
        padding: 0;
    }
    .center-card {
        height: auto;
        min-height: 500px;
        padding: 8px;
        border-width: 2px;
    }
}

@media (max-width: 1024px) {
    .center-S {
        width: calc(100% - 20% - 15px);
    }
    .center-card {
        height: 550px;
    }
}

@media (max-width: 1280px) {
    .center-S {
        width: calc(100% - 18% - 20px);
    }
    .center-card {
        height: 600px;
    }
}

@media (min-width: 1281px) {
    .center-S {
        width: 1200px;
    }
    .center-card {
        height: 600px;
    }
}
</style>
