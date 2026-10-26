/*
 * diff 组件插件（代码块）
 *
 * 语法：围栏代码块，语言名 diff，块内是 git 生成的标准 unified diff（与 GitHub 的 ```diff 约定一致）：
 *   ```diff
 *   diff --git a/src/a.ts b/src/a.ts
 *   index 3f2a91c..8b4d0e2 100644
 *   --- a/src/a.ts
 *   +++ b/src/a.ts
 *   @@ -1,3 +1,3 @@
 *    const a = 1
 *   -const a = 2
 *   +const a = 3
 *   ```
 * 行类别按 diff 语法判定，符号（+ / - / 空格）保留在行内文本里，与 GitHub 渲染一致；
 * 每行一个块级 span，行级背景色交主题层按 .diff-* 约定配色。
 * 正文原样保留、只做 HTML 转义，不 trim，免得吃掉代码自身的缩进。
 * 外壳沿用普通代码块的 .language-xx + .code-toolbar 结构，样式直接复用 content.css。
 * 纯编译期直出 HTML，零运行期 JS。
 *
 * 结构约定：HTML 片段一律抽成模块级 const 模板，render 只留解析与编排的 TS 逻辑。
 */
import type { ComponentPlugin } from './base.ts'

/* ====================<HTML 模板>==================== */

// 单行：符号不拆列，整行文本连符号一起转义，复制出来仍是合法 diff
const DIFF_LINE = (cls: string, text: string): string =>
  `<span class="diff-line ${cls}">${text}</span>`

// 块外壳：顶栏 + 行流。pre 内包 code 对齐普通代码块语义，行与行之间不能换行缩进，否则会多出空行
const DIFF_WRAP = (toolbar: string, lines: string): string => `
<div class="language-diff" v-pre>${toolbar}
    <pre class="diff"><code>${lines}</code></pre>
</div>`

/* ====================<插件实现>==================== */

// 不带符号前缀的元信息行：git 扩展头、索引行、文件模式、重命名、二进制等
const DIFF_META =
  /^(diff --git |index |new file mode |deleted file mode |old mode |new mode |similarity index |dissimilarity index |rename (from|to) |copy (from|to) |Binary files |GIT binary patch|\\ No newline at end of file)/

/*
 * 按 unified diff 语法判定行类别，顺序不能换：
 *  - '--- ' / '+++ ' 是文件头，必须先于删除行判定（它本身也以 - 开头）
 *  - '@@' 是块头
 *  - '+' / '-' 是新增与删除
 *  - git 扩展头归 meta，其余（含以空格开头的上下文行、空行）都是上下文
 */
const classifyDiffLine = (line: string): string => {
  if (line.startsWith('--- ') || line.startsWith('+++ ')) return 'diff-file'
  if (line.startsWith('@@')) return 'diff-hunk'
  if (line.startsWith('+')) return 'diff-add'
  if (line.startsWith('-')) return 'diff-del'
  if (DIFF_META.test(line)) return 'diff-meta'
  return 'diff-ctx'
}

export const diffBlock: ComponentPlugin = {
  name: 'diff',
  fenceLangs: ['diff'],

  render(ctx, content) {
    if (!content.trim()) return ''
    const esc = ctx.escapeHtml
    // 围栏块内容末尾至少带一个换行；块内末尾的空行不是 diff 内容，一并去掉，避免多渲染一行
    const rows = content.replace(/\n+$/, '').split('\n')
    const lines = rows
      .map((line) => DIFF_LINE(classifyDiffLine(line), esc(line)))
      .join('')
    return DIFF_WRAP(ctx.toolbar('diff'), lines)
  },
}
