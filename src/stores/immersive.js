// 用在ImmersiveReading、BackToTop
import { defineStore } from 'pinia'
import { ref } from 'vue'

// immersive_store
export const useImmersiveStore = defineStore('immersive', () => {
  const is_immersive = ref(false)            // 是否处于沉浸阅读模式

  /*
  * id: 切换阅读模式 
  * fn: 0/1开关，反转增添选择器，也可以用vue的:class，这里不想用
  */
  const toggle = () => {
    if (is_immersive.value === false) {
      is_immersive.value = true
      document.body.classList.add('immersive-reading')
    }
    else {
      is_immersive.value = false
      document.body.classList.remove('immersive-reading')
    }
  }

  return {
    // 变量
    is_immersive,
    // 函数
    toggle
  }
})