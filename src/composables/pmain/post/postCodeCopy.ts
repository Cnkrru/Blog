import { ref } from 'vue'
/* ====================<code>==================== */
// 正文根元素：Content.vue 的 .content 容器经模板 ref 绑定，供代码复制委托复用
export const root = ref<HTMLElement>()

/*
 * id:复制代码
 * fn:命中复制按钮后读取对应代码块源码写入剪贴板，并给出两秒 copied 反馈
 */
const onCodeCopy = (e: MouseEvent) => {
  const el = (e.target as HTMLElement).closest<HTMLButtonElement>('button.copy')
  if (!el || !root.value?.contains(el)) return
  const wrapper = el.closest('div[class*="language-"]')
  // textContent 不含行号伪元素，复制的是纯净源码
  const text = wrapper?.querySelector('pre code')?.textContent || ''
  navigator.clipboard.writeText(text).then(() => {
    el.classList.add('copied')
    setTimeout(() => {
      el.classList.remove('copied')
      el.blur()
    }, 2000)
  })
}

/*
 * id:绑定正文点击
 * fn:首次调用时在 document 上绑定复制事件，正文换页后无需重新绑定
 */
let codeReady = false
export const codeBind = () => {
  if (codeReady) return
  codeReady = true
  document.addEventListener('click', onCodeCopy)
}
