<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  linkOpen,
  qrcodeOpen,
  qrcodeClose,
  shareCopy,
  toastOpen,
  qrCanvas,
} from '../../composables/pamin/post.ts'
import Share from '../icon/share/Share.vue'
import Heart from '../icon/Heart.vue'
import Wechat from '../icon/share/Wechat.vue'
import QQIcon from '../icon/share/QQIcon.vue'
import Weibo from '../icon/share/Weibo.vue'
import Telegram from '../icon/share/Telegram.vue'
import Facebook from '../icon/share/Facebook.vue'
import XIcon from '../icon/share/XIcon.vue'
import Copy from '../icon/share/Copy.vue'
import X from '../icon/X.vue'

const route = useRoute()
const origin = typeof window !== 'undefined' ? window.location.origin : ''
const url = `${origin}${route.path}`
const title = `${origin}${route.path}`
</script>

<template>
  <div class="share-area">
    <!-- 这里多包一层主要是为了画border -->
    <div class="share-box">
      <!-- 分享图标 -->
      <Share class="share-icon" />
      <!-- 分享字串 -->
      <p class="share-text">分享这篇文章</p>
      <!-- 按钮列表 -->
      <div class="btn-list">
        <button class="btn weixin" @click="qrcodeOpen(url)"><Wechat /></button>
        <button class="btn qq" @click="linkOpen('qq', url, title)"><QQIcon /></button>
        <button class="btn weibo" @click="linkOpen('weibo', url, title)"><Weibo /></button>
        <button class="btn tg" @click="linkOpen('tg', url, title)"><Telegram /></button>
        <button class="btn facebook" @click="linkOpen('facebook', url, title)"><Facebook /></button>
        <button class="btn x" @click="linkOpen('x', url, title)"><XIcon /></button>
        <button
          class="btn copy-btn"
          @click="[shareCopy(url), toastOpen('success', '已成功复制链接')]"
        >
          <Copy />
        </button>
      </div>

      <div class="divider"></div>

      <a href="https://ifdian.net/a/Cnkrru" class="sponser-btn">
        <Heart class="sponser-icon" />
        <p>赞助</p>
      </a>

      <!-- 微信分享的弹窗 -->
      <dialog class="qrcode-dialog">
        <div class="dialog-head">
          <p>微信分享二维码</p>
          <button class="dialog-close" @click="qrcodeClose"><X /></button>
        </div>
        <canvas ref="qrCanvas"></canvas>
      </dialog>
    </div>
  </div>
</template>

<style scoped>
.share-area {
  width: 100%;
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;
}

.share-box {
  width: fit-content;
  height: max-content;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: var(--space-sm);

  padding: var(--space-md);
  /* 边框 12% → 25%，提升可见度（12% 太浅不明显） */
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
  border-radius: var(--space-lg);
}

.share-icon {
  color: var(--g-text);
  opacity: 0.6;
}

.share-text {
  color: var(--g-text);
  opacity: 0.6;
}

.btn-list {
  width: fit-content;
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-sm);
}

.btn {
  width: 40px;
  height: 40px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: var(--radius-sm);
  border: var(--border-width) solid var(--g-color);
}

.weixin {
  background: #07c160;
  border-color: #06ad56;
  color: #fff;
}
.weixin:hover {
  background: #06ad56;
}

.qq {
  background: #12b7f5;
  border-color: #0fa5d8;
  color: #fff;
}
.qq:hover {
  background: #0fa5d8;
}

.weibo {
  background: #e6162d;
  border-color: #c81023;
  color: #fff;
}
.weibo:hover {
  background: #c81023;
}

.tg {
  background: #229ed9;
  border-color: #1b8ac0;
  color: #fff;
}
.tg:hover {
  background: #1b8ac0;
}

.facebook {
  background: #1877f2;
  border-color: #1466ce;
  color: #fff;
}
.facebook:hover {
  background: #1466ce;
}

.x {
  background: #000000;
  border-color: #111111;
  color: #fff;
}
.x:hover {
  background: #111111;
}

.copy-btn {
  background: var(--g-color);
  border-color: var(--g-hover);
  color: #fff;
}
.copy-btn:hover {
  background: var(--g-hover);
}

/* ==========<微信弹窗>========== */
.qrcode-dialog {
  gap: var(--space-sm);
}

.qrcode-dialog[open] {
  width: fit-content;
  height: fit-content;

  padding: var(--space-md);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 15%, transparent);
  border-radius: var(--radius-md);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--space-sm);
}

.dialog-head {
  width: 100%;
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: var(--space-sm);
}

.dialog-close {
  border-radius: var(--radius-md);
  background-color: white;
}

/* ==========<赞助组件>========== */
.divider {
  width: 1px;
  align-self: stretch;
  background-color: color-mix(in srgb, var(--g-color) 12%, transparent);
}

/* 去掉赞助链接下划线 + 修复高度塌陷（10px → fit-content，图标不再被压扁） */
.sponser-btn {
  width: fit-content;
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-sm);

  flex-direction: row;
  text-decoration: none;
}

.sponser-icon {
  color: var(--g-color);
}

.sponser-btn p {
  color: var(--g-color);
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
  /* [响应式-lg] 大屏 */
}

@media (max-width: 1024px) {
  /* [响应式-md] 平板 */
}

@media (max-width: 768px) {
  /* [响应式-sm] 手机：分享盒改列向堆叠，按钮列表允许换行，避免七个按钮横向溢出 */
  .share-box {
    width: 100%;
    flex-direction: column;
    gap: var(--space-sm);
  }
  .btn-list {
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-xs);
  }
  .btn {
    width: 36px;
    height: 36px;
  }
  /* 分隔线小屏隐藏，避免换行后挤占布局 */
  .divider {
    display: none;
  }
}

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏：进一步收紧按钮与文字 */
  .btn {
    width: 32px;
    height: 32px;
  }
  .share-text {
    font-size: 13px;
  }
}
</style>
