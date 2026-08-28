<script setup>
import VIcon from '@/components/__common/VIcon.vue'
import { onMounted, watch, ref, nextTick } from 'vue'

const props = defineProps(['title', 'url', 'description'])

const scriptLoaded = ref(false)

const loadShareScript = () => {
  if (document.querySelector('.addtoany-script')) { initButtons(); return }
  const script = document.createElement('script')
  script.className = 'addtoany-script'
  script.src = 'https://static.addtoany.com/menu/page.js'
  script.async = true
  script.onload = () => { scriptLoaded.value = true; initButtons() }
  document.body.appendChild(script)
}

const initButtons = () => {
  nextTick(() => {
    if (window.a2a?.init_all) window.a2a.init_all()
  })
}

onMounted(() => loadShareScript())
watch(() => props.url, () => { if (scriptLoaded.value) initButtons() })
</script>

<template>
  <div class="share-container">
    <div class="share-header">
      <VIcon :src="'share.svg'" :size="18" class="share-icon" />
      <span class="share-title">分享这篇文章</span>
    </div>
    <div class="a2a_kit a2a_kit_size_32 a2a_default_style" :data-a2a-url="url" :data-a2a-title="title">
      <a class="a2a_button_wechat"></a>
      <a class="a2a_button_qzone"></a>
      <a class="a2a_button_copy_link"></a>
      <a class="a2a_dd" href="https://www.addtoany.com/share"></a>
    </div>
  </div>
</template>

<style scoped>
.share-container {
  padding: 14px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}
.share-header {
  display: flex;
  align-items: center;
  gap: 6px;
}
.share-icon {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
}
.share-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--common-text);
  opacity: 0.6;
}
</style>

<style>
/* a2a 分享库渲染的 DOM，需非 scoped 命中 */
.a2a_kit a {
  border-radius: 8px !important;
  transition: transform 0.15s ease, opacity 0.15s ease !important;
}

.a2a_kit a:hover {
  transform: translateY(-2px) !important;
  opacity: 0.8 !important;
}
</style>
