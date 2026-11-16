/*
 * 代码组组件插件（VitePress 的 ::: code-group 语法）
 *
 * 生态里没有独立的 code-group 插件（VitePress 自带实现，tab 只负责 @tab 分节），
 * 因此保留自研：code-group 内直接写带标签的围栏代码块：
 *   ::: code-group
 *   ```js [config.js]
 *   export default {}
 *   ```
 *   ```ts [main.ts]
 *   const a = 1
 *   ```
 *   :::
 * 每个面板按围栏语言走 shiki 编译期高亮，标签省略时用语言名；
 * 切换交互沿用纯 CSS radio 方案，零运行时 JS。
 * 分节与分组导航走 panel.ts 共享管道。
 *
 * 结构约定：HTML 片段一律抽成模块级 const 模板，render 只留解析与编排的 TS 逻辑。
 */
import type { ComponentPlugin } from './base.ts'
import { panelTabs } from './panel.ts'

/* ====================<HTML 模板>==================== */

// 代码面板：shiki 产物（或降级代码块）塞进 body
const CODE_GROUP_PANEL = (group: string, index: number, lang: string, body: string): string => `
    <div class="tabs-panel code-group-panel" data-panel="${group}-${index}">
        <div class="language-${lang}" v-pre>${body}</div>
    </div>`

// 无 shiki 能力时的降级代码块
const CODE_GROUP_PLAIN = (esc: (s: string) => string, code: string): string =>
  `<pre class="shiki"><code>${esc(code)}</code></pre>`

const CODE_GROUP_WRAP = (items: string): string => `
<div class="tabs code-group" v-pre>${items}
</div>`

/* ====================<围栏代码块解析>==================== */

// 围栏信息串：语言名 + 可选 [标签]，如 `js [config.js]`
const FENCE_INFO = /^([^[\s]*)\s*(?:\[(.*)\])?\s*$/

// code-group 容器内的一组围栏代码块
type CodeBlock = { lang: string; label: string; code: string }

/*
 * 从容器正文里切出围栏代码块。
 * 容器正文是按原文捕获的，这里自行按 ``` 开闭配对；标签写在信息串的方括号里，
 * 省略标签时用语言名兜底，保证每个面板都有可点击的标题。
 */
const parseCodeBlocks = (content: string): CodeBlock[] => {
  const blocks: CodeBlock[] = []
  const fence = /^```([^\n`]*)\n([\s\S]*?)\n?^```[ \t]*$/gm
  for (const match of content.matchAll(fence)) {
    const parsed = FENCE_INFO.exec((match[1] ?? '').trim())
    const lang = (parsed?.[1] || 'text').toLowerCase()
    const label = (parsed?.[2] ?? '').trim() || lang
    blocks.push({ lang, label, code: match[2] ?? '' })
  }
  return blocks
}

/* ====================<插件实现>==================== */

export const codeGroupBlock: ComponentPlugin = {
  name: 'code-group',
  containers: ['code-group'],

  render(ctx, content) {
    const esc = ctx.escapeHtml

    // 每个围栏代码块一个面板，按语言走 shiki 高亮
    const blocks = parseCodeBlocks(content)
    if (blocks.length === 0) {
      console.warn('[WARN]:code-group 容器内未找到围栏代码块，已按空块跳过')
      return ''
    }
    const { group, labels } = panelTabs(
      ctx,
      'cg',
      blocks.map((b) => ({ name: b.label, body: b.code })),
    )
    const items = blocks
      .map((b, i) => {
        // 类名直接拼进 HTML 属性，先消毒再落盘；送 shiki 的仍是原语言名，着色行为不变
        const attrLang = b.lang.replace(/[^\w-]/g, '') || 'text'
        const codeHtml = ctx.highlight ? ctx.highlight(b.code, b.lang) : CODE_GROUP_PLAIN(esc, b.code)
        return `${labels[i] ?? ''}${CODE_GROUP_PANEL(group, i, attrLang, codeHtml)}`
      })
      .join('')

    return CODE_GROUP_WRAP(items)
  },
}
