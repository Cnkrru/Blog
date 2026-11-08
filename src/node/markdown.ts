/*
 * markdown-it 初始化 + 围栏渲染 + shiki 语言加载
 */
import fs from 'node:fs'
import path from 'node:path'
import MarkdownIt from 'markdown-it'
import type { BundledLanguage } from 'shiki'
import { createHighlighter, createCssVariablesTheme } from 'shiki'
import matter from 'gray-matter'
import { anchor } from '@mdit/plugin-anchor'
import { tasklist } from '@mdit/plugin-tasklist'
import { katex } from '@mdit/plugin-katex'
import { componentPlugin } from '@mdit-vue/plugin-component'
import { slugify } from '@mdit-vue/shared'
import { ARTICLE_PATH } from './paths.ts'
import {
  componentFenceLangs,
  renderComponentFence,
  setupComponentPlugins,
} from './plugins/registry.ts'
import { toolbar, splitRow } from './plugins/base.ts'
import {
  fenceLang,
  safeLang,
  warnFallback,
  setHighlighter,
  getHighlighter,
  getPageKey,
} from './tools.ts'

// 高亮主题（CSS 变量驱动，随主题切换变色）
const highlightTheme = createCssVariablesTheme()

// 超过该行数才折叠：阈值编译期决定，运行期只负责展开/收起
const CODE_COLLAPSE_LINES = 50

/* ====================<代码块外壳模板>==================== */

// 普通代码块外壳：shiki 高亮结果塞进顶栏 + 内容区；超 50 行带折叠标记
const codeShell = (lang: string, highlighted: string, lineCount: number): string => {
  const collapsible = lineCount > CODE_COLLAPSE_LINES
  const copyButton = `
        <button class="copy" type="button" title="Copy code">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>`
  const expandButton = collapsible
    ? `<button class="code-expand" type="button" data-lines="${lineCount}" title="Expand code">
            <span class="code-expand-text">Expand (${lineCount} lines)</span>
            <svg class="code-expand-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>`
    : ''
  const toolbarActions = collapsible
    ? `<div class="code-actions">${expandButton}${copyButton}</div>`
    : copyButton
  const body = collapsible ? `<div class="code-body">${highlighted}</div>` : highlighted

  return `
<div class="language-${lang}${collapsible ? ' code-collapse' : ''}" v-pre>
    <div class="code-toolbar">
        <span class="lang lang-${lang}">
            <span class="lang-dot"></span>
            <span class="lang-text">${lang}</span>
        </span>
        ${toolbarActions}
    </div>
    ${body}
</div>
`
}

/* ====================<markdown-it 实例>==================== */

// 创建实例 + 挂载基础插件 + 组件行内规则 + 自定义围栏渲染
export const createMdInstance = (): InstanceType<typeof MarkdownIt> => {
  const md = new MarkdownIt({ html: true, linkify: true, typographer: false })
    .use(componentPlugin)
    .use(anchor, { slugify })
    .use(tasklist)
    .use(katex)

  // 组件围栏优先、其余走 shiki 编译期高亮
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx]!
    const info = md.utils.unescapeAll(token.info).trim()
    const lang = fenceLang(info)
    const safe = safeLang(lang)

    // shiki 会把围栏末尾换行也渲染成空行 span，高亮前先剥掉
    const code = token.content.replace(/\n+$/, '')

    const componentHtml = renderComponentFence(
      {
        escapeHtml: md.utils.escapeHtml,
        toolbar,
        splitRow,
        renderMarkdown: (s: string): string => md.render(s),
        pageKey: getPageKey(),
        highlight: (codeText: string, codeLang: string): string => {
          const body = codeText.replace(/\n+$/, '')
          const panelLang = fenceLang(codeLang)
          try {
            return getHighlighter().codeToHtml(body, { lang: panelLang, theme: highlightTheme })
          } catch (e) {
            warnFallback(panelLang, e)
            return getHighlighter().codeToHtml(body, { lang: 'text', theme: highlightTheme })
          }
        },
      },
      lang,
      token.content,
      info,
    )
    if (componentHtml !== null) return componentHtml

    let highlighted: string
    try {
      highlighted = getHighlighter().codeToHtml(code, { lang, theme: highlightTheme })
    } catch (e) {
      warnFallback(lang, e)
      highlighted = getHighlighter().codeToHtml(code, { lang: 'text', theme: highlightTheme })
    }
    return codeShell(safe, highlighted, code.split('\n').length)
  }

  setupComponentPlugins(md)
  return md
}

/* ====================<shiki 语言加载>==================== */

// 扫描所有 md 文件的 fence 语言，初始化 highlighter 并逐个加载
export const configLanguage = async (files: string[]): Promise<void> => {
  const langSet = new Set<string>(['text'])
  // 只用 markdown-it 分词，不渲染
  const scan = new MarkdownIt({ html: true, linkify: true, typographer: false })

  for (const file of files) {
    const raw = fs.readFileSync(path.join(ARTICLE_PATH, file), 'utf-8')
    const content = matter(raw).content
    for (const token of scan.parse(content, {})) {
      if (token.type !== 'fence') continue
      const lang = fenceLang(scan.utils.unescapeAll(token.info))
      if (componentFenceLangs.has(lang)) {
        if (lang === 'code-group') {
          for (const i of token.content.matchAll(/^@tab[ \t]+(.+?)[ \t]*$/gm)) {
            const label = (i[1] ?? '').trim().toLowerCase()
            if (label && !componentFenceLangs.has(label)) langSet.add(label)
          }
        }
        continue
      }
      langSet.add(lang)
    }
  }

  const nextHighlighter = await createHighlighter({
    themes: [highlightTheme],
    langs: ['text'],
  })
  for (const lang of langSet) {
    if (lang === 'text') continue
    try {
      await nextHighlighter.loadLanguage(lang as BundledLanguage)
    } catch (e) {
      warnFallback(lang, e)
    }
  }
  setHighlighter(nextHighlighter)
}
