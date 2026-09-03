<script setup>
// VIcon 统一图标渲染管线：图标数据由构建期 svg-icon.js 生成，组件只负责运行期渲染
import { computed } from 'vue'
import icons from '@/assets/svg-icon-map.js'

// 组件参数
const props = defineProps({
  src: { type: String, required: true },
  size: { type: [Number, String], default: 18 },
  title: { type: String }
})

/*
* id: props参数解析函数
* fn: 解析src为图标key，尺寸转css值，返回中间参数
*/
function parseProps(props) {
  const key = props.src.split('/').pop() || props.src
  const size = /^\d+(\.\d+)?$/.test(String(props.size).trim())
    ? `${props.size}px`
    : props.size
  return { icon: icons[key], size, title: props.title }
}

/*
* id: svg属性挂载函数
* fn: 把解析结果挂载成svg完整属性组
*/
function mountSvg(parsed) {
  const style = { width: parsed.size, height: parsed.size }
  if (!parsed.icon) return { exists: false, style }
  return {
    exists: true,
    css: parsed.icon.css,
    body: parsed.icon.body,
    attrs: {
      viewBox: parsed.icon.viewBox,
      role: parsed.title ? 'img' : undefined,
      'aria-label': parsed.title,
      'aria-hidden': parsed.title ? undefined : 'true'
    },
    style
  }
}

const svg = computed(() => mountSvg(parseProps(props)))
</script>

<template>
  <svg
    v-if="svg.exists"
    v-bind="{ ...svg.css, ...svg.attrs }"
    class="icon"
    data-icon="true"
    :style="svg.style"
    v-html="svg.body"
  ></svg>
  <span v-else class="icon icon-missing" :style="svg.style">?</span>
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