<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['posts', 'tools', 'projects', 'links'].includes(value)
  },
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  categories: {
    type: Array,
    default: () => []
  },
  currentCategory: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['change'])

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

// 计算要显示的页码（最多显示5页
const displayPages = computed(() => {
  const pages = []
  let startPage = Math.max(1, props.currentPage - 2)
  let endPage = Math.min(props.totalPages, startPage + 4)
  
  // 调整，确保显示5页
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

// 点击外部关闭下拉
const closeDropdown = () => {
  showCategoryDropdown.value = false
}
</script>

<template>
  <div class="page-nav-container" @click="closeDropdown">
    <div class="pagination-bar">
      <!-- 左侧：上一页按钮 -->
      <button
        class="nav-btn prev-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        &lt; 上一页
      </button>

      <!-- 中间：分页按钮 -->
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

      <!-- 右侧：下一页按钮 + 分类按钮 -->
      <div class="right-section">
        <button
          class="nav-btn next-btn"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          下一页 &gt;
        </button>

        <!-- 分类下拉按钮 -->
        <div class="dropdown-wrapper" v-if="categories.length > 0">
          <button
            class="nav-btn category-btn"
            @click="toggleDropdown"
          >
            分类列表
            <span class="dropdown-arrow">▼</span>
          </button>

          <!-- 分类下拉卡片 -->
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

    <!-- 底部：页面信息 -->
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
  background: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  position: relative;
}

/* 分页主栏 */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.nav-btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.nav-btn:hover:not(:disabled) {
  background: var(--hover-bg);
  border-color: var(--button-bg);
  transform: translateY(-2px);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-btn, .next-btn {
  min-width: 100px;
}

/* 页码按钮区域 */
.page-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.page-btn {
  padding: 8px 14px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  min-width: 80px;
}

.page-btn:hover {
  background: var(--hover-bg);
  border-color: var(--button-bg);
  transform: translateY(-2px);
}

.page-btn.active {
  background: var(--button-bg);
  color: var(--button-text);
  border-color: var(--button-bg);
}

/* 右侧区域 */
.right-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 分类下拉按钮 */
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

/* 下拉卡片 */
.dropdown-card {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  max-height: 400px;
  overflow-y: auto;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
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
  border-bottom: 1px solid var(--border-color);
  font-weight: bold;
  color: var(--text-color);
  font-size: 14px;
  background: var(--card-bg-secondary);
}

.dropdown-list {
  display: flex;
  flex-direction: column;
}

.dropdown-item {
  padding: 12px 16px;
  border: none;
  background: none;
  color: var(--text-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  font-size: 14px;
  text-align: left;
}

.dropdown-item:hover {
  background: var(--hover-bg);
}

.dropdown-item.active {
  background: rgba(78, 201, 176, 0.1);
  border-left: 3px solid var(--button-bg);
}

.item-number {
  color: var(--text-secondary);
  min-width: 24px;
}

.item-name {
  flex: 1;
  font-weight: 500;
}

.current-badge {
  padding: 2px 8px;
  background: var(--button-bg);
  color: var(--button-text);
  border-radius: 4px;
  font-size: 12px;
}

/* 页面信息 */
.page-info {
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

.current-category {
  color: var(--text-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
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
