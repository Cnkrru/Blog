import { computed, ref } from 'vue'
import { postData } from '../config/post.config'
import type { CleanData } from '../common/type'
import { windowPages } from '../common/utils'

const POST_NUM = 6 // 每页文章条数

export const listPageNum = ref(0)
export const listNowPage = ref(1)
export const listItems = ref<CleanData[]>([])
export const list: CleanData[] = []

// 分页窗口：当前页±2、最多 5 个页码（不足 5 项时向末尾补齐，无省略号）
export const listDisplayPages = computed(() => windowPages(listNowPage.value, listPageNum.value))

// 填充列表与总页数（编译期数据已就绪，直接取用）
const listFill = () => {
  list.splice(0, list.length, ...postData) // 就地填充，保持管线引用
  listPageNum.value = Math.max(1, Math.ceil(list.length / POST_NUM))
}

// setup 期填充，让 SSG 产物直接带文章内容
export const listInit = () => {
  listFill()
}

// 从 URL 读页码：?page= 缺失或越界一律回退 1（首页即默认页）
export const listInitPage = () => {
  // SSG 期无 location，构建产物固定渲染第 1 页
  if (typeof window === 'undefined') return 1
  const p = Number(new URLSearchParams(window.location.search).get('page'))
  if (p >= 1 && p <= listPageNum.value) return p
  return 1
}

// 切页（URL 同步内联）：切片写入当前页文章，边界内设置当前页；
// 页码写回 URL 供刷新/分享直达，第 1 页不挂 ?page=
export const listChangePage = (n: number) => {
  listItems.value = list.slice(POST_NUM * (n - 1), POST_NUM * n)
  if (n >= 1 && n <= listPageNum.value) {
    listNowPage.value = n
    // SSG 期无 location/history，URL 同步仅客户端执行
    if (typeof window === 'undefined') return
    // URL 同步：replaceState 只改地址不触发刷新
    const url = new URL(window.location.href)
    if (n === 1) {
      url.searchParams.delete('page')
    } else {
      url.searchParams.set('page', String(n))
    }
    history.replaceState(null, '', url)
  }
}
