/*
 * 选项卡 / 代码组组件插件（tabs 与 code-group 合并实现，VitePress 标准组件）
 *
 * 语法：围栏代码块语言名 tabs 或 code-group，块内用 `@tab 标签名` 分节：
 *   ```tabs
 *   @tab 第一页
 *   页内容（整体转义，不渲染 md）
 *   @tab 第二页
 *   页内容
 *   ```
 *   ```code-group
 *   @tab npm
 *   npm install
 *   @tab pnpm
 *   pnpm install
 *   ```
 * code-group 每个面板内容按『标签名』推断语言走 shiki 编译期高亮；
 * tabs 面板内容整体转义。两者切换交互共用纯 CSS radio 方案，零运行时 JS。
 * 分节与分组导航走 panel.ts 共享管道（与 compare 同构）。
 *
 * 结构约定：HTML 片段一律抽成模块级 const 模板，render 只留解析与编排的 TS 逻辑。
 */
import type { ComponentPlugin } from './base.ts'
import { panelTabs, splitPanels } from './panel.ts'

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

/* ====================<插件实现>==================== */

export const codeGroupBlock: ComponentPlugin = {
  name: 'code-group',
  fenceLangs: ['code-group', 'tabs'],

  render(ctx, content, info) {
    const esc = ctx.escapeHtml
    // tabs 语言：面板内容整体转义；code-group：按标签名走 shiki 高亮
    const isPlain = (info ?? '').trim().toLowerCase().startsWith('tabs')
    const panels = splitPanels(content, 'code-group')
    if (panels.length === 0) return ''
    const { group, labels } = panelTabs(ctx, 'cg', panels)

    const items = panels
      .map((p, i) => {
        if (isPlain) {
          return `${labels[i] ?? ''}${CODE_GROUP_PANEL(group, i, 'text', esc(p.body))}`
        }
        const label = p.name.toLowerCase()
        // 类名直接拼进 HTML 属性，先消毒再落盘；送 shiki 的仍是原标签名，着色行为不变
        const attrLang = label.replace(/[^\w-]/g, '') || 'text'
        const codeHtml = ctx.highlight ? ctx.highlight(p.body, label) : CODE_GROUP_PLAIN(esc, p.body)
        return `${labels[i] ?? ''}${CODE_GROUP_PANEL(group, i, attrLang, codeHtml)}`
      })
      .join('')

    return CODE_GROUP_WRAP(items)
  },
}
