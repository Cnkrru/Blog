<template>
  <div class="article-cover" :style="coverVars">
    <!-- 装饰圆 -->
    <div class="cover-deco deco-1"></div>
    <div class="cover-deco deco-2"></div>
    <div class="cover-deco deco-3"></div>

    <!-- 装饰线 -->
    <div class="cover-accent-line"></div>

    <!-- 内容 -->
    <div class="cover-content">
      <!-- 类别 -->
      <span v-if="article.category" class="cover-category">{{ article.category }}</span>

      <!-- 标题 -->
      <h3 class="cover-title">{{ article.title }}</h3>

      <!-- 标签 -->
      <div v-if="article.tags && article.tags.length" class="cover-tags">
        <span v-for="t in article.tags.slice(0, 4)" :key="t" class="cover-tag">{{ t }}</span>
      </div>

      <!-- 日期 -->
      <span class="cover-date">{{ article.date }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['article'])

// 根据文章 ID 生成确定性视觉参数，确保每篇文章有独特的布局但全部使用主题色
const coverVars = computed(() => {
  let hash = 0
  const id = props.article.id
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i)
    hash = hash & hash
  }
  hash = Math.abs(hash)

  // 渐变角度 (0-360)，每篇文章不同
  const angle = (hash % 36) * 10

  // 装饰圆位置偏移
  const d1Offset = (hash % 20) - 10        // -10 ~ 9
  const d2Offset = (hash % 16) - 8         // -8 ~ 7
  const d3Offset = (hash % 12) - 6         // -6 ~ 5

  // 装饰线位置：左或右
  const lineLeft = (hash % 2 === 0) ? '16px' : 'auto'
  const lineRight = (hash % 2 === 0) ? 'auto' : '16px'

  // 装饰圆尺寸微调
  const d1Size = 40 + (hash % 10)          // 40-49%
  const d2Size = 26 + (hash % 8)           // 26-33%

  return {
    '--cover-angle': `${angle}deg`,
    '--cover-d1-offset': `${d1Offset}%`,
    '--cover-d2-offset': `${d2Offset}%`,
    '--cover-d3-offset': `${d3Offset}%`,
    '--cover-line-left': lineLeft,
    '--cover-line-right': lineRight,
    '--cover-d1-size': `${d1Size}%`,
    '--cover-d2-size': `${d2Size}%`,
  }
})
</script>

<style scoped>
.article-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 1.91 / 1;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  /* 使用主题色构建渐变背景，自动跟随主题切换 */
  background: linear-gradient(
    var(--cover-angle, 135deg),
    color-mix(in srgb, var(--common-bg) 95%, var(--common-color-1)) 0%,
    var(--common-bg) 50%,
    color-mix(in srgb, var(--common-bg) 90%, var(--common-color-1) 10%) 100%
  );
}

/* 装饰圆 */
.cover-deco {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.deco-1 {
  width: var(--cover-d1-size, 45%);
  aspect-ratio: 1;
  top: calc(-10% + var(--cover-d1-offset, 0%));
  right: -8%;
  background: color-mix(in srgb, var(--common-color-1) 8%, transparent);
}

.deco-2 {
  width: var(--cover-d2-size, 30%);
  aspect-ratio: 1;
  bottom: calc(-8% + var(--cover-d2-offset, 0%));
  left: -6%;
  background: color-mix(in srgb, var(--common-color-1) 6%, transparent);
}

.deco-3 {
  width: 20%;
  aspect-ratio: 1;
  top: calc(20% + var(--cover-d3-offset, 0%));
  left: 50%;
  transform: translateX(-50%);
  background: color-mix(in srgb, var(--common-color-1) 3%, transparent);
}

/* 装饰线 */
.cover-accent-line {
  position: absolute;
  top: 16px;
  left: var(--cover-line-left, 16px);
  right: var(--cover-line-right, auto);
  width: 48px;
  height: 3px;
  border-radius: 2px;
  opacity: 0.7;
  background: var(--common-color-1);
}

/* 内容 */
.cover-content {
  position: relative;
  z-index: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.cover-category {
  display: inline-block;
  align-self: flex-start;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  opacity: 0.85;
  background: color-mix(in srgb, var(--common-color-1) 15%, transparent);
  color: var(--common-color-1);
}

.cover-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  word-break: break-word;
  color: var(--common-text);
}

.cover-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cover-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid color-mix(in srgb, var(--common-color-1) 25%, transparent);
  background: color-mix(in srgb, var(--common-color-1) 12%, transparent);
  color: var(--common-text);
}

.cover-date {
  font-size: 12px;
  opacity: 0.6;
  color: var(--common-text);
}

/* 移入动效 */
.post-card:hover .article-cover .deco-1 {
  transform: scale(1.15);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.post-card:hover .article-cover .deco-2 {
  transform: scale(1.1);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 移动端隐藏动效 */
@media (hover: none) {
  .post-card:hover .article-cover .deco-1,
  .post-card:hover .article-cover .deco-2 {
    transform: none;
  }
}

/* 小屏适配 */
@media (max-width: 480px) {
  .cover-content {
    padding: 12px;
    gap: 6px;
  }
  .cover-title {
    font-size: 15px;
  }
  .cover-tag {
    font-size: 10px;
    padding: 1px 6px;
  }
  .cover-date {
    font-size: 11px;
  }
}
</style>