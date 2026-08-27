<script setup>
// VButton 统一按钮渲染管线：管理 button 原生语义 + VIcon 集成 + variant/size/shape 配色骨架。
// 每个按钮的独有样式仍通过透传 class / slot 外挂，不进入组件内部。
import { computed } from 'vue'
import VIcon from './VIcon.vue'

const props = defineProps({
  // primary | secondary | ghost | text | danger
  variant: { type: String, default: 'ghost' },
  // 底色几何：数字为按钮高度+最小边长(px)
  size: { type: [Number, String], default: 32 },
  // round | pill | rect —— 控制圆角
  shape: { type: String, default: 'pill' },
  // VIcon 来源（svg 文件名）
  icon: { type: String, default: '' },
  iconSize: { type: [Number, String], default: null },
  // 覆盖 shape 的圆角（数字按 px，字符串按原样传）
  radius: { type: [Number, String], default: null },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  // 自动高度：不强制固定 height/min-width，由内容与 padding 撑起（适合文本/混合钮）
  autoHeight: { type: Boolean, default: false }
})

function toDim(value) {
  const s = String(value).trim()
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s
}

const dim = computed(() => props.autoHeight ? undefined : toDim(props.size))
const minW = computed(() => props.autoHeight ? undefined : toDim(props.size))

const iconDim = computed(() => {
  if (props.iconSize) return toDim(props.iconSize)
  return (Math.max(8, Math.round(parseFloat(props.size) * 0.55))) + 'px'
})

const radiusCss = computed(() => {
  if (props.radius == null || props.radius === '') return undefined
  return toDim(props.radius)
})
</script>

<template>
  <button
    class="v-btn"
    :class="[`v-btn-${variant}`, `v-btn-${shape}`, { 'v-btn-auto': autoHeight }]"
    :style="{ height: dim, minWidth: minW, borderRadius: radiusCss }"
    :type="type"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="v-btn-spin"><VIcon :src="'loading.svg'" :size="iconDim" /></span>
    <VIcon v-else-if="icon" :src="icon" :size="iconDim" />
    <slot v-if="$slots.default" />
  </button>
</template>

<style scoped>
.v-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: var(--v-btn-pad, 0);
  box-sizing: border-box;
  border: 1px solid var(--v-btn-border, transparent);
  background: transparent;
  color: var(--common-text);
  font: inherit;
  cursor: pointer;
  vertical-align: middle;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    filter 0.2s ease,
    transform 0.12s ease;
}

.v-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.v-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.v-btn-spin {
  display: inline-flex;
  animation: v-btn-rotate 0.9s linear infinite;
}

@keyframes v-btn-rotate {
  to {
    transform: rotate(360deg);
  }
}

/* —— 外形 —— */
.v-btn-round {
  border-radius: 50%;
}

.v-btn-pill {
  border-radius: 999px;
}

.v-btn-rect {
  border-radius: 8px;
}

/* —— 配色骨架 —— */
.v-btn-primary {
  background: var(--v-btn-bg, var(--common-color-1));
  border-color: var(--v-btn-border, var(--common-color-1));
  color: #fff;
}

.v-btn-primary:hover:not(:disabled) {
  filter: brightness(1.1);
}

.v-btn-secondary {
  border-color: color-mix(in srgb, var(--common-text) 28%, transparent);
  color: var(--common-text);
}

.v-btn-secondary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--common-text) 9%, transparent);
}

.v-btn-ghost {
  color: var(--v-btn-color, var(--common-text));
  background: var(--v-btn-bg, transparent);
}

.v-btn-ghost:hover:not(:disabled) {
  background: var(--v-btn-hover-bg, color-mix(in srgb, var(--common-text) 9%, transparent));
}

.v-btn-text {
  color: var(--common-color-1);
}

.v-btn-text:hover:not(:disabled) {
  background: color-mix(in srgb, var(--common-color-1) 10%, transparent);
}

.v-btn-danger {
  background: var(--color-error);
  border-color: var(--color-error);
  color: #fff;
}

.v-btn-danger:hover:not(:disabled) {
  filter: brightness(1.08);
}
</style>