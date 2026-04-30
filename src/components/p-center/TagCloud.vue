<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { useThemeStore, useTagStore } from '../../stores'

const props = defineProps({
  articles: {
    type: Array,
    default: () => []
  }
})

const showTagCloud = ref(false)
const selectedTag = ref(null)
const tagArticles = ref([])
const searchQuery = ref('')

const themeStore = useThemeStore()
const tagStore = useTagStore()

const isDarkTheme = computed(() => themeStore.isDark)
const tags = computed(() => tagStore.tags)
const tagStats = computed(() => tagStore.tagStats)
const sortBy = computed(() => tagStore.sortBy)

const filteredTags = computed(() => {
  if (!searchQuery.value) {
    return tagStats.value
  }
  const query = searchQuery.value.toLowerCase()
  return tagStats.value.filter(stat => 
    stat.tag.toLowerCase().includes(query)
  )
})

const loadTags = async () => {
  await tagStore.loadTags(props.articles)
}

const selectTag = async (tag) => {
  selectedTag.value = tag
  
  try {
    tagArticles.value = await tagStore.getTagArticles(tag, props.articles)
  } catch (err) {
    console.error('获取标签文章失败:', err)
  }
}

const toggleTagCloud = () => {
  showTagCloud.value = !showTagCloud.value
  if (showTagCloud.value) {
    selectedTag.value = null
    tagArticles.value = []
    searchQuery.value = ''
  }
}

const changeSortBy = (newSortBy) => {
  tagStore.setSortBy(newSortBy)
  loadTags()
}

const getRelatedTags = (tag) => {
  return tagStore.getRelatedTags(tag, 5)
}

const closeTagCloud = () => {
  showTagCloud.value = false
  selectedTag.value = null
  tagArticles.value = []
  searchQuery.value = ''
}

const clearSearch = () => {
  searchQuery.value = ''
}

watch(() => props.articles, () => {
  loadTags()
}, { deep: true })

onMounted(() => {
  loadTags()
})
</script>

<template>
  <div class="tag-cloud-container" :class="{ 'dark-theme': isDarkTheme }">
    <button @click="toggleTagCloud" class="tag-cloud-button">
      <span class="button-icon">🏷️</span>
      <span class="button-text">标签云</span>
      <span class="tag-count">{{ tags.length }}</span>
    </button>
    
    <div v-if="showTagCloud" class="tag-cloud-modal">
      <div class="tag-cloud-content" :class="{ 'dark-theme': isDarkTheme }">
        <div class="tag-cloud-header">
          <h3>标签云</h3>
          <button @click="closeTagCloud" class="close-button">×</button>
        </div>
        
        <div class="search-container">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索标签..." 
            class="search-input"
          >
          <button 
            v-if="searchQuery" 
            @click="clearSearch" 
            class="clear-button"
          >
            ×
          </button>
        </div>
        
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
        
        <div class="tag-cloud">
          <span 
            v-for="stat in filteredTags" 
            :key="stat.tag"
            @click="selectTag(stat.tag)"
            :class="['tag', { active: selectedTag === stat.tag }]"
            :style="{ 
              fontSize: `${14 + Math.min(stat.count / 2, 10)}px`,
              opacity: `${0.7 + Math.min(stat.frequency * 0.3, 0.3)}`,
              animationDelay: `${Math.random() * 0.5}s`
            }"
            :title="`频率: ${stat.frequency.toFixed(2)}, 数量: ${stat.count}, 最后使用: ${new Date(stat.lastUsed).toLocaleDateString()}`"
          >
            {{ stat.tag }} ({{ stat.count }})
          </span>
        </div>
        
        <div v-if="selectedTag && tagArticles.length > 0" class="tag-articles">
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
        
        <div v-if="selectedTag && tagArticles.length === 0" class="tag-articles-empty">
          <span>该标签下暂无文章</span>
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
  font-size: 16px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.tag-cloud-button:hover {
  transform: scale(1.05);
}

.button-icon {
  font-size: 14px;
}

.button-text {
  font-weight: 500;
}

.tag-count {
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.tag-cloud-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.tag-cloud-content {
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
  position: relative;
}

.tag-cloud-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
}

.tag-cloud-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;
}

.close-button:hover {
  transform: rotate(90deg);
}

.search-container {
  position: relative;
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
}

.clear-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 10px;
  min-height: 200px;
  align-content: flex-start;
}

.tag {
  padding: 6px 12px;
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  animation: tagFadeIn 0.5s ease;
}

.tag:hover {
  transform: scale(1.05);
}

.tag.active {
  font-weight: bold;
}

.tag-cloud-empty {
  width: 100%;
  text-align: center;
  padding: 60px 20px;
  font-style: italic;
}

.tag-articles {
  margin-top: 24px;
  padding-top: 20px;
}

.tag-articles h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
}

.tag-article-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tag-article-item:hover {
  padding-left: 12px;
  border-radius: 6px;
  margin: 0 -6px;
  padding: 12px 6px 12px 18px;
}

.tag-article-title {
  flex: 1;
  font-weight: 500;
  line-height: 1.4;
}

.tag-article-date {
  font-size: 0.875rem;
  margin-left: 20px;
  white-space: nowrap;
}

.tag-articles-empty {
  margin-top: 24px;
  padding: 40px 20px;
  text-align: center;
  font-style: italic;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  flex-wrap: wrap;
}

.sort-label {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.sort-button {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.sort-button:hover {
  transform: translateY(-1px);
}

.tag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.related-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.related-label {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.related-tag {
  padding: 3px 8px;
  border-radius: 14px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.related-tag:hover {
  transform: scale(1.05);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes tagFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

<style scoped>
.tag-cloud-button {
  background-color: var(--common-color-1);
  color: var(--common-content);
  border: 2px solid var(--common-color-1);
}

.tag-count {
  color: var(--common-content);
  background-color: var(--common-color-1);
}

.tag-cloud-content {
  background-color: var(--common-bg);
  border: 2px solid var(--common-color-1);
}

.tag-cloud-header {
  border-bottom: 1px solid var(--common-color-1);
}

.tag-cloud-header h3 {
  color: var(--common-text);
}

.close-button {
  color: var(--common-text);
}

.close-button:hover {
  background-color: var(--common-color-1);
}

.search-input {
  background-color: var(--common-bg);
  color: var(--common-text);
  border: 1px solid var(--common-color-1);
}

.clear-button {
  color: var(--common-text);
}

.clear-button:hover {
  background-color: var(--common-color-1);
}

.tag-cloud {
  background-color: var(--common-bg);
  border: 1px solid var(--common-color-1);
}

.tag {
  background-color: var(--common-color-1);
  color: var(--common-text);
}

.tag:hover {
  background-color: var(--common-hover);
}

.tag.active {
  background-color: var(--common-hover);
  color: var(--common-text);
}

.tag-article-item {
  border-bottom: 1px solid var(--common-color-1);
}

.tag-article-item:hover {
  background-color: var(--common-hover);
}

.tag-article-title {
  color: var(--common-text);
}

.tag-article-date {
  color: var(--common-content);
}

.sort-options {
  background-color: var(--common-bg);
  border: 1px solid var(--common-color-1);
}

.sort-label {
  color: var(--common-text);
}

.sort-button {
  background-color: var(--common-color-1);
  color: var(--common-text);
  border: 1px solid var(--common-color-1);
}

.sort-button:hover {
  background-color: var(--common-hover);
}

.sort-button.active {
  background-color: var(--common-hover);
}

.tag-header h4 {
  color: var(--common-text);
}

.related-label {
  color: var(--common-content);
}

.related-tag {
  background-color: var(--common-color-1);
  color: var(--common-text);
}

.related-tag:hover {
  background-color: var(--common-hover);
}
</style>

<style scoped>
@media (max-width: var(--md)) {
  .tag-cloud-content {
    width: 95%;
    padding: 20px;
  }
  
  .tag-cloud-header h3 {
    font-size: 18px;
  }
  
  .tag {
    font-size: 12px !important;
    padding: 5px 10px;
  }
  
  .tag-article-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
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
    margin-top: 8px;
  }
  
  .search-input {
    padding: 8px 36px 8px 10px;
  }
  
  .tag-cloud-button {
    padding: 6px 10px;
    font-size: 14px;
  }
  
  .button-icon {
    font-size: 12px;
  }
  
  .tag-count {
    font-size: 10px;
    padding: 1px 5px;
  }
}

@media (max-width: var(--sm)) {
  .tag-cloud-content {
    padding: 16px;
  }
  
  .tag-cloud {
    padding: 16px;
    gap: 8px;
  }
  
  .tag {
    font-size: 11px !important;
    padding: 4px 8px;
  }
  
  .sort-button {
    padding: 4px 8px;
    font-size: 12px;
  }
  
  .tag-article-item {
    padding: 10px 0;
  }
  
  .tag-article-item:hover {
    padding-left: 14px;
  }
  
  .related-tag {
    padding: 2px 6px;
    font-size: 11px;
  }
}
</style>
