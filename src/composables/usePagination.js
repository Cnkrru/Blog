import { ref, computed } from 'vue'

/**
 * 通用分页 composable
 * @param {import('vue').Ref<any[]>} items - 要分页的数组
 * @param {number} pageSize - 每页条数
 */
export function usePagination(items, pageSize = 10) {
  const currentPage = ref(1)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(items.value.length / pageSize))
  )

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return items.value.slice(start, start + pageSize)
  })

  function changePage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  return { currentPage, totalPages, paginatedItems, changePage }
}
