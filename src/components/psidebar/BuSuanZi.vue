<script setup lang="ts">
import X from '../icon/X.vue'
import { bszOpen, bszClose } from '@/composables/psidebar'
</script>

<template>
  <button class="bsz-btn" @click="bszOpen()">统计</button>

  <dialog class="bsz-box">
    <div class="bsz-header">
      <p>站点统计</p>
      <button @click="bszClose()"><X /></button>
    </div>

    <div class="bsz-body">
      <div class="bsz-item">
        <span class="bsz-label">今日访问</span>
        <span class="bsz-num" id="busuanzi_today_pv">…</span>
      </div>
      <div class="bsz-item">
        <span class="bsz-label">今日访客</span>
        <span class="bsz-num" id="busuanzi_today_uv">…</span>
      </div>
      <div class="bsz-item">
        <span class="bsz-label">站点访问</span>
        <span class="bsz-num" id="busuanzi_site_pv">…</span>
      </div>
      <div class="bsz-item">
        <span class="bsz-label">站点访客</span>
        <span class="bsz-num" id="busuanzi_site_uv">…</span>
      </div>
      <div class="bsz-item">
        <span class="bsz-label">本页浏览</span>
        <span class="bsz-num" id="busuanzi_page_pv">…</span>
      </div>
      <div class="bsz-item">
        <span class="bsz-label">本页访客</span>
        <span class="bsz-num" id="busuanzi_page_uv">…</span>
      </div>
    </div>

    <div class="bsz-footer">
      <p>Power by</p>
      <a href="https://www.busuanzi.cc/">不蒜子</a>
    </div>
  </dialog>
</template>

<style scoped>
.bsz-btn {
  width: 90%;
  height: fit-content;
  min-height: 40px;

  padding: var(--space-sm);
  border-radius: var(--radius-md);

  color: var(--g-text);

  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 30%, transparent);
  background: color-mix(in srgb, var(--g-color) 30%, transparent);
  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.bsz-btn:hover {
  transform: translateY(-2px);
  background: color-mix(in srgb, var(--g-color) 50%, transparent);
  border-color: color-mix(in srgb, var(--g-color) 45%, transparent);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.bsz-box {
  width: 400px;
  height: 400px;

  border: var(--border-width) solid color-mix(in srgb, var(--g-text) 8%, transparent);
  border-radius: var(--radius-lg);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.95);

  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  box-shadow: 0 20px 60px var(--common-shadow);
  padding: 20px;
}

.bsz-box::backdrop {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.bsz-header {
  width: 100%;
  height: 10%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 60%;
}

.bsz-header p {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--g-text);
}

.bsz-header button {
  width: 28px;
  height: 28px;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: var(--border-width) solid color-mix(in srgb, var(--g-text) 8%, transparent);
  background: color-mix(in srgb, var(--g-text) 8%, transparent);
  color: var(--g-text);
  cursor: pointer;
  transition: background 0.2s ease;
}

.bsz-header button:hover {
  background: color-mix(in srgb, var(--g-text) 18%, transparent);
}

.bsz-body {
  width: 100%;
  height: 80%;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: var(--space-sm);
  align-items: stretch;
}

.bsz-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: var(--space-xs);

  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 20%, transparent);
  border-radius: var(--radius-md);
  padding: var(--space-sm);
  background: color-mix(in srgb, var(--g-color) 12%, transparent);
}

.bsz-label {
  font-size: 13px;
  color: color-mix(in srgb, var(--g-text) 60%, transparent);
}

.bsz-num {
  font-size: 22px;
  font-weight: 700;
  color: var(--g-color);
}

.bsz-footer {
  width: 100%;
  height: 10%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  text-align: center;
  font-size: 11px;
  opacity: 0.4;
}

.bsz-footer p {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--g-text);
}

.bsz-footer a {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--g-color);
}
</style>
