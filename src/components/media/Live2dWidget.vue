<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

let oml2dInstance: any = null

const initLive2d = () => {
  if (typeof window === 'undefined') return

  const existing = document.getElementById('oml2d-script')
  if (existing) return

  const script = document.createElement('script')
  script.id = 'oml2d-script'
  script.src = 'https://cdn.jsdelivr.net/npm/oh-my-live2d/dist/index.min.js'
  script.onload = async () => {
    if (!window.OML2D) return
    oml2dInstance = await window.OML2D.loadOml2d({
      models: [
        {
          path: 'https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/%E5%B4%A9%E5%9D%8F%E5%AD%A6%E5%9B%AD2/yiselin/model.json',
          scale: 0.08,
          position: [0, 60]
        }
      ],
      tips: {
        style: { offsetY: 40 },
        message: {
          default: ['欢迎来到我的博客', '今天也要加油哦~', '有什么我可以帮你的吗？'],
          idle: ['好无聊啊...', '陪我说说话吧']
        }
      },
      mobile: { show: true, scale: 0.5 },
      sayHello: true,
      dock: { position: 'right' }
    })
  }
  document.body.appendChild(script)
}

onMounted(() => { initLive2d() })

onUnmounted(() => {
  if (oml2dInstance?.destroy) {
    oml2dInstance.destroy()
    oml2dInstance = null
  }
})
</script>

<template>
  <div class="live2d-container"></div>
</template>

<!-- 布局样式 -->
<style scoped>
.live2d-container {
  position: fixed;
  z-index: 9999;
}
</style>

<!-- 颜色样式 -->
<style scoped>
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
</style>
