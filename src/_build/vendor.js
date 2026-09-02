// vendor.js
// 构建期资源本地化脚本：把 @vue/repl 运行 Vue 代码所需的浏览器端运行时
// 从 node_modules 拷贝到 public/vendor/，站点零 CDN 依赖
// 通过 package.json 的 predev / prebuild 钩子自动执行
// 用法：node src/_build/vendor.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const VENDOR_DIR = path.join(PROJECT_ROOT, 'public', 'vendor');

// [源文件相对 node_modules 的路径, 目标文件名]
const ASSETS = [
    ['vue/dist/vue.runtime.esm-browser.js', 'vue.runtime.esm-browser.js'],
    ['vue/dist/vue.runtime.esm-browser.prod.js', 'vue.runtime.esm-browser.prod.js'],
    ['@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js', 'compiler-sfc.esm-browser.js'],
    ['es-module-shims/dist/es-module-shims.js', 'es-module-shims.js'],
];

console.log('=== vendor ===');
console.log('');

fs.mkdirSync(VENDOR_DIR, { recursive: true });

for (const [rel, name] of ASSETS) {
    const src = path.join(PROJECT_ROOT, 'node_modules', rel);
    const dst = path.join(VENDOR_DIR, name);
    if (!fs.existsSync(src)) {
        console.error('[ERR] missing source:', rel);
        process.exitCode = 1;
        continue;
    }
    fs.copyFileSync(src, dst);
    console.log('[OK] ' + name + '  (' + (fs.statSync(dst).size / 1024).toFixed(1) + ' KB)');
}

console.log('');
console.log('Done! Runtime assets vendored to public/vendor/.');