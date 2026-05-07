<script setup lang="ts">
</script>

<template>
    <div class="avator-card">
        <img src="/src/assets/imgs/avator.jpg" alt="Cnkrru的头像">
    </div>
</template>

<!-- 布局样式 -->
<style scoped>
.avator-card {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
}

.avator-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease-in-out;
}

.avator-card:hover img {
    transform: rotate(360deg);
}
</style>

<!-- 颜色样式 -->
<style scoped>
.avator-card {
    border: 3px solid var(--common-color-1);
}
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
</style>
