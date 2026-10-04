import { computed, ref } from 'vue'
import axios from 'axios'

type LinkData = {
  id: string
  name: string
  category: string
  description: string
  url: string
}
type LinkGroup = {
  name: string
  links: LinkData[]
}

export let linkCache: LinkData[] = []
let links: LinkGroup[] = []
export const linkCategories = ref<string[]>([])
export const linkCategory = ref(1)
export const linkItems = ref<LinkGroup>({ name: '', links: [] })
export const linkCategoryNum = ref(0)
export const linkDropdown = ref(false)

// 分类分页窗口：当前分类±2、最多 5 个页码（不足 5 项时向末尾补齐，无省略号）
export const linkDisplayPages = computed(() => {
  const pages: number[] = []
  let start = Math.max(1, linkCategory.value - 2)
  const end = Math.min(linkCategoryNum.value, start + 4)
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }
  for (let p = start; p <= end; p++) pages.push(p)
  return pages
})

export const linkClean = async () => {
  if (links.length > 0) return
  if (linkCache.length === 0) {
    linkCache = (await axios.get<LinkData[]>('/config/links.json')).data
  }

  const linkMap = new Map<string, LinkData[]>()
  linkCache.forEach((link) => {
    // 遍历原始数据，如果没有category桶，创建一个
    if (!linkMap.has(link.category)) {
      linkMap.set(link.category, [])
    }
    linkMap.get(link.category)!.push(link)
  })

  // 转换数据容器格式
  links = Array.from(linkMap, ([name, links]) => ({ name, links }))
  linkItems.value = links[linkCategory.value - 1]!
  linkCategories.value = links.map((category) => category.name)
  linkCategoryNum.value = linkCategories.value.length
}

// 切页：边界内切换当前分类并填充对应链接，关闭分类下拉
export const linkChangePage = (page: number) => {
  if (page >= 1 && page <= linkCategoryNum.value) {
    linkCategory.value = page
    linkItems.value = links[linkCategory.value - 1]!
  }
  setDropdown(false)
}

export const setDropdown = (mode: boolean) => {
  linkDropdown.value = mode
}

/*
1. 原始数据
linkCache = [
  { id: '1', name: 'GitHub', category: '个人', description: 'GitHub个人页面', url: 'https://github.com/Cnkrru' },
  { id: '2', name: 'Bilibili', category: '个人', description: 'Bilibili个人页面', url: '...' },
  { id: '3', name: '随机生成图片', category: '前端', description: '随机生成图片网站', url: '...' },
  { id: '4', name: '图片转代码', category: '前端', description: '图片转代码网站', url: '...' },
]

2. linkMap分桶
linkMap = Map {
  '个人' → [GitHub, Bilibili],
  '前端' → [随机生成图片, 图片转代码],
}

3. map桶转数组
links = [
  { name: '个人', links: [GitHub, Bilibili] },
  { name: '前端', links: [随机生成图片, 图片转代码] },
]

4. 填充数据
linkItems.value      = links[0]!        → { name: '个人', links: [GitHub, Bilibili] }
linkCategories.value = links.map(c.name) → ['个人', '前端']
linkCategoryNum.value = 2
*/
