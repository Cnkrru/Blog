// 轻量 Vue(SFC) 语法：Prism 官方无 Vue 语言。
// markup(markup) 本身会把 <script> 内容按 JavaScript、<style> 内容按 CSS 解析，
// 前提是这两者语言组件已注册——这里显式引入；模板(v-if/@click/:xx)由 markup 上色属性。
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'

if (!Prism.languages.vue) {
  Prism.languages.vue = Prism.languages.extend('markup', {})
}