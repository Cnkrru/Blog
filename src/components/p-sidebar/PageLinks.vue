<script setup lang="ts">
</script>

<template>
  <div class="page-list-card">
      <ul>
        <li ><router-link to="/home" class="page-card"> 首页 </router-link></li>
        <li ><router-link to="/about" class="page-card"> 关于 </router-link></li>
        <li ><router-link to="/archives" class="page-card"> 归档 </router-link></li>
        <li ><router-link to="/timeline" class="page-card"> 标签 </router-link></li>
        <li ><router-link to="/links" class="page-card"> 友链 </router-link></li>
        <li ><router-link to="/search" class="page-card"> 搜索 </router-link></li>
        <li ><router-link to="/projects" class="page-card"> 项目 </router-link></li>
        <li ><router-link to="/settings" class="page-card"> 设置 </router-link></li>
      </ul>
  </div>
</template>

<!-- 布局样式 -->
<style scoped>
.page-list-card {
    width:100%;
    height: 240px;
    padding: 8px;
    margin-bottom: 5px;
    text-align: center;
    overflow-y: auto;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
}

.page-list-card ul {
    width: 100%;
    height: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
}

.page-list-card ul li {
    width: 100%;
    height: fit-content;
}

.page-card {
    display: block;
    width: 100%;
    height: fit-content;
    padding: 8px 12px;
    margin-bottom: 6px;
    border-radius: 10px;
    border: 1px solid transparent;
    transition:
        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.2s ease,
        border-color 0.2s ease,
        background-color 0.2s ease;
    cursor: pointer;
}

.page-card:hover {
    transform: translateY(-2px);
    border-color: var(--common-color-1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>

<!-- 颜色样式 -->
<style scoped>
.page-card {
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
    color: var(--common-text);
    border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
}

.page-card:hover {
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
    border-color: color-mix(in srgb, var(--common-text) 15%, transparent);
    box-shadow: 0 4px 12px var(--common-shadow);
}
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
</style>
