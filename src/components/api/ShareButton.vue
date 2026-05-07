<script setup lang="ts">
import { onMounted, watch, ref, nextTick } from 'vue'

const props = defineProps<{
  title: string
  url: string
  description?: string
}>()

const scriptLoaded = ref(false)

const loadShareScript = () => {
  if (document.getElementById('addtoany-script')) {
    initButtons()
    return
  }

  const script = document.createElement('script')
  script.id = 'addtoany-script'
  script.src = 'https://static.addtoany.com/menu/page.js'
  script.async = true
  script.onload = () => {
    scriptLoaded.value = true
    initButtons()
  }
  document.body.appendChild(script)
}

const initButtons = () => {
  nextTick(() => {
    if ((window as any).a2a && (window as any).a2a.init_all) {
      (window as any).a2a.init_all()
    }
  })
}

onMounted(() => {
  loadShareScript()
})

watch(() => props.url, () => {
  if (scriptLoaded.value) {
    initButtons()
  }
})
</script>

<template>
  <div class="share-container">
    <div class="share-header">
      <span class="share-icon">🔗</span>
      <span class="share-title">分享这篇文章</span>
    </div>

    <div
      class="a2a_kit a2a_kit_size_32 a2a_default_style"
      :data-a2a-url="url"
      :data-a2a-title="title"
    >
      <a class="a2a_button_copy_link"></a>
      <a class="a2a_button_wechat"></a>
      <a class="a2a_button_weibo"></a>
      <a class="a2a_button_twitter"></a>
      <a class="a2a_button_facebook"></a>
      <a class="a2a_button_telegram"></a>
      <a class="a2a_button_reddit"></a>
      <a class="a2a_dd" href="https://www.addtoany.com/share"></a>
    </div>
  </div>
</template>

<!-- 布局样式 -->
<style scoped>
.share-container {
  padding: 16px 0;
}

.share-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.share-icon {
  font-size: 18px;
}

.share-title {
  font-size: 15px;
  font-weight: 600;
}
</style>

<!-- 颜色样式 -->
<style scoped>
.share-title {
  color: var(--common-text);
}

:deep(.a2a_kit a) {
  transition: all 0.2s ease;
}

:deep(.a2a_kit a:hover) {
  transform: translateY(-2px);
}
</style>
