import { ref } from 'vue'
import { postCleanCache, postClean, type CleanData } from './post'

export const tagItem = ref('')
export const tagSet = ref(new Set<string>())
export const tagList = ref<CleanData[]>([])
export const tags: CleanData[] = []

export const tagClean = async () => {
  await postClean()
  tags.splice(0, tags.length, ...postCleanCache)

  postCleanCache.forEach((post) => {
    post.tags.forEach((tag) => tagSet.value.add(tag))
  })
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
