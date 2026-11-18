import { computed, ref } from 'vue'
import { windowPages } from '../common/utils'
import { LINK_LIST } from '../config/link.config'
import type { LinkData, LinkGroup } from '../common/type'

// 链接数据由 config 在编译期内联，运行时不再发请求
const linkCache: LinkData[] = LINK_LIST
let links: LinkGroup[] = []
export const linkCategories = ref<string[]>([])
export const linkCategory = ref(1)
export const linkItems = ref<LinkGroup>({ name: '', links: [] })
export const linkCategoryNum = ref(0)
export const linkDropdown = ref(false)

// 分类分页窗口：当前分类±2、最多 5 个页码（不足 5 项时向末尾补齐，无省略号）
export const linkDisplayPages = computed(() =>
  windowPages(linkCategory.value, linkCategoryNum.value),
)

// 分桶核心（同步）：数据已在内存即可算（SSG 期 dist/.cache 副本已在）
const linkGroupBuild = () => {
  const linkMap = new Map<string, LinkData[]>()
  linkCache.forEach((link) => {
    // 遍历原始数据，如果没有category桶，创建一个
    if (!linkMap.has(link.category)) {
      linkMap.set(link.category, [])
    }
    linkMap.get(link.category)!.push(link)
  })

  // 转换数据容器格式
  links = Array.from(linkMap, ([name, itemLinks]) => ({ name, links: itemLinks }))
  linkItems.value = links[linkCategory.value - 1]!
  linkCategories.value = links.map((category) => category.name)
  linkCategoryNum.value = linkCategories.value.length
}

// setup 期同步构建分组 → SSG 产物直接带链接内容
export const linkInit = () => {
  linkGroupBuild()
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
