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
  gap: 8px;
  padding: 10px 14px;
  border-radius: 14px;
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
  border-radius: 20px;
  cursor: pointer;
  transition:
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease,
    background-color 0.2s ease;
  font-size: 14px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
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
  border-radius: 12px;
  cursor: pointer;
  transition:
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease,
    background-color 0.2s ease;
  font-size: 14px;
  min-width: 80px;
}

.page-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
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
  border-radius: 12px;
  z-index: 1000;
  animation: slideUp 0.2s ease;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.10);
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
  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.15s ease;
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
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 192, 203, 0.85);
  color: #333;
}

body.dark-theme .nav-btn {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(58, 170, 231, 0.85);
  color: #fff;
}

.page-btn {
  background: rgba(255, 192, 203, 0.25);
  color: var(--common-text);
  border: 1px solid rgba(255, 192, 203, 0.3);
}

body.dark-theme .page-btn {
  background: rgba(58, 170, 231, 0.15);
  border: 1px solid rgba(58, 170, 231, 0.2);
}

.page-btn.active {
  background: rgba(255, 192, 203, 0.85);
  color: #333;
  border-color: rgba(255, 192, 203, 0.85);
}

body.dark-theme .page-btn.active {
  background: rgba(58, 170, 231, 0.85);
  color: #fff;
  border-color: rgba(58, 170, 231, 0.85);
}

.dropdown-card {
  background: rgba(255, 255, 255, 0.92);
}

body.dark-theme .dropdown-card {
  background: rgba(21, 7, 60, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.dropdown-header {
  color: var(--common-color-1);
  border-bottom: 1px solid var(--common-color-1);
}

.dropdown-item {
  color: var(--common-text);
}

.dropdown-item:hover {
  background-color: rgba(255, 192, 203, 0.1);
}

body.dark-theme .dropdown-item:hover {
  background-color: rgba(58, 170, 231, 0.1);
}

.item-number {
  color: var(--common-color-1);
}

.current-badge {
  background: var(--common-color-1);
  color: var(--common-content);
}

.page-info {
  color: var(--common-text);
}

.current-category {
  color: var(--common-text);
}
</style>

<style scoped>
@media (max-width: 768px) {
  .page-nav-container {
    padding: 10px;
  }

  .pagination-bar {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }

  .prev-btn, .next-btn {
    min-width: 0;
    padding: 6px 14px;
    font-size: 13px;
  }

  .page-btn {
    padding: 6px 12px;
    font-size: 13px;
    min-width: auto;
  }

  .nav-btn {
    padding: 6px 14px;
    font-size: 13px;
  }

  .right-section {
    width: 100%;
    justify-content: center;
    gap: 8px;
  }

  .page-info {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .page-nav-container {
    padding: 8px 6px;
    gap: 6px;
  }

  .pagination-bar {
    gap: 6px;
  }

  .prev-btn, .next-btn {
    padding: 5px 12px;
    font-size: 12px;
    border-radius: 16px;
  }

  .page-btn {
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 10px;
  }

  .nav-btn {
    padding: 5px 12px;
    font-size: 12px;
    border-radius: 16px;
  }

  .dropdown-card {
    min-width: 180px;
    bottom: calc(100% + 4px);
  }
}
</style>
