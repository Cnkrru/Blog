<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useSeo } from '../composables/seo'
import PostCover from '../components/pmain/PostCover.vue'
import {
  ListClean,
  ListChangePage,
  listInitPage,
  listDisplayPages,
  listPageNum,
  listNowPage,
  listItems,
} from '../composables/pamin/postlist.ts'

useSeo({
  title: '文章列表',
  description: '按时间浏览博客的全部文章，涵盖前端、后端与硬件的学习笔记与项目实践。',
  path: '/postlist',
})

const load = async () => {
  await ListClean() // 数据加载 + 算总页数
  ListChangePage(listInitPage()) // 从 URL ?page= 读初始页渲染，无/非法回退第 1 页
}

onMounted(load)
</script>

<template>
  <div class="post-list">
    <!-- 列表div：卡片网格，高度固定，内容超出布局自然换页（不滚动） -->
    <div class="list-area">
      <div class="card-grid">
        <RouterLink
          v-for="item in listItems"
          :key="item.key"
          class="post-card"
          :to="`/post/${item.key}`"
        >
          <PostCover :article="item" />
        </RouterLink>
      </div>
    </div>
    <!-- 分页div：上=切页组件(上一页/页码/下一页)，下=共N页 -->
    <div class="btn-area">
      <div class="pager-nav">
        <button
          class="page-side"
          :disabled="listNowPage === 1"
          @click="ListChangePage(listNowPage - 1)"
        >
          上一页
        </button>
        <button
          v-for="p in listDisplayPages"
          :key="p"
          class="page-num"
          :class="{ 'page-on': p === listNowPage }"
          @click="ListChangePage(p)"
        >
          {{ p }}
        </button>
        <button
          class="page-side"
          :disabled="listNowPage === listPageNum"
          @click="ListChangePage(listNowPage + 1)"
        >
          下一页
        </button>
      </div>
      <div class="pager-info">共 {{ listPageNum }} 页</div>
    </div>
  </div>
</template>

<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
  height: 100%; /* 页面根吃满main-body可视高度，list-area才有固定高度可撑 */
  margin-top: var(--space-lg); /* 仅顶部外边距，列表与页头拉开间距 */
}

/* 列表div：高度固定，撑满剩余空间 */
.list-area {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 分页容器div：外容器竖直列，上=切页组件，下=共N页 */
.btn-area {
  flex-shrink: 0;
  width: 90%;
  max-width: 90%;
  margin: var(--space-lg) auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-xs);
}

/* 切页组件div：横向排列页码按钮，页多时不溢出可横滚 */
.pager-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  max-width: 100%;
  overflow-x: auto;
  padding: var(--space-xs);
}

/* 上一页/下一页 */
.page-side {
  flex-shrink: 0;
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

/* 数字页码 */
.page-num {
  min-width: 36px;
  height: 36px;
  padding: 0 var(--space-sm);
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

/* 共N页提示 */
.pager-info {
  font-size: 13px;
  color: var(--g-text);
  opacity: 0.6;
}

/* 卡片网格：gap/弹性对齐 Category.vue arch-group 系列（flex:1 1 拉伸填满行） */
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card-grid > * {
  flex: 1 1 calc(33.333% - 11px); /* gap=16px×2÷3≈11px/卡 */
  min-width: 260px;
  max-width: calc((100% - 32px) / 3); /* 单卡上限=三列时一张普通卡宽，卡片不足/仅一张时不撑满整行 */
}

/* 封面卡片链接包装：内容由 PostCover 渲染（自带描边圆角），hover 弹性浮起 */
.post-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--space-lg);
  text-decoration: none;
  transition:
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.06),
    0 8px 20px rgba(0, 0, 0, 0.1),
    0 0 0 1px color-mix(in srgb, var(--g-color) 30%, transparent);
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
  /* [响应式-lg] 大屏：仍三列，仅降低卡片最小宽，避免视口略窄时提前换列 */
  .card-grid > * {
    min-width: 240px;
  }
}

@media (max-width: 1024px) {
  /* [响应式-md] 平板：降为两列，gap=16px×1÷2=8px */
  .card-grid > * {
    flex: 1 1 calc(50% - 8px);
    min-width: 0;
    max-width: calc((100% - 16px) / 2);
  }
}

@media (max-width: 768px) {
  /* [响应式-sm] 手机：保持两列，分页条收紧间距（横向可滚动不换行） */
  .btn-area {
    width: 100%;
    margin-top: var(--space-md);
  }
  .pager-nav {
    gap: var(--space-xs);
    padding: var(--space-xs);
  }
  .page-side {
    padding: var(--space-xs) var(--space-md);
    font-size: 13px;
  }
  .page-num {
    min-width: 32px;
    height: 32px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏：单列全宽卡片，分页条进一步收紧 */
  .card-grid > * {
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
