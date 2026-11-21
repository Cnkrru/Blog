import { postData } from '../../config/post.config'
/* ====================<postStatus>==================== */
export const postStatus = (postKey: string) => {
  const meta = postData.find((item) => item.key === postKey)
  if (!meta) return

  const word = document.querySelector('#word')!
  const time = document.querySelector('#time')!
  word.textContent = String(meta.wordCount)
  time.textContent = String(meta.readingTime)
}
