<script setup>
// VIcon 统一图标渲染管线：图标数据由构建期 svg-icon.js 生成，组件只负责运行期渲染
import { computed } from 'vue'
import icons from '@/assets/svg-icon-map.js'

const props = defineProps({
  src: { type: String, required: true },
  size: { type: [Number, String], default: 18 },
  color: { type: String },
  title: { type: String }
})

function resolveKey(src) {
  return src.split('/').pop() || src
}

const icon = computed(() => icons[resolveKey(props.src)])

function toDim(value) {
  const s = String(value).trim()
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s
}

const sizeStyle = computed(() => {
  const dimension = toDim(props.size)
  return { width: dimension, height: dimension }
})

const colorStyle = computed(() => props.color ? { color: props.color } : undefined)
</script>

<template>
  <svg
    v-if="icon"
    v-bind="icon.css"
    data-icon="true"
    class="icon"
    :viewBox="icon.viewBox"
    :role="title ? 'img' : undefined"
    :aria-label="title"
    :aria-hidden="title ? undefined : 'true'"
    :style="[sizeStyle, colorStyle]"
    v-html="icon.body"
  ></svg>
  <span v-else class="icon icon-missing" :style="sizeStyle">?</span>
</template>

<style scoped>
.icon {
  display: inline-block;
  flex: none;
  vertical-align: middle;
}

.icon-missing {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 12px;
  color: var(--common-text);
  background: rgba(var(--glass-r, 0), var(--glass-g, 0), var(--glass-b, 0), 0.3);
  border: 1px dashed color-mix(in srgb, var(--common-text) 25%, transparent);
}
</style>
