<script setup>
import Avatar from './functions/sidebar/Avatar.vue'
import WelcomeSaying from './functions/sidebar/WelcomeSaying.vue'
import PageLinks from './functions/sidebar/PageLinks.vue'
import RssSubscribe from './functions/sidebar/RssSubscribe.vue'
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
            <RssSubscribe />
        </div>
        </div>
    </aside>
</template>
