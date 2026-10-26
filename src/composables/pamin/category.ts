import { ref } from 'vue'
import { postCleanCache, postClean, postCleanSync, type CleanData } from './post'

export type CategoryGroup = {
  name: string
  items: CleanData[]
}

export const categoryViewMode = ref(0)
export const categoryModeGroups = ref<CategoryGroup[]>([])
export const categoryExpandGroup = ref('')
export const categories: CleanData[] = []

// 分桶核心（同步）：数据已在内存即可算（SSG 期 .cache 副本已在）
const categoryBuild = (fn: (v: CleanData) => string, sortMode: boolean): CategoryGroup[] => {
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

// setup 期同步可用 → SSG 产物带真内容；未就绪返回 null 交异步兜底
export const categoryCleanSync = (
  fn: (v: CleanData) => string,
  sortMode: boolean,
): CategoryGroup[] | null => {
  if (!postCleanSync()) return null
  return categoryBuild(fn, sortMode)
}

export const categoryClean = async (
  fn: (v: CleanData) => string,
  sortMode: boolean,
): Promise<CategoryGroup[]> => {
  const groups = categoryCleanSync(fn, sortMode)
  if (groups) return groups
  await postClean()
  return categoryBuild(fn, sortMode)
}

// 视图模式对应的分桶规则：0 按分类升序；1 按年、2 按月，均为新到旧
const viewRule = (mode: 0 | 1 | 2): { key: (v: CleanData) => string; sortMode: boolean } => {
  if (mode === 0) return { key: (v) => v.category, sortMode: false }
  if (mode === 1) return { key: (v) => v.date.slice(0, 4), sortMode: true }
  return { key: (v) => v.date.slice(0, 7), sortMode: true }
}

// setup 期同步切换视图；未就绪返回 false 交异步兜底
export const turnViewSync = (mode: 0 | 1 | 2): boolean => {
  const { key, sortMode } = viewRule(mode)
  const groups = categoryCleanSync(key, sortMode)
  if (!groups) return false
  categoryViewMode.value = mode
  categoryModeGroups.value = groups
  return true
}

export const turnView = async (mode: 0 | 1 | 2) => {
  if (turnViewSync(mode)) return
  const { key, sortMode } = viewRule(mode)
  categoryViewMode.value = mode
  categoryModeGroups.value = await categoryClean(key, sortMode)
}

export const turnGroup = (group: string) => {
  if (categoryExpandGroup.value === group) {
    categoryExpandGroup.value = '' // 如果已经展开，则收起来
  } else {
    categoryExpandGroup.value = group // 没展开，把这一组的打开
  }
}
