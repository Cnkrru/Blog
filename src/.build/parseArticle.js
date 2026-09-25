import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import { anchor } from '@mdit/plugin-anchor'
import { tasklist } from '@mdit/plugin-tasklist'
import { katex } from '@mdit/plugin-katex'
import { componentPlugin } from '@mdit-vue/plugin-component'
import { slugify } from '@mdit-vue/shared'
import { createHighlighter, createCssVariablesTheme } from 'shiki'
import { container } from '@mdit/plugin-container'

const highlight_theme = createCssVariablesTheme()

// [AI优化] 输入签名。vite-ssg 一次 build 会跑"客户端+服务端"两次 vite build，且每次构建都重新 import 本模块
// —— 内存态无法跨构建存活，改用 `.cache/compile/.compile-sig` 磁盘 sidecar：签名一致则短路复用缓存
const compile_signature = (article_path, files) => files
    .map((f) => { const s = fs.statSync(path.join(article_path, f)); return `${f}:${s.mtimeMs}:${s.size}` })
    .sort()
    .join('|')

// 语言名消毒：只保留字母数字下划线连字符，防止注入类名/属性
const safe_lang = (lang) => String(lang).replace(/[^\w-]/g, '')

/* ====================<代码块外壳模板>==================== */
/*
* id: code_shell
* fn: 普通代码块外壳，编译期把shiki高亮结果塞进顶栏+内容区结构
* 顶栏对齐 blog-map：语言徽章(圆点+文本) + 内联 SVG 复制图标
*/
const code_shell = (lang, highlighted) => `
<div class="language-${lang}" v-pre>
    <div class="code-toolbar">
        <span class="lang lang-${lang}">
            <span class="lang-dot"></span>
            <span class="lang-text">${lang}</span>
        </span>
        <button class="copy" aria-label="复制代码">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
    </div>
    ${highlighted}
</div>
`

/*
* id: mermaid_shell
* fn: mermaid代码块外壳，渲染前是源码文本，由运行时mermaid.run替换为图
*/
const mermaid_shell = (code) => `
<div class="language-mermaid" v-pre>
    <div class="code-toolbar">
        <span class="lang lang-mermaid">
            <span class="lang-dot"></span>
            <span class="lang-text">mermaid</span>
        </span>
    </div>
    <pre data-lang="mermaid"><code>${code}</code></pre>
</div>
`

/*
* ====================<提示块外壳模板>====================
* id: admonition_shell
* fn: 提示块外壳，编译期把 `:::tip/info/warn/error` 容器内容拼进
* 标题栏(图标+文字) + 内容区结构，样式由 content.css 按等级配色
* 语法：`:::type 可选标题` 内容 `:::`（标题省略时用默认文案）
* —— AI 编写 2026-09 ——
*/
const ADMONITION_META = Object.freeze({
    tip:   { icon: 'asterisk',  label: '提示' },
    info:  { icon: 'info',      label: '信息' },
    warn:  { icon: 'alert',     label: '警告' },
    error: { icon: 'close',     label: '错误' },
})

const admonition_icon = Object.freeze({
    info:     '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    alert:    '<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>',
    close:    '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    asterisk: '<path d="M12 4v16"/><path d="M5 8l5.8 3.7 3.6-2.2"/><path d="m11 20 1-6 6-1"/>',
})

const admonition_shell_open = (type, title) => {
    const meta = ADMONITION_META[type] || ADMONITION_META.info
    const t = title || meta.label
    return `
<!-- == admonition ` + type + ` == -->
<div class="admonition admonition-` + type + `">
    <div class="admonition-head">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` + admonition_icon[meta.icon] + `</svg>
        <span class="admonition-title">` + t + `</span>
    </div>
    <div class="admonition-body">`
}

const admonition_shell_close = () => `</div></div>`

/*
* id: 文章字数统计者
* fn: 统计md原文的纯文本字数，剔除代码块/行内代码/图片链接语法，
* 中文按字符计，英文按单词计，二者相加（阅读时长=字数/300 向上取整，最少1分钟）
*/
const count_words = (content) => {
    const pure = content
        .replace(/```[\s\S]*?```/g, ' ')                       // 去代码块
        .replace(/`[^`]*`/g, ' ')                               // 去行内代码
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')                  // 去图片
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')                // 链接保留文字
        .replace(/[#>*_~\-|]/g, ' ')                            // 去md符号
    const cn = (pure.match(/[\u4e00-\u9fff]/g) || []).length    // 中文字符
    const en = (pure.match(/[a-zA-Z0-9]+(?:['-][a-zA-Z0-9]+)*/g) || []).length  // 英文单词
    return cn + en
}

/*
* id: 文章解析者
* fn: 解析文章内容和元数据，配置高亮和markdown-it
*/
const article_parser = (post_dirname) => {
    const script_path = fileURLToPath(import.meta.url);                         // 脚本文件路径(d:\__projects\blog\src\.build\parseArticle.js)
    const dir_path = path.dirname(script_path);                                 // 脚本所在文件夹的路径(d:\__projects\blog\src\.build)
    const root_path = path.resolve(dir_path,'../..');                           // 项目根路径(d:\__projects\blog)
    const article_path = path.join(root_path,post_dirname);                      // 文章所在文件夹路径(d:\__projects\blog\docs)
    const vue_path = path.join(root_path,'.cache/compile');                      // 编译中间产物缓存路径(d:\__projects\blog\.cache\compile)
    const json_path = path.join(root_path,'public/config/post.json')             // 文章元数据文件路径(d:\__projects\blog\public\config\post.json)    

    let highlighter = null                                                      // 语法高亮器，config_language初始化，fence规则闭包使用

    /*
    * id: 文章路径检查者
    * fn: 检查文章文件夹是否存在，如果存在，检查里面有没有文件，返回files(读文件的产物)
    */
    const article_path_checker = () => {
        if(fs.existsSync(article_path)) {
            console.log('[INFO]:文章文件夹存在')
            const files = fs.readdirSync(article_path).filter((_) => _.endsWith('.md'))
            if (files.length ===0 ) {
                console.warn('[WARN]:文章目录下没有文件');
            }
            return files
        }
        else {
            console.error('[ERR]:文章文件夹不存在')
        }
    }

    /*
    * id: vue中间产物清理者(检察者的子函数)
    * fn: [AI优化]只清除"已从docs删除文章"的过时产物；仍在用的SFC保留，供mtime增量复用
    */
    const vue_path_cleaner = (ids) => {
        for (const file of fs.readdirSync(vue_path)) {
            if (file.endsWith('.vue') && !ids.has(file.replace(/\.vue$/, ''))) {
                fs.rmSync(path.join(vue_path, file))
                console.log(`[INFO]:清除过时中间产物${file}`)
            }
        }
    }

    /*
    * id: vue中间产物路径检查者
    * fn: 检查.cache文件夹是否存在，如果没有则创建一个
    */    
    const vue_path_checker = (ids) => {
        try {
            if(fs.existsSync(vue_path)) {
                console.log('[INFO]:vue文件夹存在')
                vue_path_cleaner(ids);
            }
            else {
                fs.mkdirSync(vue_path, { recursive: true })
                if(fs.existsSync(vue_path)) {
                    console.log('[INFO]:原路径无vue文件夹,创建文件夹成功')
                }
                else {
                    console.error('[ERR]:原路径无vue文件夹,创建文件夹失败')
                }
            }
        }
        catch(e) {
            console.error('[ERR]:vue文件夹操作失败', e)
        }
    }

    /*
    * id: json配置文件路径检查者
    * fn: 检查post.json是否存在，如果没有则创建一个
    */    
    const json_path_checker = () => {
        try {
            if(fs.existsSync(json_path)) {
                console.log('[INFO]:post.json存在')
            }
            else {
                fs.writeFileSync(json_path, '{}', 'utf8')
                if(fs.existsSync(json_path)) {
                    console.log('[INFO]:原路径无post.json,创建文件成功')
                }
                else {
                    console.error('[ERR]:原路径无post.json,创建文件失败')
                }
            }
        }
        catch(e) {
            console.error('[ERR]:post.json操作失败', e)
        }
    }


    /*
    * id: 语法高亮语言配置
    * fn: 遍历md，扫描代码块，每遇到一种语言，集合追加这门，mermaid排除，按需加载
    */      
    const config_language = async (files) => {
        const lang_set = new Set(['text'])
        // 语言集合追加
        for(const file of files) {
            const _ = fs.readFileSync(path.join(article_path,file),'utf-8')    
            for(const i of _.matchAll(/^```([\w+-]+)/gm)) {
                const lang = i[1].toLowerCase()
                if(lang !== 'mermaid') {
                    lang_set.add(lang)
                }
            }
        }

        // shiki语法高亮配置
        highlighter = await createHighlighter({
            themes: [highlight_theme],
            langs: [...lang_set],
        })
    }

    /*
    * id: markdown-it配置
    * fn: 主要工作函数，配置markdown-it
    */     
    const config_md = (files) => {
        // 步骤1:创建markdown-it实例，挂载插件
        const init = () => {
            const md = new MarkdownIt({html:true,linkify:true,typographer:false})
                .use(componentPlugin)                          // 支持原生HTML和vue组件
                .use(anchor, { slugify })                      // 支持md'#'标签绑定id
                .use(tasklist, { enabled: true })              // 支持md的任务列表转HTML
                .use(katex)                                    // 支持KATEX
            
            return md
        }

        // 步骤2：编译期拦截代码块，将指定代码块转义产物注入自定义HTML模块
        const config_fence = (md) => {
            md.renderer.rules.fence = (tokens, idx) => {
                const token = tokens[idx]
                const info = md.utils.unescapeAll(token.info).trim()
                const lang = info.split(/\s+/)[0] || 'text'
                const safe = safe_lang(lang)

                if(lang === 'mermaid') {
                    return mermaid_shell(md.utils.escapeHtml(token.content))
                }

                let highlighted
                try {
                    highlighted = highlighter.codeToHtml(token.content, { lang, theme: highlight_theme })
                }
                catch {
                    highlighted = highlighter.codeToHtml(token.content, { lang: 'text', theme: highlight_theme })
                }
                return code_shell(safe, highlighted)
            }
        }

        // 步骤2.5：编译期拦截提示块容器（`:::tip/info/warn/error` 包裹内容）
        // @mdit/plugin-container 用 openRenderer/closeRenderer 分两段：
        // open 出锚点+头部+body开标签，中间内容由 markdown-it 正常渲染，close 收尾（AI 编写）
        const config_container = (md) => {
            ;['tip', 'info', 'warn', 'error'].forEach(type => {
                md.use(container, {
                    name: type,
                    openRenderer(tokens, idx, options, _env, _self) {
                        const token = tokens[idx]
                        // 标题：`:::info 标题` 取"标题"，缺省为空串（fallback 到默认文案）
                        const raw = token.info.trim().slice(type.length).trim()
                        const title = raw === '' ? '' : raw
                        return admonition_shell_open(type, title)
                    },
                    closeRenderer() {
                        return admonition_shell_close()
                    },
                })
            })
        }

        // 步骤3：解析md，将md的内容和元数据分别写入对应文件
        const md_parser = () => {
            const md = init()
            config_fence(md)
            config_container(md)

            /*
            * id: 更新记录生成器
            * fn: 构建期把 frontmatter.history 渲染成"更新记录"列表，追加到正文末尾
            * 条目格式："2026-08-07 新增xxx" → 按第一个空格拆日期与说明；拆不出日期整串当说明
            * 正文已含"更新记录"标题时跳过，避免重复
            * —— AI 编写 2026-09 ——
            */
            const history_html = (frontmatter, rendered) => {
                const list = frontmatter.history
                if (!Array.isArray(list) || list.length === 0) return ''
                if (rendered.includes('id="更新记录"')) return ''

                const items = list
                    .map((item) => {
                        const text = String(item).trim()
                        if (!text) return ''
                        const match = text.match(/^(\S+)\s+(.*)$/)
                        const safe = md.utils.escapeHtml
                        return match
                            ? `<li><time>${safe(match[1])}</time> ${safe(match[2])}</li>`
                            : `<li>${safe(text)}</li>`
                    })
                    .filter(Boolean)
                    .join('\n')

                return `
<!-- == 更新记录(AI生成) == -->
<h2 id="更新记录">更新记录</h2>
<ul class="history-list">
${items}
</ul>`
            }
            
            const articles = {}

            for(const file of files) {
                const id = file.replace(/\.md$/, '')                                    // 把文章名取出来
                const _ = fs.readFileSync(path.join(article_path, file), 'utf8')        // 读取文章内容
                const content = matter(_).content                                       // 用库解析出文章内容
                const frontmatter = matter(_).data                                      // 用库解析出文章元数据

                // [AI优化] mtime增量：SFC产物存在且不比源文件旧 → 跳过katex重渲染与重写，直接复用
                const sfc_path = path.join(vue_path, `${id}.vue`)
                const sfc_fresh = fs.existsSync(sfc_path)
                    && fs.statSync(sfc_path).mtimeMs >= fs.statSync(path.join(article_path, file)).mtimeMs

                if(!sfc_fresh) {
                    const rendered = md.render(content)                                 // 先把文章内容转义为HTML
                    const html = rendered + history_html(frontmatter, rendered)          // 有history时在正文末尾追加"更新记录"列表
                    const vue = `<template>${html}</template>`                          // 把文章内容拼接成vue的HTML块
                    fs.writeFileSync(sfc_path, vue, 'utf8')                             // 把拼接好的块写入对应文件
                }

                // 构建期统计字数与阅读时长，展示组件运行时直接读，零计算
                const word_count = count_words(content)
                const reading_time = Math.max(1, Math.ceil(word_count / 300))

                // 把解析出的yaml元数据写入json
                articles[id] = {
                ...frontmatter, 
                title: frontmatter.title || id,                        
                date: frontmatter.date ? new Date(frontmatter.date).toISOString().slice(0, 10) : '',
                updated: frontmatter.updated ? new Date(frontmatter.updated).toISOString().slice(0, 10) : '',
                tags: frontmatter.tags || [],
                word_count,
                reading_time,
                }
            }

            fs.writeFileSync(json_path, JSON.stringify(articles, null, 4), 'utf8')
        }

        return md_parser
    }

    async function execute () {
        // 1. 检查文章文件夹，拿到md文件列表
        const files = article_path_checker()
        if(!files || files.length === 0) {
            return
        }
        // [AI优化] 输入签名比对：两次 vite build 乃至无改动重跑都靠磁盘 sidecar 短路复用缓存
        const sig = compile_signature(article_path, files)
        const sig_file = path.join(vue_path, '.compile-sig')
        if(fs.existsSync(sig_file) && fs.readFileSync(sig_file, 'utf8') === sig) {
            console.log('[INFO]:输入未变,短路复用.cache编译缓存')
            return
        }
        // 2. 检查缓存与元数据文件路径（清除已删除文章的过时产物）
        const ids = new Set(files.map((f) => f.replace(/\.md$/, '')))
        vue_path_checker(ids)
        json_path_checker()
        // 3. 仅当有文件需要重渲染时才扫描语言、初始化高亮器（全量未变时跳过createHighlighter）
        const need_render = files.some((f) => {
            const sfc_path = path.join(vue_path, `${f.replace(/\.md$/, '')}.vue`)
            return !fs.existsSync(sfc_path)
                || fs.statSync(sfc_path).mtimeMs < fs.statSync(path.join(article_path, f)).mtimeMs
        })
        if(need_render) {
            await config_language(files)
        }
        // 4. 配置markdown-it并编译文章
        const md_parser = config_md(files)
        md_parser()
        fs.writeFileSync(sig_file, sig, 'utf8')   // [AI优化] 落盘签名，供下次构建短路
    }

    return execute
}

// 直接运行本文件时编译；作为模块被 vite.config 导入时由 buildStart 调用
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    article_parser('docs')()
}

export default () => article_parser('docs')()