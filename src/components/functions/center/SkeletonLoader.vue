<template>
  <div class="skeleton-loader">
    <!-- 文章列表骨架屏 -->
    <div v-if="type === 'article-list'" class="skeleton-article-list">
      <div class="skeleton-article-item" v-for="i in count" :key="i">
        <div class="skeleton-title"></div>
        <div class="skeleton-meta"></div>
        <div class="skeleton-content"></div>
      </div>
    </div>
    
    <!-- 文章详情骨架屏 -->
    <div v-else-if="type === 'article-detail'" class="skeleton-article-detail">
      <div class="skeleton-detail-title"></div>
      <div class="skeleton-detail-meta"></div>
      <div class="skeleton-detail-content" v-for="i in 5" :key="i"></div>
    </div>
    
    <!-- 标签云骨架屏 -->
    <div v-else-if="type === 'tag-cloud'" class="skeleton-tag-cloud">
      <div class="skeleton-tag" v-for="i in count" :key="i"></div>
    </div>
    
    <!-- 通用骨架屏 -->
    <div v-else class="skeleton-generic">
      <div class="skeleton-line" v-for="i in count" :key="i"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'generic',
    validator: (value) => ['article-list', 'article-detail', 'tag-cloud', 'generic'].includes(value)
  },
  count: {
    type: Number,
    default: 3
  }
})
</script>

<style scoped>
.skeleton-loader {
  width: 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-article-item {
  padding: 16px;
  margin-bottom: 16px;
  background-color: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.skeleton-title {
  width: 70%;
  height: 20px;
  background-color: var(--skeleton-bg);
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-meta {
  width: 40%;
  height: 14px;
  background-color: var(--skeleton-bg);
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-content {
  width: 100%;
  height: 16px;
  background-color: var(--skeleton-bg);
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-content:last-child {
  width: 80%;
}

.skeleton-detail-title {
  width: 80%;
  height: 28px;
  background-color: var(--skeleton-bg);
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-detail-meta {
  width: 50%;
  height: 16px;
  background-color: var(--skeleton-bg);
  border-radius: 4px;
  margin-bottom: 20px;
}

.skeleton-detail-content {
  width: 100%;
  height: 18px;
  background-color: var(--skeleton-bg);
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-detail-content:nth-child(odd) {
  width: 90%;
}

.skeleton-detail-content:nth-child(even) {
  width: 95%;
}

.skeleton-tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
}

.skeleton-tag {
  width: 60px;
  height: 30px;
  background-color: var(--skeleton-bg);
  border-radius: 15px;
}

.skeleton-generic {
  padding: 16px;
}

.skeleton-line {
  width: 100%;
  height: 16px;
  background-color: var(--skeleton-bg);
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-line:nth-child(odd) {
  width: 90%;
}

.skeleton-line:nth-child(even) {
  width: 95%;
}

@keyframes skeleton-loading {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

/* 暗色主题适配 */
body.dark-theme {
  --skeleton-bg: rgba(255, 255, 255, 0.1);
}

body.light-theme {
  --skeleton-bg: rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .skeleton-article-item {
    padding: 12px;
    margin-bottom: 12px;
  }
  
  .skeleton-title {
    height: 18px;
  }
  
  .skeleton-meta {
    height: 12px;
  }
  
  .skeleton-content {
    height: 14px;
  }
  
  .skeleton-detail-title {
    height: 24px;
  }
  
  .skeleton-detail-meta {
    height: 14px;
  }
  
  .skeleton-detail-content {
    height: 16px;
  }
  
  .skeleton-tag {
    width: 50px;
    height: 26px;
  }
  
  .skeleton-line {
    height: 14px;
  }
}
</style>