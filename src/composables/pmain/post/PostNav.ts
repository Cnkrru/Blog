import { ref } from 'vue'
import { postData } from '../../config/post.config'
/* ====================<postNav>==================== */
export const preOrder = ref('')
export const nextOrder = ref('')
export const preTitle = ref('')
export const nextTitle = ref('')
export const postNav = (postKey: string) => {
  // 编译期已按 order 升序写入，数组下标即阅读顺序
  const index = postData.findIndex((item) => item.key === postKey)
  if (index === -1) return

  const pre = postData[index - 1]
  const next = postData[index + 1]

  // 首尾无相邻文章时为空
  preOrder.value = pre?.key ?? ''
  nextOrder.value = next?.key ?? ''
  preTitle.value = pre?.title ?? '暂无'
  nextTitle.value = next?.title ?? '暂无'
}
