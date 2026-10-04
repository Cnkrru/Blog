<script setup lang="ts">
import { onMounted } from 'vue'
import { useSeo } from '../composables/seo'
import {
  linkClean,
  linkChangePage,
  linkDisplayPages,
  setDropdown,
  linkCategories,
  linkCategory,
  linkItems,
  linkCategoryNum,
  linkDropdown,
} from '../composables/pamin/link.ts'

useSeo({
  title: '友情链接',
  description: '博客的友情链接，收录一些值得访问的站点。',
  path: '/link',
})

onMounted(linkClean)
</script>

<template>
  <div class="link-list">
    <!-- 列表div：高度固定，超出滚动 -->
    <div class="list-area">
      <!-- 当前分类的链接 -->
      <div class="link-grid">
        <a
          v-for="link in linkItems.links"
          :key="link.id"
          class="link-card"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="link-name">{{ link.name }}</div>
          <div class="link-des">{{ link.description }}</div>
        </a>
      </div>
    </div>
    <!-- 分页div 嵌套：上=切页组件(窗口页码+分类下拉)，下=第N/total页·当前分类 -->
    <div class="btn-area" @click="setDropdown(false)">
      <div class="pager-nav">
        <button
          class="page-side"
          :disabled="linkCategory === 1"
          @click="linkChangePage(linkCategory - 1)"
        >
          上一页
        </button>
        <button
          v-for="p in linkDisplayPages"
          :key="p"
          class="page-num"
          :class="{ 'page-on': p === linkCategory }"
          @click="linkChangePage(p)"
        >
          {{ linkCategories[p - 1] }}
        </button>
        <button
          class="page-side"
          :disabled="linkCategory === linkCategoryNum"
          @click="linkChangePage(linkCategory + 1)"
        >
          下一页
        </button>
        <div class="category-wrap">
          <button class="page-side category-btn" @click.stop="setDropdown(!linkDropdown)">
            分类 ▾
          </button>
          <div class="dropdown-card" v-if="linkDropdown" @click.stop>
            <button
              v-for="(name, i) in linkCategories"
              :key="name"
              class="dropdown-item"
              :class="{ 'dropdown-on': i + 1 === linkCategory }"
              @click="linkChangePage(i + 1)"
            >
              {{ name }}
            </button>
          </div>
        </div>
      </div>
      <div class="pager-info">
        第 {{ linkCategory }} / {{ linkCategoryNum }} 页 · 当前分类：{{
          linkCategories[linkCategory - 1]
        }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.link-list {
  display: flex;
  flex-direction: column;
  height: 100%; /* 页面根吃满main-body可视高度，list-area才有固定高度可滚 */
}

/* 列表div：高度固定撑满剩余空间，一桶链接过多时自身滚动（不撑破页面） */
.list-area {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

/* 分页容器div：外容器竖直列 + 相对定位（供分类下拉绝对悬浮） */
.btn-area {
  position: relative;
  flex-shrink: 0;
  margin-top: var(--space-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-xs);
}

/* 切页组件div：上一页/窗口页码/下一页/分类按钮横向排列 */
.pager-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

/* 第N/total页·当前分类 提示 */
.pager-info {
  font-size: 13px;
  color: var(--g-text);
  opacity: 0.6;
}

/* 分类按钮锚点：相对定位，让下拉面板以其(按钮)为基准悬浮，右对齐按钮 */
.category-wrap {
  position: relative;
}

/* 分类下拉：悬浮分类按钮上方(相对category-wrap)，右对齐按钮，出现动画淡入+上移，点外部关闭 */
.dropdown-card {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  max-height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 100;
  border-radius: var(--radius-lg);
  background-color: var(--glass-r);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(16px);
  animation: dropdown-in 0.2s ease; /* 挂载时播放一次 */
}

@keyframes dropdown-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: var(--space-sm) var(--space-md);
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  color: var(--g-text);
  transition: background-color 0.2s ease; /* hover背景平滑过渡 */
}

.dropdown-item:hover {
  background-color: color-mix(in srgb, var(--g-color) 10%, transparent);
}

.dropdown-item.dropdown-on {
  background-color: var(--g-color);
  color: #fff;
}

/* 上一页/下一页 */
.page-side {
  padding: var(--space-sm) var(--space-lg);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
  border-radius: var(--radius-full);
  background-color: transparent;
  color: var(--g-text);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.page-side:hover:not(:disabled) {
  border-color: var(--g-color);
  color: var(--g-color);
}

.page-side:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 分类名页码 */
.page-num {
  min-width: 36px;
  height: 36px;
  padding: 0 var(--space-md);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
  border-radius: var(--radius-full);
  background-color: transparent;
  color: var(--g-text);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.page-num:hover:not(:disabled) {
  border-color: var(--g-color);
  color: var(--g-color);
}

/* 省略号占位项：不显示边框点击态，只做分隔 */
.page-num:disabled {
  border-color: transparent;
  background: transparent;
  cursor: default;
}

.page-num.page-on {
  background-color: var(--g-color);
  border-color: var(--g-color);
  color: #fff;
}

.link-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.link-grid > * {
  flex: 1 1 calc(50% - 8px); /* 一行两个 */
  min-width: 260px;
  max-width: calc(
    (100% - var(--space-md)) / 2
  ); /* 单卡上限=两列时一张卡片宽，卡片不足/仅一张时不撑满整行 */
}

.link-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 110px;
  padding: var(--space-md);

  border-radius: var(--space-lg);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
  background-color: color-mix(in srgb, var(--glass-r), transparent);

  text-decoration: none;
  /* 对齐项目卡片规格：弹性浮起曲线 + 阴影/描边过渡 */
  transition:
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.link-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.06),
    0 8px 20px rgba(0, 0, 0, 0.1),
    0 0 0 1px color-mix(in srgb, var(--g-color) 30%, transparent);
  border-color: color-mix(in srgb, var(--g-color) 40%, transparent);
}

.link-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--g-text);
}

.link-des {
  font-size: 13px;
  opacity: 0.7;
  color: var(--g-text);
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
  /* 大屏：仍两列，降低卡片最小宽，避免视口略窄时提前换列 */
  .link-grid > * {
    min-width: 240px;
  }
}

@media (max-width: 768px) {
  /* 手机：保持两列，分页条收紧间距与内边距 */
  .pager-nav {
    gap: var(--space-xs);
  }
  .page-side {
    padding: var(--space-xs) var(--space-md);
    font-size: 13px;
  }
  .page-num {
    min-width: 32px;
    height: 32px;
    padding: 0 var(--space-sm);
    font-size: 13px;
  }
  .dropdown-card {
    min-width: 160px;
  }
}

@media (max-width: 480px) {
  /* 窄屏：单列全宽卡片（避免两列max-width把单列卡宽锁死在半行），分页条进一步收紧 */
  .link-grid > * {
    flex: 1 1 100%;
    min-width: 0;
    max-width: 100%;
  }
  .pager-nav {
    gap: 6px;
  }
  .page-side {
    padding: var(--space-xs) var(--space-sm);
    font-size: 12px;
  }
  .page-num {
    min-width: 28px;
    height: 28px;
    padding: 0 var(--space-xs);
    font-size: 12px;
  }
}
</style>
