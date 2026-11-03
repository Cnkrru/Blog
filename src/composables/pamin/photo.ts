import { ref } from 'vue'
import axios from 'axios'

export type PhotoImage = {
  src: string // 原图，灯箱展示用
  thumb?: string // 缩略图，列表/瀑布流用，缺省回退 src
  alt?: string // 无障碍描述
  caption?: string // 灯箱图注
  shotAt?: string // 拍摄时间
  location?: string // 拍摄地点
}

export type PhotoAlbum = {
  id: string
  name: string
  description?: string
  cover?: string // 相册封面，缺省取第一张图的 thumb，再回退 src
  images: PhotoImage[]
}

// 构建期可同步取到相册全表（dist/.cache/photos.json 由构建管线从 public/config/photos.json 复制），
//   setup 期即可用 → Photo 页在 SSG 产物里就有真内容；副本缺失时仍走 axios 兜底
const localPhoto = import.meta.glob<PhotoAlbum[]>('/dist/.cache/photos.json', {
  eager: true,
  import: 'default',
})
export let photoCache: PhotoAlbum[] = localPhoto['/dist/.cache/photos.json'] ?? []

export const photoAlbums = ref<PhotoAlbum[]>([])
export const photoAlbum = ref<PhotoAlbum | null>(null) // 当前相册，null 表示列表态
export const photoViewer = ref(-1) // 灯箱索引，-1 表示关闭

const photoBuild = (): void => {
  photoAlbums.value = photoCache
}

// 取相册封面：显式 cover 优先，否则第一张图的 thumb，最后回退原图
export const photoAlbumCover = (album: PhotoAlbum): string => {
  const first = album.images[0]
  return album.cover ?? first?.thumb ?? first?.src ?? ''
}

// 取列表缩略图：thumb 优先，缺省用原图
export const photoImageThumb = (image: PhotoImage): string => image.thumb ?? image.src

// setup 期同步可用 → SSG 产物带真内容；未就绪返回 false 交异步兜底
export const photoCleanSync = (): boolean => {
  if (photoAlbums.value.length > 0) return true
  if (photoCache.length === 0) return false
  photoBuild()
  return true
}

export const photoClean = async (): Promise<void> => {
  if (photoCleanSync()) return
  photoCache = (await axios.get<PhotoAlbum[]>('/config/photos.json')).data
  photoBuild()
}

export const photoOpenAlbum = (id: string): void => {
  photoAlbum.value = photoAlbums.value.find((album) => album.id === id) ?? null
  photoViewer.value = -1
}

export const photoCloseAlbum = (): void => {
  photoAlbum.value = null
  photoViewer.value = -1
}

export const photoOpenViewer = (index: number): void => {
  if (photoAlbum.value) photoViewer.value = index
}

export const photoCloseViewer = (): void => {
  photoViewer.value = -1
}

// 灯箱左右切换：首尾循环
export const photoViewerMove = (step: number): void => {
  const total = photoAlbum.value?.images.length ?? 0
  if (total === 0) return
  photoViewer.value = (photoViewer.value + step + total) % total
}
