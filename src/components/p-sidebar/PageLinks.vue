<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="page-index-list">
    <div class="page-index-list-inner">
      <ul>
        <li class="page-card"><router-link to="/home"> {{ t('home') }} </router-link></li>
        <li class="page-card"><router-link to="/about"> {{ t('about') }} </router-link></li>
        <li class="page-card"><router-link to="/archives"> {{ t('archives') }} </router-link></li>
        <li class="page-card"><router-link to="/links"> {{ t('links') }} </router-link></li>
        <li class="page-card"><router-link to="/projects"> {{ t('projects') }} </router-link></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/*==========跳转其他页面样式==========*/
.page-index-list {
    width:100%;
    max-height: 180px;
    height: fit-content;
    text-align: center;
	padding: 8px;
	margin-bottom: 5px;
    overflow-y: auto;
}

.page-index-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.page-index-list-inner {
    width: 100%;
}

.page-card {
    width: 100%;
    height: fit-content;
    text-align: center;
    border: 8px;
	padding: 6px;
	margin-bottom: 4px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.page-card:hover {
    transform: translateY(-5px);
    border-left-width: 6px;
}
</style>
