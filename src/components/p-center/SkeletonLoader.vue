<script setup>
import { defineProps, computed } from 'vue'
import { useThemeStore } from '../../stores'

const props = defineProps({
  type: {
    type: String,
    default: 'generic',
    validator: (value) => ['article-list', 'article-detail', 'tag-cloud', 'generic'].includes(value)
  },
  count: {
    type: Number,
    default: 3
  },
  animationDuration: {
    type: Number,
    default: 1.5
  },
  animationDelay: {
    type: Number,
    default: 0
  },
  showBackground: {
    type: Boolean,
    default: true
  }
})

const themeStore = useThemeStore()
const isDarkTheme = computed(() => themeStore.isDark)

// 计算动画样式
const animationStyle = computed(() => {
  return {
    animationDuration: `${props.animationDuration}s`,
    animationDelay: `${props.animationDelay}s`
  }
})
</script>

<template>
  <div class="skeleton-loader" :class="{ 'skeleton-loader-dark': isDarkTheme, 'skeleton-loader-no-bg': !showBackground }" :style="animationStyle">
    <!-- 文章列表骨架屏 -->
    <div v-if="type === 'article-list'" class="skeleton-article-list">
      <div class="skeleton-article-item" v-for="i in count" :key="i" :style="{ animationDelay: `${i * 0.1}s` }">
        <div class="skeleton-title"></div>
        <div class="skeleton-meta"></div>
        <div class="skeleton-content"></div>
        <div class="skeleton-content"></div>
        <div class="skeleton-content"></div>
      </div>
    </div>
    
    <!-- 文章详情骨架屏 -->
    <div v-else-if="type === 'article-detail'" class="skeleton-article-detail">
      <div class="skeleton-detail-title"></div>
      <div class="skeleton-detail-meta"></div>
      <div class="skeleton-detail-content" v-for="i in 5" :key="i" :style="{ animationDelay: `${i * 0.1}s` }"></div>
    </div>
    
    <!-- 标签云骨架屏 -->
    <div v-else-if="type === 'tag-cloud'" class="skeleton-tag-cloud">
      <div class="skeleton-tag" v-for="i in count" :key="i" :style="{ animationDelay: `${i * 0.05}s` }"></div>
    </div>
    
    <!-- 通用骨架屏 -->
    <div v-else class="skeleton-generic">
      <div class="skeleton-line" v-for="i in count" :key="i" :style="{ animationDelay: `${i * 0.1}s` }"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-loader {
  width: 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-loader-dark {
  --skeleton-bg: var(--skeleton-bg-dark);
}

.skeleton-loader-no-bg {
  background-color: transparent !important;
  border: none !important;
}

.skeleton-article-item {
  padding: 16px;
  margin-bottom: 16px;
  background-color: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-title {
  width: 70%;
  height: 20px;
  background: linear-gradient(90deg, var(--skeleton-bg) 25%, rgba(255, 255, 255, 0.2) 50%, var(--skeleton-bg) 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 8px;
  animation: skeleton-gradient 1.5s ease-in-out infinite;
}

.skeleton-meta {
  width: 40%;
  height: 14px;
  background: linear-gradient(90deg, var(--skeleton-bg) 25%, rgba(255, 255, 255, 0.2) 50%, var(--skeleton-bg) 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 12px;
  animation: skeleton-gradient 1.5s ease-in-out infinite;
  animation-delay: 0.1s;
}

.skeleton-content {
  width: 100%;
  height: 16px;
  background: linear-gradient(90deg, var(--skeleton-bg) 25%, rgba(255, 255, 255, 0.2) 50%, var(--skeleton-bg) 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 8px;
  animation: skeleton-gradient 1.5s ease-in-out infinite;
}

.skeleton-content:nth-child(3) {
  width: 90%;
  animation-delay: 0.2s;
}

.skeleton-content:nth-child(4) {
  width: 95%;
  animation-delay: 0.3s;
}

.skeleton-content:nth-child(5) {
  width: 80%;
  animation-delay: 0.4s;
}

.skeleton-detail-title {
  width: 80%;
  height: 28px;
  background: linear-gradient(90deg, var(--skeleton-bg) 25%, rgba(255, 255, 255, 0.2) 50%, var(--skeleton-bg) 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 12px;
  animation: skeleton-gradient 1.5s ease-in-out infinite;
}

.skeleton-detail-meta {
  width: 50%;
  height: 16px;
  background: linear-gradient(90deg, var(--skeleton-bg) 25%, rgba(255, 255, 255, 0.2) 50%, var(--skeleton-bg) 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 20px;
  animation: skeleton-gradient 1.5s ease-in-out infinite;
  animation-delay: 0.1s;
}

.skeleton-detail-content {
  width: 100%;
  height: 18px;
  background: linear-gradient(90deg, var(--skeleton-bg) 25%, rgba(255, 255, 255, 0.2) 50%, var(--skeleton-bg) 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 12px;
  animation: skeleton-gradient 1.5s ease-in-out infinite;
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
  background-color: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.skeleton-tag {
  width: 60px;
  height: 30px;
  background: linear-gradient(90deg, var(--skeleton-bg) 25%, rgba(255, 255, 255, 0.2) 50%, var(--skeleton-bg) 75%);
  background-size: 200% 100%;
  border-radius: 15px;
  animation: skeleton-gradient 1.5s ease-in-out infinite;
}

.skeleton-tag:nth-child(2n) {
  width: 80px;
  height: 26px;
}

.skeleton-tag:nth-child(3n) {
  width: 100px;
  height: 32px;
}

.skeleton-generic {
  padding: 16px;
  background-color: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.skeleton-line {
  width: 100%;
  height: 16px;
  background: linear-gradient(90deg, var(--skeleton-bg) 25%, rgba(255, 255, 255, 0.2) 50%, var(--skeleton-bg) 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 12px;
  animation: skeleton-gradient 1.5s ease-in-out infinite;
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

@keyframes skeleton-gradient {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
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
  
  .skeleton-tag:nth-child(2n) {
    width: 65px;
    height: 24px;
  }
  
  .skeleton-tag:nth-child(3n) {
    width: 80px;
    height: 28px;
  }
  
  .skeleton-line {
    height: 14px;
  }
  
  .skeleton-tag-cloud,
  .skeleton-generic {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .skeleton-article-item {
    padding: 10px;
    margin-bottom: 10px;
  }
  
  .skeleton-title {
    height: 16px;
    margin-bottom: 6px;
  }
  
  .skeleton-meta {
    height: 10px;
    margin-bottom: 8px;
  }
  
  .skeleton-content {
    height: 12px;
    margin-bottom: 6px;
  }
  
  .skeleton-detail-title {
    height: 20px;
    margin-bottom: 8px;
  }
  
  .skeleton-detail-meta {
    height: 12px;
    margin-bottom: 12px;
  }
  
  .skeleton-detail-content {
    height: 14px;
    margin-bottom: 8px;
  }
  
  .skeleton-tag {
    width: 45px;
    height: 24px;
  }
  
  .skeleton-tag:nth-child(2n) {
    width: 55px;
    height: 22px;
  }
  
  .skeleton-tag:nth-child(3n) {
    width: 65px;
    height: 26px;
  }
  
  .skeleton-line {
    height: 12px;
    margin-bottom: 8px;
  }
  
  .skeleton-tag-cloud,
  .skeleton-generic {
    padding: 10px;
  }
}
</style>