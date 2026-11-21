import { ref } from 'vue'
import { postData } from '../config/post.config'
import type { CleanData } from '../common/type'

export const tagItem = ref('')
export const tagSet = ref(new Set<string>())
export const tagList = ref<CleanData[]>([])
export const tags: CleanData[] = []

// 打标核心：编译期数据已就绪，直接取用
const tagBuild = () => {
  tags.splice(0, tags.length, ...postData)

  postData.forEach((post) => {
    post.tags.forEach((tag) => tagSet.value.add(tag))
  })
}

// setup 期填充，SSG 产物直接带标签云
export const tagInit = () => {
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
