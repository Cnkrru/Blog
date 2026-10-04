import { ref } from 'vue'
import { postCleanCache, postClean, type CleanData } from './post'

export type CategoryGroup = {
  name: string
  items: CleanData[]
}

export const categoryViewMode = ref(0)
export const categoryModeGroups = ref<CategoryGroup[]>([])
export const categoryExpandGroup = ref('')
export const categories: CleanData[] = []

export const categoryClean = async (
  fn: (v: CleanData) => string,
  sortMode: boolean,
): Promise<CategoryGroup[]> => {
  await postClean()
  categories.splice(0, categories.length, ...postCleanCache) // 就地填充，保持管线引用

  const map = new Map<string, CleanData[]>()
  postCleanCache.forEach((post) => {
    // 遍历清洗后的数据
    const _ = fn(post) // 按照指定的fn算桶的key
    if (!map.has(_)) {
      map.set(_, []) // 如果指定fn的桶不存在，按照新fn创建桶
    }
    map.get(_)!.push(post)
  })

  const items = Array.from(map.keys()).sort() // 把类别排序
  if (sortMode) {
    items.reverse()
  }

  return items.map((k) => ({ name: k, items: map.get(k)! }))
}

export const turnView = async (mode: 0 | 1 | 2) => {
  categoryViewMode.value = mode
  if (mode === 0) {
    categoryModeGroups.value = await categoryClean((a) => a.category, false)
  } else if (mode === 1) {
    categoryModeGroups.value = await categoryClean((a) => a.date.slice(0, 4), true)
  } else if (mode === 2) {
    categoryModeGroups.value = await categoryClean((a) => a.date.slice(0, 7), true)
  }
}

export const turnGroup = (group: string) => {
  if (categoryExpandGroup.value === group) {
    categoryExpandGroup.value = '' // 如果已经展开，则收起来
  } else {
    categoryExpandGroup.value = group // 没展开，把这一组的打开
  }
}
