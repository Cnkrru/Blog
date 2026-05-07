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
@media (max-width: var(--md)) {
    /* 移动端侧边栏 */
    .left-asider-S {
        position: fixed;
        top: 0;
        left: -320px;
        width: 280px;
        height: 100vh;
        background: var(--card-bg);
        box-shadow: 2px 0 10px var(--shadow-color);
        z-index: 1000;
        transition: left 0.3s ease;
        overflow-y: auto;
        overflow-x: hidden;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        /* 确保不占文档流空间 */
        visibility: hidden;
    }

    .left-asider-S.active {
        left: 0;
        visibility: visible;
    }

        .left-center-blank {
        display: none;
    }

    /* 调整卡片大小 */
    .left-asider-card {
        width: 100%;
        height: auto;
        max-height: none;
        padding: 20px;
        margin-top: 60px;
        border-radius: 8px;
    }
}

@media (max-width: var(--lg)) {
    .left-asider-S {
        position: static;
        width: 20%;
        height: fit-content;
        padding: 0px 0px 0px 0px;
        left: 0;
        box-shadow: none;
        background: transparent;
        align-self: flex-start;
    }

    .left-center-blank {
        display: flex;
    }
    
    /* 调整侧边栏卡片大小 */
    .left-asider-card {
        width: 180px;
        height: 600px;
        margin-top: 0;
        border-radius: 8px;
    }
}

@media (max-width: var(--xl)) {
    /* 标准桌面布局 */
    .left-asider-S {
        width: 18%;        
        padding: 0px 0px 0px 0px;
    }
    
    /* 调整侧边栏卡片大小 */
    .left-asider-card {
        width: 200px;
        height: 650px;
        border-radius: 8px;
    }
}

@media (max-width: var(--2xl)) {
    /* 调整侧边栏卡片大小 */
    .left-asider-card {
        width: 210px;
        height: 600px;
        border-radius: 8px;
    }
}
</style>
