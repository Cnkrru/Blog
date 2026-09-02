// 用在backtotop和contentmenu组件
import { defineStore } from 'pinia'

// scorll_store
export const useScrollStore = defineStore('scroll', () => {
  /*
  * id: 返回顶部
  * fn: 让中心内容卡片返回顶部
  */
  const scroll_to_top = () => {
      const scroll_area = document.querySelector('.center-card-content')
      if (scroll_area) {
        scroll_area.scrollTo({ top: 0, 'behavior': 'smooth' })
      }
    }

  return {
    // 函数
    scroll_to_top
  }
}
)