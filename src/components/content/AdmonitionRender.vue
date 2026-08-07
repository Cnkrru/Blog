<template>
  <div class="admonition" :class="`admonition-${type}`">
    <div class="admonition-header">
      <div class="admonition-icon">
        <!-- info -->
        <svg v-if="type === 'info'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <!-- success / tip -->
        <svg v-else-if="type === 'success' || type === 'tip'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <!-- warning -->
        <svg v-else-if="type === 'warning'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <!-- error / danger -->
        <svg v-else-if="type === 'error' || type === 'danger'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
        <!-- note -->
        <svg v-else-if="type === 'note'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <!-- 默认 -->
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </div>
      <span class="admonition-title">{{ title }}</span>
    </div>
    <div class="admonition-body" v-html="content"></div>
  </div>
</template>

<script setup lang="ts">
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