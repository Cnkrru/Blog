<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = withDefaults(defineProps<{
  type: string
  currentPage: number
  totalPages: number
  categories?: any[]
  currentCategory?: string
}>(), {
  categories: () => [],
  currentCategory: ''
})

const emit = defineEmits<{ change: [page: number] }>()

const showCategoryDropdown = ref(false)

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('change', page)
    showCategoryDropdown.value = false
  }
}

const getPageLabel = (index) => {
  if (props.categories[index - 1]) {
    return props.categories[index - 1].name
  }
  return `第 ${index} 页`
}

const displayPages = computed(() => {
  const pages = []
  let startPage = Math.max(1, props.currentPage - 2)
  let endPage = Math.min(props.totalPages, startPage + 4)
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  return pages
})

const toggleDropdown = (event) => {
  event.stopPropagation()
  showCategoryDropdown.value = !showCategoryDropdown.value
}

const closeDropdown = () => {
  showCategoryDropdown.value = false
}
</script>

<template>
  <div class="page-nav-container" @click="closeDropdown">
    <div class="pagination-bar">
      <button
        class="nav-btn prev-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        &lt; 上一页
      </button>

      <div class="page-buttons">
        <button
          v-for="page in displayPages"
          :key="page"
          :class="['page-btn', { active: page === currentPage }]"
          @click="changePage(page)"
        >
          {{ getPageLabel(page) }}
        </button>
      </div>

      <div class="right-section">
        <button
          class="nav-btn next-btn"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          下一页 &gt;
        </button>

        <div class="dropdown-wrapper" v-if="categories.length > 0">
          <button
            class="nav-btn category-btn"
            @click="toggleDropdown"
          >
            分类列表
            <span class="dropdown-arrow">▼</span>
          </button>

          <div class="dropdown-card" v-if="showCategoryDropdown" @click.stop>
            <div class="dropdown-header">
              快速跳转
            </div>
            <div class="dropdown-list">
              <button
                v-for="(category, index) in categories"
                :key="category.name"
                :class="['dropdown-item', { active: index + 1 === currentPage }]"
                @click="changePage(index + 1)"
              >
                <span class="item-number">{{ index + 1 }}.</span>
                <span class="item-name">{{ category.name }}</span>
                <span v-if="index + 1 === currentPage" class="current-badge">当前</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-info">
      第 {{ currentPage }} / {{ totalPages }} 页
      <span v-if="currentCategory" class="current-category">
        - {{ currentCategory }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.page-nav-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  position: relative;
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.nav-btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-btn, .next-btn {
  min-width: 100px;
}

.page-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.page-btn {
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  min-width: 80px;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-wrapper {
  position: relative;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dropdown-arrow {
  font-size: 10px;
  transition: transform 0.2s ease;
}

.showCategoryDropdown .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-card {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  max-height: 400px;
  overflow-y: auto;
  border-radius: 8px;
  z-index: 1000;
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-header {
  padding: 12px 16px;
  font-weight: bold;
  font-size: 14px;
}

.dropdown-list {
  display: flex;
  flex-direction: column;
}

.dropdown-item {
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  font-size: 14px;
  text-align: left;
}

.item-number {
  min-width: 24px;
}

.item-name {
  flex: 1;
  font-weight: 500;
}

.current-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.page-info {
  text-align: center;
  font-size: 14px;
}
</style>

<style scoped>
.nav-btn {
  border: 1px solid var(--common-color-1);
  background: var(--common-color-1);
  color: var(--common-content);
}

.page-btn {
  background: var(--common-color-1);
  color: var(--common-content);
  border: 1px solid var(--common-color-1);
}

.page-btn.active {
  background: var(--common-color-1);
  color: var(--common-content);
  border-color: var(--common-color-1);
}

.dropdown-card {
  background: var(--common-bg);
  border: 1px solid var(--common-color-1);
}

.dropdown-header {
  color: var(--common-color-1);
  border-bottom: 1px solid var(--common-color-1);
  background: var(--common-bg);
}

.dropdown-item {
  color: var(--common-color-1);
}

.item-number {
  color: var(--common-color-1);
}

.current-badge {
  background: var(--common-color-1);
  color: var(--common-content);
}

.page-info {
  color: var(--common-content);
}

.current-category {
  color: var(--common-content);
}
</style>

<style scoped>
@media (max-width: var(--md)) {
  .page-nav-container {
    padding: 12px;
  }

  .pagination-bar {
    flex-direction: column;
    gap: 12px;
  }

  .right-section {
    width: 100%;
    justify-content: space-between;
  }

  .prev-btn, .next-btn {
    min-width: 80px;
    padding: 6px 12px;
    font-size: 13px;
  }

  .page-btn {
    padding: 6px 10px;
    font-size: 13px;
    min-width: auto;
  }

  .nav-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>
