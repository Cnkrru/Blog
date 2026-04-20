<script setup>
// Center组件作为内容外壳，不包含具体内容
</script>

<template>
    <section class="center-S">
        <div class="center-container">
        <div class="center-card">
            <!-- 插槽：用于插入具体页面内容 -->
            <slot></slot>
        </div>
        </div>
    </section>
</template>
