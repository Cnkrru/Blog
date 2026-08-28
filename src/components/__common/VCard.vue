<script setup>
// VCard 统一毛玻璃容器：收敛玻璃表面（背景/边框/圆角/blur/padding），内部布局交给 slot，
// 关键值走 CSS 变量便于外部按处覆盖（--v-card-*），避免为每张卡重复写玻璃声明。
import { computed } from 'vue'

const props = defineProps({
  // 渲染的标签，默认 div
  tag: { type: String, default: 'div' },
  // glass | plain —— plain 彻底关闭玻璃表面（背景/边框/blur），供外层已有玻璃时做内层空白容器
  tone: { type: String, default: 'glass' },
  // 以下为空值时走样式基线（CSS 变量默认），传值则内联覆盖
  radius: { type: [Number, String], default: null },
  padding: { type: [Number, String], default: null },
  alpha: { type: [Number, String], default: null },
  blur: { type: Number, default: null },
  border: { type: Boolean, default: true }
})

function toDim(value) {
  const s = String(value).trim()
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s
}

// 仅当显式传入时输出内联覆盖，否则交给基线/外部 CSS 变量，保证外挂可覆盖
const cardStyle = computed(() => {
  const style = {}
  if (props.tone === 'plain') return style
  if (props.radius != null && props.radius !== '') style.borderRadius = toDim(props.radius)
  if (props.padding != null && props.padding !== '')
    style.padding = toDim(props.padding)
  if (props.alpha != null && props.alpha !== '')
    style.background = `rgba(var(--glass-r), var(--glass-g), var(--glass-b), ${props.alpha})`
  if (props.border === false) style.border = 'none'
  if (props.blur != null && props.blur > 0) {
    const b = `blur(${props.blur}px)`
    style.backdropFilter = b
    style.WebkitBackdropFilter = b
  }
  return style
})
</script>

<template>
  <component
    :is="tag"
    class="v-card"
    :class="`v-card-${tone}`"
    :style="cardStyle"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<style scoped>
/* —— 玻璃表面基线（值均可经 --v-card-* 覆盖） —— */
.v-card {
  box-sizing: border-box;
  flex: none;
  border: 1px solid var(--v-card-border, color-mix(in srgb, var(--common-color-1) 10%, transparent));
  border-radius: var(--v-card-radius, 12px);
  padding: var(--v-card-pad, 14px);
  background: var(
    --v-card-bg,
    rgba(var(--glass-r), var(--glass-g), var(--glass-b), var(--v-card-alpha, 0.5))
  );
  backdrop-filter: blur(var(--v-card-blur, 0px));
  -webkit-backdrop-filter: blur(var(--v-card-blur, 0px));
  color: var(--common-text);
}
/* —— plain：彻底关闭玻璃表面（外层已玻璃时做内容容器） —— */
.v-card-plain {
  background: transparent;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
</style>