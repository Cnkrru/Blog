// md-to-html.js
// 构建期把 content/*.md 转成静态 HTML，输出到 public/html/
// 普通 Markdown 用 marked 转换；特殊块（代码/JSON/YAML/TOML/CSV/Mermaid/公式/提示块/Toast/彩蛋）
// 生成带 data-* 标记的静态结构，运行时由 MarkdownRender.vue 扫描激活为交互组件
// 通过 package.json 的 predev / prebuild 钩子自动执行
// 用法：node src/_build/md-to-html.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content');
const HTML_DIR = path.join(PROJECT_ROOT, 'public', 'html');

// ── HTML 转义 ──
const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ── frontmatter 解析（与 sync-content.js 保持一致）──
function parseFrontmatter(content) {
    const clean = content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
    const match = clean.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!match) return null;

    const result = {};
    const lines = match[1].split('\n');
    let currentKey = null;
    let arrayValues = [];

    function parseLine(line) {
        const inlineArr = line.match(/^(\w+):\s*\[(.+)\]$/);
        if (inlineArr) {
            result[inlineArr[1]] = inlineArr[2].split(/[,，]/).map(s => s.trim()).filter(Boolean);
            return;
        }
        const kv = line.match(/^(\w+):\s*(.*)$/);
        if (kv) {
            if (kv[2].trim() === '') {
                currentKey = kv[1];
                arrayValues = [];
            } else {
                result[kv[1]] = kv[2].trim();
            }
        }
    }

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (currentKey !== null) {
            const arrMatch = trimmed.match(/^-\s+(.+)$/);
            if (arrMatch) {
                arrayValues.push(arrMatch[1]);
            } else {
                result[currentKey] = arrayValues;
                currentKey = null;
                arrayValues = [];
                parseLine(trimmed);
            }
        } else {
            parseLine(trimmed);
        }
    }

    if (currentKey !== null) {
        result[currentKey] = arrayValues;
    }

    return result;
}

// ── 特殊块提取（与 MarkdownRender.vue 的 extractOrderedBlocks 保持一致）──
const ADMONITION_TITLES = { info: '信息', success: '成功', warning: '警告', error: '错误', tip: '提示', note: '笔记', danger: '危险' };

function extractBlocks(content) {
    const blocks = [];
    let lastIndex = 0;

    const yamlMatch = content.match(/^---[\s\S]*?---\n?/);
    if (yamlMatch) {
        lastIndex = yamlMatch[0].length;
    }

    const patterns = [
        { type: 'mermaid', regex: /```mermaid[\s\S]*?```/gim },
        { type: 'math', regex: /\$\$([\s\S]*?)\$\$/gim },
        { type: 'code', regex: /```([\s\S]*?)```/gim },
        { type: 'easter-egg', regex: /<easter-egg([^>]*)>[\s\S]*?<\/easter-egg>/gim },
        { type: 'admonition', regex: /^:::\s*(info|success|warning|error|tip|note|danger)\s*(.*?)\s*\n([\s\S]*?)^:::\s*$/gm },
        { type: 'toast-btn', regex: /<msg:(info|success|warning|error)>([\s\S]*?)<\/msg:(info|success|warning|error)>/gim }
    ];

    const allMatches = [];
    patterns.forEach(({ type, regex }) => {
        let match;
        while ((match = regex.exec(content)) !== null) {
            allMatches.push({ type, match, index: match.index });
        }
    });
    allMatches.sort((a, b) => a.index - b.index);

    allMatches.forEach(({ type, match, index }) => {
        if (index > lastIndex) {
            const mdContent = content.substring(lastIndex, index);
            if (mdContent.trim()) {
                blocks.push({ type: 'markdown', content: mdContent });
            }
        }

        if (type === 'mermaid') {
            const code = match[0].replace(/^```mermaid\s*/i, '').replace(/```$/i, '').trim();
            blocks.push({ type: 'mermaid', content: code });
        } else if (type === 'math') {
            blocks.push({ type: 'math', content: match[1].trim() });
        } else if (type === 'code') {
            const code = match[1];
            const lines = code.split('\n');
            const lang = lines[0].trim() || 'plaintext';
            const codeContent = lines.slice(1).join('\n').replace(/\n+$/, '');
            if (lang.toLowerCase() !== 'mermaid') {
                blocks.push({ type: 'code', content: codeContent, language: lang });
            }
        } else if (type === 'easter-egg') {
            const textMatch = match[0].match(/text=["']([^"']+)["']/);
            const finalTextMatch = match[0].match(/final-text=["']([^"']+)["']/);
            blocks.push({
                type: 'easter-egg',
                content: match[0],
                text: textMatch ? textMatch[1] : '欢迎来到我的博客',
                finalText: finalTextMatch ? finalTextMatch[1] : '欢迎来到我的博客'
            });
        } else if (type === 'admonition') {
            const admonType = match[1] || 'info';
            const admonTitle = match[2]?.trim() || ADMONITION_TITLES[admonType] || admonType;
            const admonContent = match[3]?.trim() || '';
            blocks.push({ type: 'admonition', content: admonContent, admonitionType: admonType, admonitionTitle: admonTitle });
        } else if (type === 'toast-btn') {
            const btnType = match[1] || 'info';
            const btnText = match[2]?.trim() || '';
            blocks.push({ type: 'toast-btn', toastType: btnType, toastText: btnText });
        }

        lastIndex = index + match[0].length;
    });

    if (lastIndex < content.length) {
        const mdContent = content.substring(lastIndex);
        if (mdContent.trim()) {
            blocks.push({ type: 'markdown', content: mdContent });
        }
    }

    return blocks;
}

// ── 特殊块 → 静态 HTML（运行时 MarkdownRender 扫描 data-block 激活）──
function renderBlock(block) {
    switch (block.type) {
        case 'markdown':
            return marked.parse(block.content);

        case 'code': {
            const lang = block.language || 'plaintext';
            const lower = lang.toLowerCase();
            // JSON/YAML/TOML/CSV 走专用视图组件
            if (['json', 'yaml', 'toml', 'csv'].includes(lower)) {
                return `<div class="special-block" data-block="${lower}" data-code="${escapeAttr(block.content)}"><pre><code>${escapeHtml(block.content)}</code></pre></div>`;
            }
            return `<div class="special-block" data-block="code" data-lang="${escapeAttr(lang)}"><pre><code class="language-${escapeAttr(lang)}">${escapeHtml(block.content)}</code></pre></div>`;
        }

        case 'mermaid':
            return `<div class="special-block" data-block="mermaid" data-code="${escapeAttr(block.content)}"><pre><code>${escapeHtml(block.content)}</code></pre></div>`;

        case 'math':
            return `<div class="special-block" data-block="math" data-latex="${escapeAttr(block.content)}"><pre><code>${escapeHtml(block.content)}</code></pre></div>`;

        case 'admonition':
            return `<div class="special-block" data-block="admonition" data-type="${escapeAttr(block.admonitionType)}" data-title="${escapeAttr(block.admonitionTitle)}"><div class="admonition-body">${marked.parse(block.content)}</div></div>`;

        case 'toast-btn':
            return `<span class="special-block" data-block="toast" data-type="${escapeAttr(block.toastType)}" data-text="${escapeAttr(block.toastText)}">${escapeHtml(block.toastText)}</span>`;

        case 'easter-egg':
            return `<div class="special-block" data-block="easter-egg" data-text="${escapeAttr(block.text)}" data-final="${escapeAttr(block.finalText)}">${escapeHtml(block.text)}</div>`;

        default:
            return '';
    }
}

// ── md → HTML ──
function mdToHtml(mdText) {
    const blocks = extractBlocks(mdText);
    return blocks.map(renderBlock).join('\n');
}

// ── 主流程 ──
console.log('=== md-to-html ===');
console.log('');

fs.mkdirSync(HTML_DIR, { recursive: true });
let count = 0;

function writeHtml(relPath, html) {
    const filePath = path.join(HTML_DIR, relPath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, html, 'utf-8');
    count++;
    console.log(`[OK] ${relPath}`);
}

// 文章
const postsDir = path.join(CONTENT_DIR, 'posts');
if (fs.existsSync(postsDir)) {
    for (const file of fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))) {
        const m = file.match(/^post-(.+)\.md$/);
        if (!m) continue;
        const mdText = fs.readFileSync(path.join(postsDir, file), 'utf-8');
        writeHtml(`posts/post-${m[1]}.html`, mdToHtml(mdText));
    }
}

// 项目
const projectsDir = path.join(CONTENT_DIR, 'projects');
if (fs.existsSync(projectsDir)) {
    for (const file of fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'))) {
        const m = file.match(/^project-(.+)\.md$/);
        if (!m) continue;
        const mdText = fs.readFileSync(path.join(projectsDir, file), 'utf-8');
        writeHtml(`projects/project-${m[1]}.html`, mdToHtml(mdText));
    }
}

// 关于页
const aboutFile = path.join(CONTENT_DIR, 'about', 'about.md');
if (fs.existsSync(aboutFile)) {
    writeHtml('about.html', mdToHtml(fs.readFileSync(aboutFile, 'utf-8')));
}

// 公告
const announcementFile = path.join(CONTENT_DIR, 'announcement', 'index.md');
if (fs.existsSync(announcementFile)) {
    writeHtml('announcement.html', mdToHtml(fs.readFileSync(announcementFile, 'utf-8')));
}

console.log('');
console.log(`Done! ${count} md files converted to ${path.relative(PROJECT_ROOT, HTML_DIR)}/`);