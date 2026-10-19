import { ref } from 'vue'
import { postCleanCache, postClean, postCleanSync, type CleanData } from './post'

export const tagItem = ref('')
export const tagSet = ref(new Set<string>())
export const tagList = ref<CleanData[]>([])
export const tags: CleanData[] = []

// 打标核心（同步）：数据已在内存即可算（SSG 期 .cache 副本已在）
const tagBuild = () => {
  tags.splice(0, tags.length, ...postCleanCache)

  postCleanCache.forEach((post) => {
    post.tags.forEach((tag) => tagSet.value.add(tag))
  })
}

// AI修复：setup 期同步可用 → SSG 产物带真内容；未就绪返回 false 交异步兜底
export const tagCleanSync = (): boolean => {
  if (!postCleanSync()) return false
  tagBuild()
  return true
}

export const tagClean = async () => {
  if (tagCleanSync()) return
  await postClean()
  tagBuild()
}

export const tagToggle = (tag: string, posts: CleanData[]) => {
  if (tagItem.value === tag) {
    tagItem.value = ''
    tagList.value = []
  } else {
    tagItem.value = tag
    tagList.value = posts
      .filter((a) => a.tags.includes(tag))
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
  }
}
