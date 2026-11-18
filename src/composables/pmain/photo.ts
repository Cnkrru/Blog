import { ref } from 'vue'
import { PHOTO_LIST } from '../config/photo.config'
import type { PhotoAlbum, PhotoImage } from '../common/type'

export const photoAlbums = ref<PhotoAlbum[]>([])
export const photoAlbum = ref<PhotoAlbum | null>(null) // 当前相册，null 表示列表态
export const photoViewer = ref(-1) // 灯箱索引，-1 表示关闭

// setup 期同步取到相册全表；数据由 config 在编译期内联，运行时不再发请求
const photoBuild = (): void => {
  photoAlbums.value = PHOTO_LIST
}

// 取相册封面：显式 cover 优先，否则第一张图的 thumb，最后回退原图
export const photoAlbumCover = (album: PhotoAlbum): string => {
  const first = album.images[0]
  return album.cover ?? first?.thumb ?? first?.src ?? ''
}

// 取列表缩略图：thumb 优先，缺省用原图
export const photoImageThumb = (image: PhotoImage): string => image.thumb ?? image.src

// setup 期同步构建相册列表 → SSG 产物直接带图集内容
export const photoInit = (): void => {
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
