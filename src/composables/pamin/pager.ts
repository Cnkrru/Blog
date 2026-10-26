/**
 * 分页窗口：当前页±2、最多 5 个页码（不足 5 项时向末尾补齐，无省略号）
 * postlist 与 link 两处同算法重复，收敛为单一实现
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
