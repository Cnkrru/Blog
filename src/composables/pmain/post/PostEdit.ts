import { reactive, ref } from 'vue'
import { postData } from '../../config/post.config'
import type { CleanData, HistoryItem } from '../../common/type'
/* ====================<postEdit>==================== */
export const publish = ref('')
export const update = ref('')
export const history = reactive<HistoryItem[]>([])

const historyClean = (meta: CleanData) => {
  const list: HistoryItem[] = []
  // 去掉 historyRaw 中转变量，直接遍历 meta.history
  meta.history?.forEach((item) => {
    const text = String(item).trim()
    if (!text) return
    const match = text.match(/^(\S+)\s+(.*)$/)
    if (match) {
      list.push({ date: match[1]!, text: match[2]! })
    } else {
      list.push({ date: '', text })
    }
  })
  history.splice(0, history.length, ...list)
}

export const postEdit = (postKey: string) => {
  const meta = postData.find((item) => item.key === postKey)
  if (!meta) return
  publish.value = meta.date
  update.value = meta.updated
  historyClean(meta)
}
