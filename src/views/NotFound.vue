<script setup lang="ts">
import { useSeo } from '../composables/seo'

useSeo({
  title: '页面不存在',
  description: '你访问的页面可能已被移除或地址有误。',
  path: '/notfound',
  noindex: true,
})
</script>

<template>
  <div class="notfound">
    <div class="error">404</div>
    <h1 class="title">页面不存在</h1>
    <p class="text">你访问的页面可能已被移除或地址有误。</p>
    <router-link to="/" class="back-index">返回首页</router-link>
  </div>
</template>

<style scoped>
.notfound {
  width: 100%;
  height: 100%;
  min-height: 400px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.error {
  font-size: 120px;
  font-weight: 900;
  line-height: 1;
  color: var(--g-color);
  margin-bottom: 16px;
  animation: error-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); /* 入场回弹 */
}

@keyframes error-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: var(--g-text);
  margin: 0 0 12px;
}

.text {
  font-size: 15px;
  line-height: 1.6;
  color: var(--g-text);
  opacity: 0.65;
  margin: 0 0 32px;
}

.back-index {
  display: inline-block;

  padding: 10px 28px;
  border: 2px solid var(--g-color);
  border-radius: 50px;

  font-size: 15px;
  color: var(--g-color);
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); /* 浮起用项目弹性曲线 */
}

.back-index:hover {
  background: var(--g-color);
  color: #fff;
  transform: translateY(-2px);
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
  /* [响应式-lg] 大屏 */
}

@media (max-width: 1024px) {
  /* [响应式-md] 平板 */
}

@media (max-width: 768px) {
  /* [响应式-sm] 手机 */
}

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏 */
}
</style>