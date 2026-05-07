<script setup lang="ts">
</script>

<template>
  <div class="page-list-card">
      <ul>
        <li ><router-link to="/home" class="page-card"> 首页 </router-link></li>
        <li ><router-link to="/about" class="page-card"> 关于 </router-link></li>
        <li ><router-link to="/archives" class="page-card"> 归档 </router-link></li>
        <li ><router-link to="/links" class="page-card"> 友链 </router-link></li>
        <li ><router-link to="/projects" class="page-card"> 项目 </router-link></li>
        <li ><router-link to="/rss.xml" target="_blank" rel="noopener noreferrer" class="page-card"> RSS </router-link></li>
      </ul>
  </div>
</template>

<!-- 布局样式 -->
<style scoped>
.page-list-card {
    width:100%;
    height: 180px;
    padding: 8px;
    margin-bottom: 5px;
    text-align: center;
    overflow-y: auto;
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
    padding: 6px;
    margin-bottom: 4px;
    border-radius: 8px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.page-card:hover {
    transform: translateY(-5px);
    border-left-width: 6px;
}
</style>

<!-- 颜色样式 -->
<style scoped>
.page-card {
    background-color: var(--common-color-1);
    border: 2px solid var(--common-color-2);
    box-shadow: var(--common-shadow);
    color: var(--common-content);
}

.page-card:hover {
    box-shadow: var(--common-shadow);
    background-color: var(--common-hover);
}
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
</style>
