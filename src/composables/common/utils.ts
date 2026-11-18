/*
 * fn:分页窗口
 * des:取当前页前后各 2 页、最多 5 个页码，总数不足时向末尾补齐
 * type:public
 * param:current 当前页，total 总页数
 * return：页码数组
 */
export const windowPages = (current: number, total: number): number[] => {
  const pages: number[] = []
  let start = Math.max(1, current - 2)
  const end = Math.min(total, start + 4)
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }
  for (let p = start; p <= end; p++) pages.push(p)
  return pages
}
