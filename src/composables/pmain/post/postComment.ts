import { computed, ref } from 'vue'
import { refLd } from '../../pheader'
/* ====================<comment>==================== */
// 首帧即算出完整主题 URL：giscus-widget 创建时 theme 属性就是对的，
// 若先用空值再回填，iframe 会先按默认主题构建，后续变更来不及生效。
// window 只在客户端访问，组件侧用 ClientOnly 包住，SSR 阶段不会求值
export const comment = computed(
  () => `${window.location.origin}/css/${localStorage.getItem('theme')}-${refLd.value}.css`,
)

/* ====================<comment loading>==================== */
// 评论加载态：脚本导入结束即收起骨架；导入失败单独标记，避免骨架一直转
export const refCommentLoading = ref(true)
export const refCommentFailed = ref(false)
