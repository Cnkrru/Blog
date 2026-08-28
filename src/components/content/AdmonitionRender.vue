<template>
  <div class="admonition" :class="`admonition-${type}`">
    <div class="admonition-header">
      <div class="admonition-icon">
        <VIcon v-if="type === 'info'" :src="'info.svg'" :size="18" />
        <VIcon v-else-if="type === 'success' || type === 'tip'" :src="'check.svg'" :size="18" />
        <VIcon v-else-if="type === 'warning'" :src="'alert-triangle.svg'" :size="18" />
        <VIcon v-else-if="type === 'error' || type === 'danger'" :src="'x.svg'" :size="18" />
        <VIcon v-else-if="type === 'note'" :src="'file-text.svg'" :size="18" />
        <VIcon v-else :src="'info.svg'" :size="18" />
      </div>
      <span class="admonition-title">{{ title }}</span>
    </div>
    <div class="admonition-body" v-html="content"></div>
  </div>
</template>

<script setup>
import VIcon from '@/components/__common/VIcon.vue'
defineProps(['type', 'title', 'content'])
</script>

<style scoped>
/* ── 容器与变体变量（变体颜色通过根级 CSS 变量下发给子块，避免后代组合） ── */
.admonition {
  --ad-tone: var(--common-color-1);
  --ad-bd: color-mix(in srgb, var(--common-color-1) 25%, transparent);
  --ad-hdr-bg: color-mix(in srgb, var(--common-color-1) 10%, transparent);
  --ad-hdr-bd: color-mix(in srgb, var(--common-color-1) 15%, transparent);
  --ad-code-bg: color-mix(in srgb, var(--common-color-1) 15%, transparent);
  --ad-a: var(--common-color-1);
  margin: 1.2rem 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid;
  border-color: var(--ad-bd);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
}

.admonition-success,
.admonition-tip {
  --ad-tone: var(--color-success);
  --ad-bd: color-mix(in srgb, var(--color-success) 30%, transparent);
  --ad-hdr-bg: color-mix(in srgb, var(--color-success) 10%, transparent);
  --ad-hdr-bd: color-mix(in srgb, var(--color-success) 15%, transparent);
  --ad-code-bg: color-mix(in srgb, var(--color-success) 15%, transparent);
  --ad-a: var(--color-success);
}

.admonition-warning {
  --ad-tone: var(--color-warning);
  --ad-bd: color-mix(in srgb, var(--color-warning) 35%, transparent);
  --ad-hdr-bg: color-mix(in srgb, var(--color-warning) 12%, transparent);
  --ad-hdr-bd: color-mix(in srgb, var(--color-warning) 18%, transparent);
  --ad-code-bg: color-mix(in srgb, var(--color-warning) 15%, transparent);
  --ad-a: var(--color-warning);
}

.admonition-error,
.admonition-danger {
  --ad-tone: var(--color-error);
  --ad-bd: color-mix(in srgb, var(--color-error) 30%, transparent);
  --ad-hdr-bg: color-mix(in srgb, var(--color-error) 10%, transparent);
  --ad-hdr-bd: color-mix(in srgb, var(--color-error) 15%, transparent);
  --ad-code-bg: color-mix(in srgb, var(--color-error) 15%, transparent);
  --ad-a: var(--color-error);
}

.admonition-note {
  --ad-tone: var(--common-text);
  --ad-bd: color-mix(in srgb, var(--common-text) 18%, transparent);
  --ad-hdr-bg: color-mix(in srgb, var(--common-text) 6%, transparent);
  --ad-hdr-bd: color-mix(in srgb, var(--common-text) 10%, transparent);
  --ad-code-bg: color-mix(in srgb, var(--common-text) 10%, transparent);
  --ad-a: var(--common-color-1);
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
  background: var(--ad-hdr-bg);
  color: var(--ad-tone);
  border-bottom-color: var(--ad-hdr-bd);
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
  color: var(--common-text);
}

/* v-html 注入的正文内容（无 scoped 属性，非 scoped 命中；子级标签 2.3 允许） */
</style>

<style>
.admonition-body p {
  margin: 0 0 0.6rem 0;
}
.admonition-body p:last-child {
  margin-bottom: 0;
}
.admonition-body code {
  font-size: 0.85em;
  padding: 0.15em 0.4em;
  border-radius: 4px;
  background: var(--ad-code-bg);
}
.admonition-body pre {
  margin: 0.5rem 0;
}
.admonition-body ul,
.admonition-body ol {
  margin: 0.4rem 0;
  padding-left: 1.5rem;
}
.admonition-body li {
  margin: 0.2rem 0;
}
.admonition-body a {
  text-decoration: underline;
  text-underline-offset: 2px;
  color: var(--ad-a);
}
</style>