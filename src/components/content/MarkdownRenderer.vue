<template>
  <div>
    <SimpleMarkdownParser :content="content" />
    <!-- 自定义灯箱-->
    <div v-if="showLightbox" class="lightbox-overlay" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <button class="lightbox-close" @click="closeLightbox">&times;</button>
        <img :src="lightboxImages[currentImageIndex].src" :alt="lightboxImages[currentImageIndex].title">
        <div class="lightbox-title">{{ lightboxImages[currentImageIndex].title }}</div>
        <div class="lightbox-nav">
          <button class="lightbox-prev" @click="prevImage" :disabled="currentImageIndex === 0">&lt;</button>
          <button class="lightbox-next" @click="nextImage" :disabled="currentImageIndex === lightboxImages.length - 1">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import SimpleMarkdownParser from './SimpleMarkdownParser.vue'
import LazyImage from './LazyImage.vue'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:toc'])

const showLightbox = ref(false)
const currentImageIndex = ref(0)
const lightboxImages = ref([])
const lazyImages = ref([])
let observer = null

const extractToc = (content) => {
  const toc = []
  const lines = content.split('\n')
  const levelCounters = [0, 0, 0, 0, 0, 0]
  let headingCounter = 0

  lines.forEach((line) => {
    const headingMatch = line.match(/^(#{1,6})\s*(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2].trim()
      const id = `heading-${headingCounter++}`

      for (let i = level; i < levelCounters.length; i++) {
        levelCounters[i] = 0
      }
      levelCounters[level - 1]++

      let numbering = ''
      for (let i = 0; i < level; i++) {
        if (levelCounters[i] > 0) {
          numbering += levelCounters[i] + '.'
        }
      }
      numbering = numbering.slice(0, -1)

      toc.push({ level, text, id, numbering })
    }
  })

  return toc
}

const openLightbox = (index) => {
  currentImageIndex.value = index
  showLightbox.value = true
}

const closeLightbox = () => {
  showLightbox.value = false
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const nextImage = () => {
  if (currentImageIndex.value < lightboxImages.value.length - 1) {
    currentImageIndex.value++
  }
}

const onImageLoad = (index) => {
  // 图片加载完成，可用于调试或统计
}

const addImageClickListeners = () => {
  const contentImages = document.querySelectorAll('.markdown-content img, .post-content img, .markdown-image')
  const imageData = []
  const newLazyImages = []

  contentImages.forEach((image, index) => {
    const src = image.src
    const alt = image.alt || ''

    imageData.push({ src, title: alt })

    newLazyImages.push({
      id: index,
      src,
      alt,
      loaded: false
    })

    image.style.cursor = 'pointer'
    image.addEventListener('click', () => {
      openLightbox(index)
    })
  })

  lightboxImages.value = imageData
  lazyImages.value = newLazyImages
}

const cleanupObserver = () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

onMounted(() => {
  const toc = extractToc(props.content)
  emit('update:toc', toc)

  setTimeout(() => {
    addImageClickListeners()
  }, 200)
})

watch(() => props.content, () => {
  const toc = extractToc(props.content)
  emit('update:toc', toc)

  setTimeout(() => {
    addImageClickListeners()
  }, 200)
})

onUnmounted(() => {
  cleanupObserver()
})
</script>

<style scoped>
.markdown-content {
  line-height: 1.8;
  font-size: 16px;
}

.markdown-content :deep(h1) {
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
}

.markdown-content :deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
}

.markdown-content :deep(h3) {
  font-size: 1.25em;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
}

.markdown-content :deep(p) {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-content :deep(code) {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 14px;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
    font-family: 'Fira Code', 'Consolas', monospace;
  }

  .markdown-content :deep(pre) {
    padding: 16px;
    overflow: auto;
    font-size: 14px;
    line-height: 1.45;
    border-radius: 6px;
    margin-bottom: 16px;
  }

  .markdown-content :deep(pre code) {
    padding: 0;
    margin: 0;
    background-color: transparent;
    border-radius: 0;
  }

  .markdown-content :deep(.hljs) {
    border-radius: 0 0 6px 6px;
  }

  /* 代码块容器样式 */
  .markdown-content :deep(.code-block-container) {
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 3px solid var(--center-card-border-color);
  }

  /* 代码块头部样式 */
  .markdown-content :deep(.code-block-header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background-color: var(--card-bg);
    border-bottom: 1px solid var(--border-color);
  }

  /* 代码语言标签样式 */
  .markdown-content :deep(.code-language) {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* 复制按钮样式 */
  .markdown-content :deep(.copy-button) {
    background-color: var(--button-bg);
    border: 2px solid var(--button-border);
    border-radius: 8px;
    padding: 4px 8px;
    font-size: 12px;
    text-align: center;
    color: var(--button-text);
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
    box-shadow: 0 2px 8px var(--shadow-color);
  }

  .markdown-content :deep(.copy-button:hover) {
    background-color: var(--button-hover-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-color);
  }

  .markdown-content :deep(.copy-button.copied) {
    background-color: #28a745;
    color: white;
  }

  /* 代码块样式 */
  .markdown-content :deep(pre) {
    margin-bottom: 0;
    border-radius: 0 0 6px 6px;
  }

.markdown-content :deep(blockquote) {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 0 0 16px 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-content :deep(li + li) {
  margin-top: 0.25em;
}

.markdown-content :deep(table) {
  border-collapse: collapse;
  margin-bottom: 16px;
  width: 100%;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-content :deep(th) {
  font-weight: 600;
  background-color: #f6f8fa;
}

.markdown-content :deep(tr:nth-child(2n)) {
  background-color: #f6f8fa;
}

.markdown-content :deep(img) {
  max-width: 100%;
  box-sizing: border-box;
  display: block;
  margin: 0 auto;
}

.markdown-content :deep(.mermaid) {
  text-align: center;
  margin: 20px 0;
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.markdown-content :deep(.katex-display) {
  margin: 16px 0;
  overflow-x: auto;
}

/* 灯箱样式 */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.lightbox-close {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  margin-bottom: 15px;
}

.lightbox-title {
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
}

.lightbox-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.lightbox-prev,
.lightbox-next {
  background-color: var(--button-bg);
  border: 2px solid var(--button-border);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 16px;
  color: var(--button-text);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.lightbox-prev:hover,
.lightbox-next:hover {
  background-color: var(--button-hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.lightbox-prev:disabled,
.lightbox-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>