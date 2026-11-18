/*
 * 组件插件共享基础模块
 *
 * 职责：定义『编译期组件插件』的统一契约与公共工具，所有写作组件插件都基于它实现。
 *
 * 语法分层（对齐 VitePress / Docusaurus / markdown-it-container 的生态约定）：
 *  - 围栏代码块：语言名本身就是标准语言（console 等），直接复用围栏语法
 *  - ::: 容器：官方有插件的（提示块 / 折叠块 / 选项卡）走 @mdit/plugin-*；
 *    官方没有插件的（步骤、时间线、目录树、问答、对比、引用卡、代码组）走本模块的原文捕获规则
 *  - 行内语法：`==标记==` 交给 @mdit/plugin-mark，其余场景直接写原生 HTML（<kbd> / <span class="badge">）
 *
 * 主题层（content.css）按 class 约定配色与排版，组件样式可主题化。
 * 新增一个组件 = 先看生态有没有插件；没有才在 plugins/ 下加文件实现 ComponentPlugin，并在 registry.ts 登记一行。
 */

// StateBlock 从 markdown-it 主入口取：markdown-it 15 自带类型并导出，
// 深层路径 markdown-it/lib/... 会落到 @types/markdown-it 的旧声明，两套结构不一致，类型检查报错
import type MarkdownIt from 'markdown-it'
import type { StateBlock } from 'markdown-it'

/*
 * 行内字段切分：组件块内每行是一个条目，字段用半角竖线 | 分隔。
 * 字段内若需竖线本身，转义为 \|，这里统一还原；首尾空白收敛。
 * 与各组件插件共用，避免每个插件各自实现一份。
 */
export const splitRow = (line: string): string[] =>
  line.split(/(?<!\\)\|/).map((s) => s.trim().replace(/\\\|/g, '|'))

/*
 * 代码块顶栏：语言徽章（圆点+文本）。
 * 普通高亮代码块与围栏组件共用同一顶栏结构，保证视觉一致。
 */
export const toolbar = (lang: string): string => `
    <div class="code-toolbar">
        <span class="lang lang-${lang}">
            <span class="lang-dot"></span>
            <span class="lang-text">${lang}</span>
        </span>
    </div>`

/*
 * 组件插件上下文：编译期提供给每个插件的最小能力集。
 *  - escapeHtml：正文/字段统一走 markdown-it 的转义，防注入
 *  - toolbar / splitRow：上述公共片段与切分
 * 约定：插件只依赖本上下文，不反向依赖编译主流程，保证插件可独立维护、可单测。
 */
export interface PluginContext {
  escapeHtml: (s: string) => string
  toolbar: typeof toolbar
  splitRow: typeof splitRow
  /* 当前页标识（文章 id，首页为 'home'）：需要『同页唯一』的组件靠它识别换页 */
  pageKey: string
  /** shiki 编译期高亮单段代码（code-group 等内嵌代码的组件用）；未提供时组件自行降级 */
  highlight?: (code: string, lang: string) => string
}

/*
 * 编译期组件插件契约。
 *  - name：插件名（调试用）
 *  - fenceLangs：标准围栏代码块的语言名集合（小写），如 console
 *  - containers：::: 容器的名称集合（小写），如 steps / code-group
 *  - render：content 是块内正文（已按容器层级去掉公共缩进）；info 是名称之后的可选参数；
 *    container 是命中的容器名，用于区分同一插件的多个名称
 *  - setup：需要挂 markdown-it 行内规则的组件在此挂载
 */
export interface ComponentPlugin {
  name: string
  fenceLangs?: readonly string[]
  containers?: readonly string[]
  render?: (
    ctx: PluginContext,
    content: string,
    info?: string,
    container?: string,
  ) => string | null
  setup?: (md: InstanceType<typeof MarkdownIt>) => void
}

/* ====================<::: 容器块规则>==================== */

// 容器开标记：三个及以上冒号 + 名称 + 可选参数（提示块标题、折叠块摘要）
const CONTAINER_OPEN = /^(:{3,})[ \t]*([A-Za-z][\w-]*)(?:[ \t]+(.*))?$/
// 容器收标记：三个及以上冒号独占一行；长度不得短于开标记，便于嵌套时用更多冒号区分
const CONTAINER_CLOSE = /^(:{3,})[ \t]*$/
// 围栏块开闭标记：容器正文里的围栏代码块内部若出现 ::: 不应被当作容器收尾
const FENCE_OPEN = /^(`{3,}|~{3,})/

/*
 * 容器块规则：捕获 `::: 名称 参数` 到对应收标记之间的原文，压入一个自定义 token，
 * 由 renderer 在渲染阶段交给插件直出 HTML。
 *
 * 之所以不用 @mdit/plugin-container：那个插件会把块内正文继续按 markdown 分词，
 * 而 steps / timeline / filetree / qa / compare 这类组件的正文是自定义行语法（不是 markdown），
 * 需要拿到原文自行解析；这里统一走『原文捕获 + 渲染期交给插件』一条管道。
 */
export const makeContainerRule = (plugins: Map<string, ComponentPlugin>) => {
  return (state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean => {
    const start = state.bMarks[startLine]! + state.tShift[startLine]!
    const open = CONTAINER_OPEN.exec(state.src.slice(start, state.eMarks[startLine]!))
    if (!open) return false

    const markup = open[1]!
    const name = open[2]!.toLowerCase()
    if (!plugins.has(name)) return false
    if (silent) return true

    // 找收标记；跳过正文中的围栏代码块，避免代码里的 ::: 提前收尾
    let nextLine = startLine + 1
    let closed = false
    let fenceChar = ''
    for (; nextLine < endLine; nextLine++) {
      const raw = state.src
        .slice(state.bMarks[nextLine]! + state.tShift[nextLine]!, state.eMarks[nextLine]!)
        .trim()
      if (fenceChar) {
        if (raw.startsWith(fenceChar.repeat(3))) fenceChar = ''
        continue
      }
      const fence = FENCE_OPEN.exec(raw)
      if (fence) {
        fenceChar = fence[1]![0]!
        continue
      }
      const close = CONTAINER_CLOSE.exec(raw)
      if (close && close[1]!.length >= markup.length) {
        closed = true
        break
      }
    }

    // 正文保留相对缩进（目录树靠缩进判层级），只去掉容器自身的公共缩进
    const body: string[] = []
    for (let i = startLine + 1; i < nextLine; i++) {
      body.push(state.src.slice(state.bMarks[i]! + state.blkIndent, state.eMarks[i]!))
    }

    const token = state.push(`component_${name}`, '', 0)
    token.block = true
    token.content = body.join('\n')
    token.info = (open[3] ?? '').trim()
    token.markup = markup
    token.map = [startLine, nextLine + (closed ? 1 : 0)]
    state.line = nextLine + (closed ? 1 : 0)
    return true
  }
}
