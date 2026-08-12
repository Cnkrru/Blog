<template>
  <div class="admonition" :class="`admonition-${type}`">
    <div class="admonition-header">
      <div class="admonition-icon">
        <!-- info -->
        <span v-if="type === 'info'" class="svg-icon" :style="{ width: '18px', height: '18px' }" v-html="infoSvg"></span>
        <!-- success / tip -->
        <span v-else-if="type === 'success' || type === 'tip'" class="svg-icon" :style="{ width: '18px', height: '18px' }" v-html="checkSvg"></span>
        <!-- warning -->
        <span v-else-if="type === 'warning'" class="svg-icon" :style="{ width: '18px', height: '18px' }" v-html="alertTriangleSvg"></span>
        <!-- error / danger -->
        <span v-else-if="type === 'error' || type === 'danger'" class="svg-icon" :style="{ width: '18px', height: '18px' }" v-html="xSvg"></span>
        <!-- note -->
        <span v-else-if="type === 'note'" class="svg-icon" :style="{ width: '18px', height: '18px' }" v-html="fileTextSvg"></span>
        <!-- 默认 -->
        <span v-else class="svg-icon" :style="{ width: '18px', height: '18px' }" v-html="infoSvg"></span>
      </div>
      <span class="admonition-title">{{ title }}</span>
    </div>
    <div class="admonition-body" v-html="content"></div>
  </div>
</template>

<script setup lang="ts">
import infoSvg from '@/assets/svg/info.svg?raw'
import checkSvg from '@/assets/svg/check.svg?raw'
import alertTriangleSvg from '@/assets/svg/alert-triangle.svg?raw'
import xSvg from '@/assets/svg/x.svg?raw'
import fileTextSvg from '@/assets/svg/file-text.svg?raw'

defineProps<{
  type: string
  title: string
  content: string
}>()
</script>

<style scoped>
/* ── 容器 ── */
.admonition {
  margin: 1.2rem 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
}

/* ── 头部 ── */
.admonition-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid;
}

.admonition-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.admonition-title {
  line-height: 1.3;
}

/* ── 正文 ── */
.admonition-body {
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.65;
}

/* 重置内部元素间距 */
.admonition-body :deep(p) {
  margin: 0 0 0.6rem 0;
}
.admonition-body :deep(p:last-child) {
  margin-bottom: 0;
}
.admonition-body :deep(code) {
  font-size: 0.85em;
  padding: 0.15em 0.4em;
  border-radius: 4px;
}
.admonition-body :deep(pre) {
  margin: 0.5rem 0;
}
.admonition-body :deep(ul),
.admonition-body :deep(ol) {
  margin: 0.4rem 0;
  padding-left: 1.5rem;
}
.admonition-body :deep(li) {
  margin: 0.2rem 0;
}
.admonition-body :deep(a) {
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* ── info ── */
.admonition-info {
  border-color: color-mix(in srgb, var(--common-color-1) 25%, transparent);
}
.admonition-info .admonition-header {
  background: color-mix(in srgb, var(--common-color-1) 10%, transparent);
  color: var(--common-color-1);
  border-bottom-color: color-mix(in srgb, var(--common-color-1) 15%, transparent);
}
.admonition-info .admonition-body {
  color: var(--common-text);
}
.admonition-info .admonition-body :deep(code) {
  background: color-mix(in srgb, var(--common-color-1) 15%, transparent);
}
.admonition-info .admonition-body :deep(a) {
  color: var(--common-color-1);
}

/* ── success / tip ── */
.admonition-success,
.admonition-tip {
  border-color: color-mix(in srgb, var(--color-success) 30%, transparent);
}
.admonition-success .admonition-header,
.admonition-tip .admonition-header {
  background: color-mix(in srgb, var(--color-success) 10%, transparent);
  color: var(--color-success);
  border-bottom-color: color-mix(in srgb, var(--color-success) 15%, transparent);
}
.admonition-success .admonition-body,
.admonition-tip .admonition-body {
  color: var(--common-text);
}
.admonition-success .admonition-body :deep(code),
.admonition-tip .admonition-body :deep(code) {
  background: color-mix(in srgb, var(--color-success) 15%, transparent);
}
.admonition-success .admonition-body :deep(a),
.admonition-tip .admonition-body :deep(a) {
  color: var(--color-success);
}

/* ── warning ── */
.admonition-warning {
  border-color: color-mix(in srgb, var(--color-warning) 35%, transparent);
}
.admonition-warning .admonition-header {
  background: color-mix(in srgb, var(--color-warning) 12%, transparent);
  color: var(--color-warning);
  border-bottom-color: color-mix(in srgb, var(--color-warning) 18%, transparent);
}
.admonition-warning .admonition-body {
  color: var(--common-text);
}
.admonition-warning .admonition-body :deep(code) {
  background: color-mix(in srgb, var(--color-warning) 15%, transparent);
}
.admonition-warning .admonition-body :deep(a) {
  color: var(--color-warning);
}

/* ── error / danger ── */
.admonition-error,
.admonition-danger {
  border-color: color-mix(in srgb, var(--color-error) 30%, transparent);
}
.admonition-error .admonition-header,
.admonition-danger .admonition-header {
  background: color-mix(in srgb, var(--color-error) 10%, transparent);
  color: var(--color-error);
  border-bottom-color: color-mix(in srgb, var(--color-error) 15%, transparent);
}
.admonition-error .admonition-body,
.admonition-danger .admonition-body {
  color: var(--common-text);
}
.admonition-error .admonition-body :deep(code),
.admonition-danger .admonition-body :deep(code) {
  background: color-mix(in srgb, var(--color-error) 15%, transparent);
}
.admonition-error .admonition-body :deep(a),
.admonition-danger .admonition-body :deep(a) {
  color: var(--color-error);
}

/* ── note ── */
.admonition-note {
  border-color: color-mix(in srgb, var(--common-text) 18%, transparent);
}
.admonition-note .admonition-header {
  background: color-mix(in srgb, var(--common-text) 6%, transparent);
  color: var(--common-text);
  border-bottom-color: color-mix(in srgb, var(--common-text) 10%, transparent);
}
.admonition-note .admonition-body {
  color: var(--common-text);
}
.admonition-note .admonition-body :deep(code) {
  background: color-mix(in srgb, var(--common-text) 10%, transparent);
}
.admonition-note .admonition-body :deep(a) {
  color: var(--common-color-1);
}
</style>