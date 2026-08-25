<script setup>
import { useThemeStore } from '../../stores/theme'

const theme = useThemeStore()
</script>

<template>
  <div class="skeleton-container" :class="{ 'dark-theme': theme.isDark }">
    <!-- 标题骨架 -->
    <div class="skeleton-title">
      <div class="skeleton-block title-line-1"></div>
      <div class="skeleton-block title-line-2"></div>
    </div>

    <!-- 元信息骨架 -->
    <div class="skeleton-meta">
      <div class="skeleton-block meta-line"></div>
    </div>

    <!-- 段落骨架 -->
    <div class="skeleton-paragraph">
      <div class="skeleton-block text-line w-100"></div>
      <div class="skeleton-block text-line w-90"></div>
      <div class="skeleton-block text-line w-85"></div>
      <div class="skeleton-block text-line w-60"></div>
    </div>

    <!-- 图片骨架 -->
    <div class="skeleton-image-placeholder">
      <div class="skeleton-block image-block"></div>
    </div>

    <!-- 段落骨架 -->
    <div class="skeleton-paragraph">
      <div class="skeleton-block text-line w-100"></div>
      <div class="skeleton-block text-line w-95"></div>
      <div class="skeleton-block text-line w-80"></div>
      <div class="skeleton-block text-line w-90"></div>
      <div class="skeleton-block text-line w-50"></div>
    </div>

    <!-- 代码块骨架 -->
    <div class="skeleton-code">
      <div class="skeleton-block code-header-bar"></div>
      <div class="skeleton-block code-line w-80"></div>
      <div class="skeleton-block code-line w-70"></div>
      <div class="skeleton-block code-line w-90"></div>
      <div class="skeleton-block code-line w-60"></div>
      <div class="skeleton-block code-line w-75"></div>
    </div>

    <!-- 段落骨架 -->
    <div class="skeleton-paragraph">
      <div class="skeleton-block text-line w-100"></div>
      <div class="skeleton-block text-line w-85"></div>
      <div class="skeleton-block text-line w-95"></div>
      <div class="skeleton-block text-line w-40"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-container {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  animation: skeleton-fade-in 0.4s ease;
}

@keyframes skeleton-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.skeleton-block {
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  background: rgba(128, 128, 128, 0.1);
}

/* 脉冲动画 */
.skeleton-block::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 100%
  );
  animation: shimmer 1.8s ease-in-out infinite;
}

.skeleton-container.dark-theme .skeleton-block::after {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 50%,
    transparent 100%
  );
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 标题 */
.skeleton-title {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.title-line-1 {
  height: 28px;
  width: 72%;
}

.title-line-2 {
  height: 16px;
  width: 45%;
}

/* 元信息 */
.skeleton-meta {
  margin-bottom: 28px;
}

.meta-line {
  height: 12px;
  width: 35%;
}

/* 段落 */
.skeleton-paragraph {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.text-line {
  height: 14px;
}

/* 图片 */
.skeleton-image-placeholder {
  margin-bottom: 24px;
}

.image-block {
  height: 200px;
  width: 100%;
  border-radius: 8px;
}

/* 代码块 */
.skeleton-code {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 10px;
  background: rgba(128, 128, 128, 0.06);
}

.code-header-bar {
  height: 14px;
  width: 25%;
  margin-bottom: 4px;
  border-radius: 4px;
}

.code-line {
  height: 14px;
  border-radius: 4px;
}

/* 宽度辅助 */
.w-100 { width: 100%; }
.w-95 { width: 95%; }
.w-90 { width: 90%; }
.w-85 { width: 85%; }
.w-80 { width: 80%; }
.w-75 { width: 75%; }
.w-70 { width: 70%; }
.w-60 { width: 60%; }
.w-50 { width: 50%; }
.w-45 { width: 45%; }
.w-40 { width: 40%; }
.w-35 { width: 35%; }
.w-25 { width: 25%; }
</style>