// sync-content.js
// 构建期自动同步脚本：扫描 content/ 下的 md 文件 frontmatter，自动生成
// public/config/ 下的 search.json / projects.json / routes.json
// 通过 package.json 的 predev / prebuild 钩子自动执行
// 用法：node src/_build/sync-content.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content');
const CONFIG_DIR = path.join(PROJECT_ROOT, 'public', 'config');

const STATIC_ROUTES = [
    "/", "/home", "/about", "/archives", "/links", "/projects",
    "/tag", "/settings", "/links/apply"
];

function parseFrontmatter(content) {
    // 去除 UTF-8 BOM 头，避免 Windows 记事本等编辑器保存的文件无法解析
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

function getArticleMeta(filename, subDir) {
    if (subDir === 'posts') {
        const m = filename.match(/^post-(\d+)\.md$/) || filename.match(/^post-(.+)\.md$/);
        if (m) return { type: 'post', id: m[1] };
    } else if (subDir === 'logs') {
        const m = filename.match(/^(.+)\.md$/);
        if (m) return { type: 'log', id: m[1] };
    } else if (subDir === 'projects') {
        const m = filename.match(/^project-(\d+)\.md$/) || filename.match(/^project-(.+)\.md$/);
        if (m) return { type: 'project', id: m[1] };
    }
    return null;
}

function buildEntry(fm, id, type) {
    let tags = [];
    if (fm.tags) {
        tags = Array.isArray(fm.tags) ? fm.tags : fm.tags.split(/[,，]/).map(s => s.trim()).filter(Boolean);
    }

    const entry = {
        id,
        title: fm.title || id,
        date: fm.date || '1970-01-01',
        updated: fm.updated || '',
        category: fm.category || 'Uncategorized',
        tags,
        description: fm.description || '',
        keywords: fm.keywords || '',
        author: fm.author || 'Cnkrru',
        history: fm.history || [],
        seoTitle: fm.seoTitle || (fm.title ? fm.title + ' - Tech Blog' : 'Tech Blog')
    };

    if (type === 'post') {
        entry.path = './html/posts/post-' + id + '.html';
    } else if (type === 'log') {
        entry.path = './html/' + id + '.html';
    } else if (type === 'project') {
        entry.path = './html/projects/project-' + id + '.html';
    }

    return entry;
}

// Main
console.log('=== sync-content ===');
console.log('');

fs.mkdirSync(CONFIG_DIR, { recursive: true });

const articles = [];
const projects = [];
const postRoutes = new Set();
const projectRoutes = new Set();

const dirs = ['posts', 'logs', 'projects'];
for (const dir of dirs) {
    const dirPath = path.join(CONTENT_DIR, dir);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    for (const file of files) {
        const meta = getArticleMeta(file, dir);
        if (!meta) continue;

        const content = fs.readFileSync(path.join(dirPath, file), 'utf-8');
        const fm = parseFrontmatter(content);
        if (!fm) {
            console.warn('Skipping (no frontmatter):', path.join(dirPath, file));
            continue;
        }

        const entry = buildEntry(fm, meta.id, meta.type);

        if (meta.type === 'post' || meta.type === 'log') {
            postRoutes.add('/post/' + meta.id);
        } else if (meta.type === 'project') {
            projectRoutes.add('/project/' + meta.id);
        }

        if (meta.type === 'project') {
            projects.push(entry);
        } else {
            articles.push(entry);
        }
    }
}

// Sort by date descending
articles.sort((a, b) => new Date(b.date) - new Date(a.date));

// Write search.json
fs.writeFileSync(path.join(CONFIG_DIR, 'search.json'), JSON.stringify(articles, null, 2), 'utf-8');
console.log('[OK] search.json  - ' + articles.length + ' entries');

// Write projects.json
fs.writeFileSync(path.join(CONFIG_DIR, 'projects.json'), JSON.stringify(projects, null, 2), 'utf-8');
console.log('[OK] projects.json - ' + projects.length + ' entries');

// Write routes.json
const allRoutes = [...STATIC_ROUTES, ...postRoutes, ...projectRoutes];
fs.writeFileSync(path.join(CONFIG_DIR, 'routes.json'), JSON.stringify({ routes: allRoutes }, null, 2), 'utf-8');
console.log('[OK] routes.json  - ' + allRoutes.length + ' routes');

console.log('');
console.log('Done! Synced content/ md files to public/config/ JSON files.');