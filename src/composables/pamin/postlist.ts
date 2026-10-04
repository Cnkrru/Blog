import { computed, ref } from 'vue'
import { postCleanCache, postClean, type CleanData } from './post'

const POST_NUM = 6 // 每页文章条数

export const listPageNum = ref(0)
export const listNowPage = ref(1)
export const listItems = ref<CleanData[]>([])
export const list: CleanData[] = []

// 分页窗口：当前页±2、最多 5 个页码（不足 5 项时向末尾补齐，无省略号）
export const listDisplayPages = computed(() => {
  const pages: number[] = []
  let start = Math.max(1, listNowPage.value - 2)
  const end = Math.min(listPageNum.value, start + 4)
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }
  for (let p = start; p <= end; p++) pages.push(p)
  return pages
})

export const ListClean = async () => {
  await postClean() // postClean 内部确保 postData 已拉取，填充 postCleanCache
  list.splice(0, list.length, ...postCleanCache) // 就地填充，保持管线引用
  listPageNum.value = Math.max(1, Math.ceil(list.length / POST_NUM))
}

// 从 URL 读页码：?page= 缺失或越界一律回退 1（首页即默认页）
export const listInitPage = () => {
  const p = Number(new URLSearchParams(location.search).get('page'))
  if (p >= 1 && p <= listPageNum.value) return p
  return 1
}

// 切页（URL 同步内联）：切片写入当前页文章，边界内设置当前页；
// 页码写回 URL 供刷新/分享直达，第 1 页不挂 ?page=
export const ListChangePage = (n: number) => {
  listItems.value = list.slice(POST_NUM * (n - 1), POST_NUM * n)
  if (n >= 1 && n <= listPageNum.value) {
    listNowPage.value = n
    // URL 同步：replaceState 只改地址不触发刷新
    const url = new URL(location.href)
    if (n === 1) {
      url.searchParams.delete('page')
    } else {
      url.searchParams.set('page', String(n))
    }
    history.replaceState(null, '', url)
  }
}
