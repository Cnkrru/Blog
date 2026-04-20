<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { DatabaseLikeAggregator } from '../../../utils/algorithms'
import { RedisLikeCache } from '../../../utils/cache'

const props = defineProps({
  articles: {
    type: Array,
    default: () => []
  }
})

const tags = ref([])
const tagStats = ref([]) // 包含详细统计信息的标签
const showTagCloud = ref(false)
const selectedTag = ref(null)
const tagArticles = ref([])
const sortBy = ref('frequency') // 排序方式: frequency, count, recent, trending

// 创建Database-like标签聚合器
const tagAggregator = new DatabaseLikeAggregator()

// Redis-like缓存
const tagCache = new RedisLikeCache({
  memoryCapacity: 30,
  storageCapacity: 100,
  defaultTTL: 300
})

// 初始化标签数据
const loadTags = () => {
  const startTime = performance.now();
  
  // 提取所有文章的标签
  const allTags = []
  props.articles.forEach(article => {
    if (article.tags && Array.isArray(article.tags)) {
      allTags.push(...article.tags)
    }
  })
  
  // 使用Database-like聚合器更新标签统计
  tagAggregator.updateTags(allTags)
  
  // 获取热门标签（带详细统计）
  tagStats.value = tagAggregator.getPopularTags({ 
    sortBy: sortBy.value,
    limit: 50 
  })
  
  // 提取标签名称
  tags.value = tagStats.value.map(item => item.tag)
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // 记录性能指标
  if (typeof window !== 'undefined' && window.performanceMonitor && typeof window.performanceMonitor.recordMetric === 'function') {
    window.performanceMonitor.recordMetric('tags_update_duration', duration);
  }
  
  console.log(`标签更新完成 - 耗时: ${duration.toFixed(2)}ms - 标签数: ${tags.value.length}`, tagAggregator.getStats());
}

const selectTag = (tag) => {
  selectedTag.value = tag
  
  // 检查缓存
  const cacheKey = `tag_articles_${tag}`
  const cachedArticles = tagCache.get(cacheKey)
  
  if (cachedArticles) {
    console.log('标签文章缓存命中:', tag)
    tagArticles.value = cachedArticles
  } else {
    // 过滤包含该标签的文章
    tagArticles.value = props.articles.filter(article => 
      article.tags && article.tags.includes(tag)
    )
    
    // 缓存结果
    if (tagArticles.value.length > 0) {
      tagCache.set(cacheKey, tagArticles.value, { 
        ttl: 600, // 10分钟
        priority: 'normal'
      })
    }
  }
  
  // 记录标签使用（用于趋势分析）
  tagAggregator.updateTag(tag)
}

const toggleTagCloud = () => {
  showTagCloud.value = !showTagCloud.value
  if (showTagCloud.value) {
    selectedTag.value = null
    tagArticles.value = []
  }
}

// 切换排序方式
const changeSortBy = (newSortBy) => {
  sortBy.value = newSortBy
  loadTags() // 重新加载标签
  
  // 记录用户偏好
  try {
    localStorage.setItem('tag_sort_preference', newSortBy)
  } catch (e) {}
}

// 获取相关标签
const getRelatedTags = (tag) => {
  return tagAggregator.getRelatedTags(tag, 5)
}

const closeTagCloud = () => {
  showTagCloud.value = false
  selectedTag.value = null
  tagArticles.value = []
}

watch(() => props.articles, () => {
  loadTags()
}, { deep: true })

onMounted(() => {
  loadTags()
})
</script>

<template>
  <div class="tag-cloud-container">
    <!-- 标签云按钮 -->
    <button @click="toggleTagCloud" class="tag-cloud-button">
      标签云
    </button>
    
    <!-- 标签云弹窗 -->
    <div v-if="showTagCloud" class="tag-cloud-modal">
      <div class="tag-cloud-content">
        <div class="tag-cloud-header">
          <h3>标签云</h3>
          <button @click="closeTagCloud" class="close-button">×</button>
        </div>
        
        <!-- 排序选项 -->
        <div class="sort-options">
          <span class="sort-label">排序:</span>
          <button 
            @click="changeSortBy('frequency')" 
            :class="['sort-button', { active: sortBy === 'frequency' }]"
          >
            频率
          </button>
          <button 
            @click="changeSortBy('count')" 
            :class="['sort-button', { active: sortBy === 'count' }]"
          >
            数量
          </button>
          <button 
            @click="changeSortBy('recent')" 
            :class="['sort-button', { active: sortBy === 'recent' }]"
          >
            最近
          </button>
          <button 
            @click="changeSortBy('trending')" 
            :class="['sort-button', { active: sortBy === 'trending' }]"
          >
            趋势
          </button>
        </div>
        
        <!-- 标签云 -->
        <div class="tag-cloud">
          <span 
            v-for="stat in tagStats" 
            :key="stat.tag"
            @click="selectTag(stat.tag)"
            :class="['tag', { active: selectedTag === stat.tag }]"
            :style="{ 
              fontSize: `${14 + Math.min(stat.count / 2, 10)}px`,
              opacity: `${0.7 + Math.min(stat.frequency * 0.3, 0.3)}`
            }"
            :title="`频率: ${stat.frequency.toFixed(2)}, 数量: ${stat.count}, 最后使用: ${new Date(stat.lastUsed).toLocaleDateString()}`"
          >
            {{ stat.tag }} ({{ stat.count }})
          </span>
        </div>
        
        <!-- 标签文章列表 -->
        <div v-if="selectedTag" class="tag-articles">
          <div class="tag-header">
            <h4>{{ selectedTag }} 的文章 ({{ tagArticles.length }})</h4>
            <div class="related-tags" v-if="getRelatedTags(selectedTag).length > 0">
              <span class="related-label">相关标签:</span>
              <span 
                v-for="related in getRelatedTags(selectedTag)" 
                :key="related.tag"
                @click="selectTag(related.tag)"
                class="related-tag"
                :title="`相关性: ${related.score.toFixed(2)}`"
              >
                {{ related.tag }}
              </span>
            </div>
          </div>
          <RouterLink 
            v-for="article in tagArticles" 
            :key="article.id"
            :to="`/post/${article.id}`"
            class="tag-article-item"
            @click="closeTagCloud"
          >
            <span class="tag-article-title">{{ article.title }}</span>
            <span class="tag-article-date">{{ article.date }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tag-cloud-container {
  position: relative;
  display: inline-block;
}

.tag-cloud-button {
  background-color: var(--button-bg);
  border: 1px solid var(--button-border);
  color: var(--button-text);
  font-size: 16px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tag-cloud-button:hover {
  background-color: var(--button-hover-bg);
  transform: scale(1.05);
}

.tag-cloud-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.tag-cloud-content {
  background-color: var(--card-bg);
  border: 3px solid var(--center-card-border-color);
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px var(--shadow-color);
}

.tag-cloud-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--center-card-hr-color);
}

.tag-cloud-header h3 {
  margin: 0;
  color: var(--center-card-title-color);
  font-size: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-color);
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-button:hover {
  background-color: var(--hover-bg);
  color: var(--link-hover-color);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: var(--hover-bg);
  border-radius: 8px;
}

.tag {
  padding: 5px 10px;
  border-radius: 15px;
  background-color: var(--social-bg);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

/* 亮色主题 */
.tag {
  color: black;
}

.tag:hover {
  background-color: var(--center-card-title-color);
  color: black;
  transform: scale(1.05);
}

.tag.active {
  background-color: var(--center-card-title-color);
  color: black;
  font-weight: bold;
}

/* 暗色主题 */
body.dark-theme .tag {
  color: white;
}

body.dark-theme .tag:hover {
  background-color: var(--center-card-title-color);
  color: white;
}

body.dark-theme .tag.active {
  background-color: var(--center-card-title-color);
  color: white;
  font-weight: bold;
}

.tag-articles {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid var(--center-card-hr-color);
}

.tag-articles h4 {
  margin: 0 0 15px 0;
  color: var(--text-color);
  font-size: 16px;
}

.tag-article-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  text-decoration: none;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.tag-article-item:hover {
  color: var(--link-hover-color);
  padding-left: 10px;
}

.tag-article-title {
  flex: 1;
}

.tag-article-date {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-left: 20px;
}

/* 排序选项 */
.sort-options {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  padding: 10px;
  background-color: var(--hover-bg);
  border-radius: 6px;
}

.sort-label {
  font-size: 14px;
  color: var(--text-muted);
}

.sort-button {
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg);
  color: var(--text-color);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-button:hover {
  background-color: var(--hover-bg);
}

.sort-button.active {
  background-color: var(--center-card-title-color);
  color: black;
  border-color: var(--center-card-title-color);
}

/* 标签头部 */
.tag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.related-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.related-label {
  font-size: 12px;
  color: var(--text-muted);
}

.related-tag {
  padding: 2px 6px;
  background-color: var(--social-bg);
  color: var(--text-color);
  border-radius: 12px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.related-tag:hover {
  background-color: var(--center-card-title-color);
  color: black;
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tag-cloud-content {
    width: 95%;
    padding: 15px;
  }
  
  .tag-cloud-header h3 {
    font-size: 18px;
  }
  
  .tag {
    font-size: 12px !important;
    padding: 4px 8px;
  }
  
  .tag-article-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .tag-article-date {
    margin-left: 0;
    font-size: 0.8rem;
  }
  
  .sort-options {
    flex-wrap: wrap;
  }
  
  .tag-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .related-tags {
    margin-top: 5px;
  }
}
</style>