<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import '@/assets/css/content.css' // 文章排版样式集中在此文件（shiki 色板在 css/theme/*.css）
import { content } from '@/modules/content'
const mermaid = content

const root = ref(null)
let observer // MutationObserver 存根，卸载时清理
let zoom     // medium-zoom 实例，卸载时 detach

// 代码块复制：按钮由编译脚本构建期写死（div.language-xx .code-toolbar > button.copy），
// 这里只做事件委托（对标 VitePress useCopyCode），slot 内容变化也无需重新绑定
const onCopyClick = (e) => {
    const el = e.target.closest('button.copy')
    if (!el || !root.value.contains(el)) return
    const wrapper = el.closest('div[class*="language-"]')
    // textContent 不含行号伪元素，复制的是纯净源码
    const text = wrapper?.querySelector('pre code')?.textContent || ''
    navigator.clipboard.writeText(text).then(() => {
        el.classList.add('copied')
        setTimeout(() => {
            el.classList.remove('copied')
            el.blur()
        }, 2000)
    })
}

// 图片放大（对标 VitePress 社区的 medium-zoom）：正文图片点击原地放大。
// 首次动态导入创建实例并绑定，之后内容变化 attach() 重绑即可（attach 对已渲染图幂等）
const bindZoom = async () => {
    if (!root.value) return
    const { default: mediumZoom } = await import('medium-zoom')
    if (!zoom) {
        zoom = mediumZoom('.content img', { background: 'var(--g-bg)' })
    } else {
        zoom.attach('.content img')
    }
}

onMounted(() => {
    root.value?.addEventListener('click', onCopyClick)
    // 文章组件是 defineAsyncComponent 异步注入，onMounted 时块可能尚不存在，
    // 用 MutationObserver 监听子树变化，slot 落定后补跑 mermaid 渲染与图片重绑
    observer = new MutationObserver(() => {
        mermaid.mermaid_maker()
        bindZoom()
    })
    observer.observe(root.value, { childList: true, subtree: true })
    mermaid.mermaid_maker()
    bindZoom()
})
onBeforeUnmount(() => {
    root.value?.removeEventListener('click', onCopyClick)
    observer?.disconnect()
    zoom?.detach()
})
</script>

<template>
<div ref="root" class="content">
    <slot />
</div>
</template>
