<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useSeo } from '../composables/common/seo'
import {
  photoAlbum,
  photoAlbumCover,
  photoAlbums,
  photoClean,
  photoCleanSync,
  photoCloseAlbum,
  photoCloseViewer,
  photoImageThumb,
  photoOpenAlbum,
  photoOpenViewer,
  photoViewer,
  photoViewerMove,
  type PhotoImage,
} from '../composables/pamin/photo.ts'

useSeo({
  title: '图集',
  description: '博客的图集，按主题收录照片。',
  path: '/photo',
})

// setup 期同步加载，让 SSG 产物就带相册内容；数据未就绪再走异步兜底
const photoLoaded = photoCleanSync()

// 灯箱快捷键：ESC 关闭，左右方向键切换
const photoKeydown = (event: KeyboardEvent): void => {
  if (photoViewer.value < 0) return
  if (event.key === 'Escape') photoCloseViewer()
  if (event.key === 'ArrowLeft') photoViewerMove(-1)
  if (event.key === 'ArrowRight') photoViewerMove(1)
}

// 灯箱打开时锁 body 滚动，避免背景跟着滚
let bodyOverflow: string = ''
watch(photoViewer, (value: number): void => {
  if (value >= 0) {
    bodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = bodyOverflow
  }
})

// 移动端触摸滑动切换：记录起点，结束时按位移方向切换
let touchStartX: number = 0
const photoTouchStart = (event: TouchEvent): void => {
  touchStartX = event.touches[0]?.clientX ?? 0
}
const photoTouchEnd = (event: TouchEvent): void => {
  const delta = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX
  if (Math.abs(delta) < 50) return
  photoViewerMove(delta > 0 ? -1 : 1)
}

// 缩略图加载失败时回退到原图，避免出现破图
const onThumbError = (event: Event, image: PhotoImage): void => {
  const target = event.target
  if (!(target instanceof HTMLImageElement)) return
  if (target.src !== image.src) target.src = image.src
}

// 灯箱当前图片，用于展示图注/拍摄信息
const viewerImage = computed<PhotoImage | null>(
  () => photoAlbum.value?.images[photoViewer.value] ?? null,
)

onMounted(() => {
  if (!photoLoaded) photoClean()
  window.addEventListener('keydown', photoKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', photoKeydown)
  document.body.style.overflow = bodyOverflow
})
</script>

<template>
  <div class="photo-list">
    <!-- 相册列表态：一册一卡，封面走统一取数逻辑 -->
    <div class="album-grid" v-if="!photoAlbum">
      <button
        v-for="album in photoAlbums"
        :key="album.id"
        class="album-card"
        @click="photoOpenAlbum(album.id)"
      >
        <img class="album-cover" :src="photoAlbumCover(album)" :alt="album.name" loading="lazy" />
        <div class="album-info">
          <div class="album-name">{{ album.name }}</div>
          <div class="album-meta">{{ album.images.length }} 张</div>
        </div>
      </button>
      <div class="photo-empty" v-if="photoAlbums.length === 0">暂无相册</div>
    </div>

    <!-- 相册详情态：返回 + 相册信息 + 瀑布流图片 -->
    <div class="album-detail" v-else>
      <div class="album-head">
        <button class="back-btn" @click="photoCloseAlbum">返回</button>
        <div class="album-title">
          <div class="album-name">{{ photoAlbum.name }}</div>
          <div class="album-desc">{{ photoAlbum.description }}</div>
        </div>
      </div>
      <div class="photo-grid">
        <button
          v-for="(image, i) in photoAlbum.images"
          :key="image.src + i"
          class="photo-item"
          @click="photoOpenViewer(i)"
        >
          <img
            :src="photoImageThumb(image)"
            :alt="image.alt ?? `${photoAlbum.name} ${i + 1}`"
            loading="lazy"
            @error="onThumbError($event, image)"
          />
        </button>
      </div>
    </div>

    <!-- 灯箱：点击遮罩或 ESC 关闭，左右按钮/方向键/滑动切换 -->
    <div
      class="viewer"
      v-if="photoViewer >= 0 && photoAlbum && viewerImage"
      @click="photoCloseViewer"
      @touchstart.passive="photoTouchStart"
      @touchend="photoTouchEnd"
    >
      <button class="viewer-close" @click="photoCloseViewer">×</button>
      <button class="viewer-side viewer-prev" @click.stop="photoViewerMove(-1)">‹</button>
      <img
        class="viewer-img"
        :src="viewerImage.src"
        :alt="viewerImage.alt ?? `${photoAlbum.name} ${photoViewer + 1}`"
        @click.stop
      />
      <button class="viewer-side viewer-next" @click.stop="photoViewerMove(1)">›</button>
      <div class="viewer-meta">
        <div class="viewer-caption" v-if="viewerImage.caption">{{ viewerImage.caption }}</div>
        <div class="viewer-sub" v-if="viewerImage.shotAt || viewerImage.location">
          <span v-if="viewerImage.shotAt">{{ viewerImage.shotAt }}</span>
          <span v-if="viewerImage.shotAt && viewerImage.location">·</span>
          <span v-if="viewerImage.location">{{ viewerImage.location }}</span>
        </div>
        <div class="viewer-count">{{ photoViewer + 1 }} / {{ photoAlbum.images.length }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-list {
  height: 100%; /* 页面根吃满main-body可视高度，内容区才有固定高度可滚 */
  overflow-y: auto;
}

/* ====================<相册列表>==================== */
.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-md);
}

.album-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0;
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
  border-radius: var(--radius-lg);
  background-color: color-mix(in srgb, var(--glass-r), transparent);
  cursor: pointer;
  transition:
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.album-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--g-color) 40%, transparent);
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.06),
    0 8px 20px rgba(0, 0, 0, 0.1);
}

.album-cover {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}

.album-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--space-sm) var(--space-md) var(--space-md);
  text-align: left;
}

.album-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--g-text);
}

.album-meta,
.album-desc {
  font-size: 13px;
  color: var(--g-text);
  opacity: 0.7;
}

.photo-empty {
  grid-column: 1 / -1;
  padding: var(--space-lg);
  text-align: center;
  font-size: 14px;
  color: var(--g-text);
  opacity: 0.6;
}

/* ====================<相册详情>==================== */
.album-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.album-head {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.album-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.back-btn {
  flex-shrink: 0;
  padding: var(--space-xs) var(--space-md);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--g-text);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  border-color: var(--g-color);
  color: var(--g-color);
}

/* 瀑布流：列宽固定、图片按原始比例自然排布 */
.photo-grid {
  columns: 4 220px;
  column-gap: var(--space-md);
}

.photo-item {
  width: 100%;
  margin-bottom: var(--space-md);
  padding: 0;
  border: none;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: color-mix(in srgb, var(--glass-r), transparent);
  cursor: zoom-in;
  break-inside: avoid;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.photo-item img {
  width: 100%;
  display: block;
}

.photo-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

/* ====================<灯箱>==================== */
.viewer {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.82);
  backdrop-filter: blur(8px);
  animation: viewer-in 0.2s ease;
}

@keyframes viewer-in {
  from {
    opacity: 0;
  }
}

.viewer-img {
  max-width: 90vw;
  max-height: 78vh;
  object-fit: contain;
  border-radius: var(--radius-md);
  cursor: default;
}

.viewer-close {
  position: absolute;
  top: var(--space-lg);
  right: var(--space-lg);
  width: 40px;
  height: 40px;
  border: none;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.viewer-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.viewer-side {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 64px;
  border: none;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.viewer-side:hover {
  background: rgba(255, 255, 255, 0.3);
}

.viewer-prev {
  left: var(--space-lg);
}

.viewer-next {
  right: var(--space-lg);
}

.viewer-meta {
  position: absolute;
  left: 50%;
  bottom: var(--space-lg);
  transform: translateX(-50%);
  max-width: 80vw;
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
}

.viewer-caption {
  font-size: 14px;
  margin-bottom: 4px;
}

.viewer-sub {
  font-size: 12px;
  opacity: 0.7;
}

.viewer-count {
  margin-top: 4px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
  .photo-grid {
    columns: 3 200px;
  }
}

@media (max-width: 768px) {
  .album-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  .photo-grid {
    columns: 2 160px;
  }
  .viewer-side {
    width: 36px;
    height: 52px;
    font-size: 22px;
  }
}

@media (max-width: 480px) {
  .album-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--space-sm);
  }
  .photo-grid {
    columns: 1;
  }
  .viewer-side {
    display: none; /* 窄屏没有按钮空间，用滑动/方向键切换 */
  }
}
</style>
