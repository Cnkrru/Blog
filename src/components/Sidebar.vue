<script setup lang="ts">
import Avatar from './p-sidebar/Avatar.vue'
import WelcomeSaying from './p-sidebar/WelcomeSaying.vue'
import PageLinks from './p-sidebar/PageLinks.vue'
import Weather from './api/Weather.vue'
</script>

<template>
    <aside class="left-asider-S">
        <div class="left-asider-container">
        <div class="left-asider-card">
            <!-- 头像设计 -->
            <Avatar />
            <!-- 欢迎语设计 -->
            <WelcomeSaying />
            <!-- 天气组件 -->
            <Weather />
            <!-- 页面跳转链接设计 -->
            <PageLinks />
            <!-- RSS 订阅组件 -->   
        </div>
        </div>
    </aside>
</template>

<style scoped>
/*====================侧边栏设计====================*/
    /* 左侧边栏分布大小 - 桌面端默认 */
.left-asider-S {
    width: 15%;
    height: 100%;
    display: flex;
    position: static;
}

    /* 左侧边栏版心 */
.left-asider-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
}

    /* 左侧边栏卡片样式 */
.left-asider-card {
    width: 200px;
	height: 600px;
	border-radius: 8px;
	padding: 20px;
    border: 3px solid var(--common-color-1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 25px;
}
</style>

<style scoped>
/* 颜色样式 */
</style>

<style scoped>
/* 移动端：侧边栏默认隐藏，点击菜单按钮时滑出 */
@media (max-width: 768px) {
    .left-asider-S {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 260px;
        z-index: 1000;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
    }

    .left-asider-S.active {
        transform: translateX(0);
    }

    .left-asider-card {
        width: 100%;
        height: 100%;
        min-height: auto;
        border-radius: 0 8px 8px 0;
        padding: 15px;
        gap: 16px;
        overflow-y: auto;
    }
}

/* 小桌面 */
@media (min-width: 769px) and (max-width: 1024px) {
    .left-asider-S {
        width: 20%;
    }
    .left-asider-card {
        width: 180px;
        height: auto;
    }
}

/* 标准桌面 */
@media (min-width: 1025px) and (max-width: 1280px) {
    .left-asider-S {
        width: 18%;
    }
    .left-asider-card {
        width: 200px;
    }
}

/* 大桌面 */
@media (min-width: 1281px) {
    .left-asider-card {
        width: 210px;
        height: 600px;
    }
}
</style>
