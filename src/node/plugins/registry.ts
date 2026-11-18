/*
 * 组件注册表：编译期组件的统一登记处。
 *
 * 分两层：
 *  1. 官方插件层（优先）：提示块 / 折叠块 / 选项卡直接用 markdown-it 生态插件，
 *     写法就是 VitePress / Docusaurus / @mdit 系列的通用语法，这里只提供外壳与配色。
 *  2. 自研层（官方没有对应插件）：目录树、步骤、时间线、流程图、问答、对比栏、引用卡、代码组。
 *     它们没有生态插件，语法统一为 ::: 容器，由 base.ts 的原文捕获规则解析。
 * 标准围栏组件（console 等）不占容器名，直接按语言拦截。
 *
 * 新增组件的标准流程：
 *  - 生态里有插件 → 优先用插件，这里不要再造轮子
 *  - 没有插件 → 在 plugins/ 下新建文件实现 ComponentPlugin，并在 selfPlugins 追加一行
 */
import type MarkdownIt from 'markdown-it'
import { container } from '@mdit/plugin-container'
import { tab } from '@mdit/plugin-tab'
import type { ComponentPlugin, PluginContext } from './base.ts'
import { makeContainerRule } from './base.ts'
import { getPageKey } from '../tools.ts'

// 基础
import { timelineBlock } from './timeline.ts'
import { stepsBlock } from './steps.ts'
// 结构
import { filetreeBlock } from './filetree.ts'
import { terminalBlock } from './terminal.ts'
import { flowBlock } from './flow.ts'
// 代码
import { codeGroupBlock } from './code-group.ts'
// 笔记
import { qaBlock } from './qa.ts'
import { compareBlock } from './compare.ts'
import { quoteBlock } from './quote.ts'

/* ====================<官方插件：提示块>==================== */

// 容器名 → 内部等级：对外用主流的 warning / danger，配色沿用 warn / error
const ADMONITION_LEVEL: Record<string, string> = Object.freeze({
  tip: 'tip',
  info: 'info',
  warning: 'warn',
  danger: 'error',
})

// 等级 → 图标键 + 默认文案
const ADMONITION_META: Record<string, { icon: string; label: string }> = Object.freeze({
  tip: { icon: 'bulb', label: 'Tip' },
  info: { icon: 'info', label: 'Info' },
  warn: { icon: 'alert', label: 'Warning' },
  error: { icon: 'close', label: 'Error' },
})

// 内联 SVG path（Lucide 图标集，stroke 风格，随 currentColor 变色）
const ADMONITION_ICON: Record<string, string> = Object.freeze({
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  alert:
    '<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>',
  close: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
})

// 外壳开标签：图标 + 标题 + body 开标签
const ADMONITION_OPEN = (type: string, icon: string, title: string): string => `
<!-- == admonition ${type} == -->
<div class="admonition admonition-${type}">
    <div class="admonition-head">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon}</svg>
        <span class="admonition-title">${title}</span>
    </div>
    <div class="admonition-body">`

// 外壳收尾：关闭 body 与外壳两层
const ADMONITION_CLOSE = '</div></div>'

/* ====================<官方插件：选项卡>==================== */

// 每页一个自增序号，拼出互不冲突的 radio name / id
const tabSeq = new Map<string, number>()
const TABS_GROUP = Symbol('tabsGroup')

/* ====================<自研容器组件>==================== */

// 自研组件插件：新增组件在这里登记（官方插件不在此列）
const selfPlugins: readonly ComponentPlugin[] = [
  timelineBlock,
  stepsBlock,
  filetreeBlock,
  terminalBlock,
  flowBlock,
  codeGroupBlock,
  qaBlock,
  compareBlock,
  quoteBlock,
]

// 围栏组件语言名集合（小写）：语言扫描与 fence 拦截共用，新增组件语言自动生效
export const componentFenceLangs: ReadonlySet<string> = new Set(
  selfPlugins.flatMap((p) => p.fenceLangs ?? []),
)

/*
 * 挂载全部组件能力：
 *  - 官方插件：提示块（四级容器）、折叠块、选项卡
 *  - 自研插件：::: 容器块规则 + 每个容器名一条渲染规则 + setup 钩子
 */
export const setupComponentPlugins = (
  md: InstanceType<typeof MarkdownIt>,
  makeCtx: () => PluginContext,
) => {
  // ---- 官方插件：提示块（一个等级一个容器，validate 按名称匹配）----
  for (const [name, type] of Object.entries(ADMONITION_LEVEL)) {
    container(md, {
      name,
      openRenderer: (tokens, idx) => {
        const meta = ADMONITION_META[type]!
        // info 形如『warning 可选标题』：去掉容器名后即标题
        const title = (tokens[idx]?.info ?? '').trim().slice(name.length).trim()
        return ADMONITION_OPEN(type, ADMONITION_ICON[meta.icon]!, md.utils.escapeHtml(title || meta.label))
      },
      closeRenderer: () => ADMONITION_CLOSE,
    })
  }

  // ---- 官方插件：折叠块（摘要取容器名之后的参数）----
  container(md, {
    name: 'details',
    openRenderer: (tokens, idx) => {
      const summary = (tokens[idx]?.info ?? '').trim().slice('details'.length).trim()
      return `<details class="details" v-pre>
    <summary>${md.utils.escapeHtml(summary || '详情')}</summary>
    <div class="details-body">`
    },
    closeRenderer: () => '</div></details>',
  })

  // ---- 官方插件：选项卡（解析交给插件，产物保持纯 CSS radio 结构）----
  tab(md, {
    name: 'tabs',
    openRenderer: (_info, _tokens, _idx, _options, env) => {
      const key = getPageKey()
      const next = (tabSeq.get(key) ?? 0) + 1
      tabSeq.set(key, next)
      ;(env as Record<PropertyKey, unknown>)[TABS_GROUP] = next
      return '<div class="tabs">'
    },
    tabOpenRenderer: (data, _tokens, _idx, _options, env) => {
      const group = ((env as Record<PropertyKey, unknown>)[TABS_GROUP] as number | undefined) ?? 1
      const checked = data.isActive || data.index === 0 ? ' checked' : ''
      return `<label class="tabs-tab"><input type="radio" id="tab-${group}-${data.index}" name="tab-${group}"${checked}>${md.utils.escapeHtml(data.title)}</label><div class="tabs-panel">`
    },
    tabCloseRenderer: () => '</div>',
    closeRenderer: () => '</div>',
  })

  // ---- 自研插件：::: 容器 ----
  const containers = new Map<string, ComponentPlugin>()
  for (const plugin of selfPlugins) {
    for (const name of plugin.containers ?? []) containers.set(name, plugin)
  }

  if (containers.size > 0) {
    md.block.ruler.before('fence', 'component_container', makeContainerRule(containers), {
      alt: ['paragraph', 'reference', 'blockquote', 'list'],
    })
    for (const [name, plugin] of containers) {
      md.renderer.rules[`component_${name}`] = (tokens, idx) => {
        const token = tokens[idx]!
        return plugin.render?.(makeCtx(), token.content, token.info, name) ?? ''
      }
    }
  }

  for (const plugin of selfPlugins) {
    plugin.setup?.(md)
  }
}

/*
 * 统一 fence 拦截：按语言名找到声明了该语言的插件，交给它的 render 直出 HTML。
 * info 为完整信息串，透传给需要『语言名之后参数』的组件。
 * 未命中任何插件时返回 null，由调用方走默认 shiki 高亮。
 */
export const renderComponentFence = (
  ctx: PluginContext,
  lang: string,
  content: string,
  info: string,
): string | null => {
  for (const plugin of selfPlugins) {
    if (plugin.render && plugin.fenceLangs?.includes(lang)) {
      return plugin.render(ctx, content, info)
    }
  }
  return null
}
