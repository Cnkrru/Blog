# 本项目 `vite.config.ts` 配置详解

> 来源：[Vite v8.1.4 官方配置文档](https://vite.dev/config/)

---

## 当前配置逐行解释

### 1. `base: '/'`

| 属性 | 值 | 类别 |
|------|-----|------|
| `base` | `'/'` | 共享选项 |

公共基础路径。`'/'` 表示部署在域名根路径下，所有资源都从 `/` 开始引用：

```
https://cnkrru.top/           → 首页
https://cnkrru.top/assets/xxx → 静态资源
```

如果部署在子路径下（如 `https://example.com/blog/`），需要改成 `base: '/blog/'`。

---

### 2. `server: { https: false }`

| 属性 | 值 | 类别 |
|------|-----|------|
| `server.https` | `false` | 服务器选项 |

开发服务器是否启用 HTTPS。`false` 表示使用 HTTP 协议：

```bash
npm run dev
# →  http://localhost:5173
```

设为 `true` 会开启 HTTPS（需要本地证书）。

---

### 3. `resolve: { alias: { '@': ... } }`

| 属性 | 值 | 类别 |
|------|-----|------|
| `resolve.alias` | `{ '@': './src' }` | 共享选项 |

路径别名。配置后代码中可以这样用：

```ts
// 之前
import Header from '../../components/Header.vue'

// 之后
import Header from '@/components/Header.vue'
```

`@` 指向 `./src` 目录，`fileURLToPath(new URL('./src', import.meta.url))` 确保在 ESM 环境下拿到绝对路径。

---

### 4. `optimizeDeps: { exclude: ['*.md'] }`

| 属性 | 值 | 类别 |
|------|-----|------|
| `optimizeDeps.exclude` | `['*.md']` | 依赖优化选项 |

Vite 在开发模式下会预构建 `node_modules` 中的依赖（将它们转换为 ESM）。`exclude` 告诉 Vite："不要预构建 `.md` 文件"。

本项目 Markdown 文章由 `vite-ssg` 在构建时处理，不需要 Vite 预构建。

---

### 5. `build.rollupOptions`

| 属性 | 值 | 类别 |
|------|-----|------|
| `build.rollupOptions` | `{ ... }` | 构建选项 |

直接透传给打包器 Rolldown/Rollup 的底层配置：

```ts
rollupOptions: {
  external: ['**/*.md'],    // .md 文件不打包进 bundle
  output: {
    manualChunks             // 自定义分包函数
  }
}
```

- **`external`**：构建时遇到 `.md` 文件不打包进来（因为 SSG 单独处理）
- **`manualChunks`**：控制哪些第三方库打包到同一个 chunk 中（见 `src/plugins/chunks.ts`）

---

### 6. `build.cssCodeSplit: true`

| 属性 | 值 | 默认值 | 类别 |
|------|-----|--------|------|
| `build.cssCodeSplit` | `true` | `true` | 构建选项 |

是否将异步加载的 JS chunk 中引用的 CSS 单独拆分。

- `true`：每个异步 chunk 的 CSS 拆成独立文件（按需加载，首屏更快）
- `false`：所有 CSS 合并为一个文件

---

### 7. `build.minify: 'terser'`

| 属性 | 值 | 默认值 | 类别 |
|------|-----|--------|------|
| `build.minify` | `'terser'` | `'oxc'` | 构建选项 |

JS 代码压缩工具。选择 Terser 而非默认的 Oxc，通常是为了使用 Terser 独有的配置项。

---

### 8. `build.terserOptions`

| 属性 | 值 | 类别 |
|------|-----|------|
| `build.terserOptions` | `{ compress: {...} }` | 构建选项 |

Terser 的额外压缩配置：

```ts
compress: {
  drop_console: true,    // 删除所有 console.log / console.info 等
  drop_debugger: true    // 删除所有 debugger 语句
}
```

生产环境打包后，所有 `console` 调用都会被移除。

---

### 9. `build.cssMinify: 'esbuild'`

| 属性 | 值 | 默认值 | 类别 |
|------|-----|--------|------|
| `build.cssMinify` | `'esbuild'` | `'lightningcss'` | 构建选项 |

CSS 压缩引擎。这里用 esbuild 而非默认的 Lightning CSS。

---

### 10. `build.sourcemap: false`

| 属性 | 值 | 类别 |
|------|-----|------|
| `build.sourcemap` | `false` | 构建选项 |

不生成 source map 文件。生产环境关闭，减小构建体积，避免源码泄露。

---

### 11. `build.chunkSizeWarningLimit: 1000`

| 属性 | 值 | 默认值 | 类别 |
|------|-----|--------|------|
| `build.chunkSizeWarningLimit` | `1000` | `500` KB | 构建选项 |

chunk 大小警告阈值从默认的 500KB 提升到 1MB。超过 1MB 的 chunk 构建时才会报警。

---

### 12. `plugins: [...]`

| 属性 | 值 | 类别 |
|------|-----|------|
| `plugins` | `[vue(), Pages({...}), ...]` | 共享选项 |

插件数组：

| 插件 | 作用 |
|------|------|
| `vue()` | 官方插件，编译 `.vue` 文件 |
| `Pages({...})` | `vite-plugin-pages`，文件系统自动路由 |
| `copyJsFilesPlugin()` | 自定义，拷贝特效 JS 到 dist |
| `copyVercelConfigPlugin()` | 自定义，拷贝 vercel.json 到 dist |
| `generateOgImagesPlugin()` | 自定义，构建时生成文章 OG 封面 SVG |

`Pages` 的配置：

```ts
dirs: 'src/pages',        // 从 src/pages/ 读取页面文件
extensions: ['vue'],      // 只识别 .vue 文件
importMode: 'sync',       // 同步导入（SSG 需要）
exclude: ['**/*.md']      // 排除 .md 文件
```

---

### 13. `ssgOptions: { ... }`

| 属性 | 值 | 类别 |
|------|-----|------|
| `ssgOptions` | `{ ... }` | `vite-ssg` 插件选项 |

静态站点生成配置（非 Vite 原生，来自 `vite-ssg`）：

| 属性 | 值 | 说明 |
|------|-----|------|
| `script` | `'async'` | `<script>` 标签加 `async`，不阻塞 HTML 解析 |
| `formatting` | `'minify'` | HTML 输出压缩 |
| `includedRoutes` | `() => includedRoutes` | 预渲染路由清单，SSG 会逐条生成静态 HTML |
| `onFinished` | `() => { onSsgFinished(__dirname) }` | 构建完成回调：生成 sitemap.xml 和 rss.xml |

---

## Vite 完整配置选项速查

### 共享选项（Share Options）

| 选项 | 类型 | 默认值 | 作用 |
|------|------|--------|------|
| `root` | `string` | `process.cwd()` | 项目根目录 |
| `base` | `string` | `'/'` | 公共基础路径 |
| `mode` | `string` | `'development'` / `'production'` | 运行模式 |
| `define` | `Record<string, string>` | — | 全局常量替换 |
| `plugins` | `Plugin[]` | — | 插件列表 |
| `publicDir` | `string \| false` | `'public'` | 静态资源目录 |
| `cacheDir` | `string` | `'node_modules/.vite'` | 缓存目录 |
| `resolve.alias` | `Record<string, string>` | — | 路径别名 |
| `resolve.dedupe` | `string[]` | — | 强制统一依赖版本 |
| `resolve.conditions` | `string[]` | — | 包导出条件 |
| `resolve.extensions` | `string[]` | `['.mjs','.js','.mts','.ts','.jsx','.tsx','.json']` | 省略扩展名时尝试顺序 |
| `resolve.preserveSymlinks` | `boolean` | `false` | 是否跟随符号链接 |
| `css.modules` | `object` | — | CSS Modules 配置 |
| `css.postcss` | `string \| object` | — | PostCSS 配置 |
| `css.preprocessorOptions` | `Record<string, object>` | — | 预处理器的额外配置 |
| `css.devSourcemap` | `boolean` | `false` | 开发模式 CSS source map |
| `css.transformer` | `'postcss' \| 'lightningcss'` | `'postcss'` | CSS 处理引擎 |
| `json.namedExports` | `boolean` | `true` | JSON 具名导入 |
| `json.stringify` | `boolean \| 'auto'` | `'auto'` | JSON 预序列化 |
| `assetsInclude` | `string \| RegExp \| (string \| RegExp)[]` | — | 额外静态资源匹配 |
| `logLevel` | `'info' \| 'warn' \| 'error' \| 'silent'` | `'info'` | 日志级别 |
| `clearScreen` | `boolean` | `true` | 是否清屏 |
| `envDir` | `string` | `root` | `.env` 文件目录 |
| `envPrefix` | `string \| string[]` | `'VITE_'` | 暴露给客户端变量前缀 |
| `appType` | `'spa' \| 'mpa' \| 'custom'` | `'spa'` | 应用类型 |

---

### 服务器选项（Server Options）

| 选项 | 类型 | 默认值 | 作用 |
|------|------|--------|------|
| `server.host` | `string \| boolean` | `'localhost'` | 监听地址 |
| `server.port` | `number` | `5173` | 监听端口 |
| `server.strictPort` | `boolean` | `false` | 端口被占用是否报错退出 |
| `server.https` | `boolean \| object` | `false` | HTTPS |
| `server.open` | `boolean \| string` | `false` | 自动打开浏览器 |
| `server.proxy` | `Record<string, object>` | — | 请求代理 |
| `server.cors` | `boolean \| object` | `true` | CORS |
| `server.headers` | `Record<string, string>` | — | 自定义响应头 |
| `server.hmr` | `boolean \| object` | `true` | 热更新 |
| `server.watch` | `object` | — | chokidar 文件监听选项 |
| `server.middlewareMode` | `boolean` | `false` | 中间件模式 |
| `server.fs.strict` | `boolean` | `true` | 限制访问工作区外文件 |
| `server.fs.allow` | `string[]` | — | 额外允许访问的目录 |
| `server.fs.deny` | `string[]` | `['.env','.env.*','*.{pem,crt}']` | 禁止访问的文件 |

---

### 构建选项（Build Options）

| 选项 | 类型 | 默认值 | 作用 |
|------|------|--------|------|
| `build.target` | `string \| string[]` | `'baseline-widely-available'` | 浏览器兼容目标 |
| `build.outDir` | `string` | `'dist'` | 输出目录 |
| `build.assetsDir` | `string` | `'assets'` | 静态资源子目录 |
| `build.assetsInlineLimit` | `number` | `4096` | 内联 base64 阈值（字节） |
| `build.cssCodeSplit` | `boolean` | `true` | CSS 分割 |
| `build.cssMinify` | `boolean \| 'lightningcss' \| 'esbuild'` | `'lightningcss'` | CSS 压缩引擎 |
| `build.cssTarget` | `string \| string[]` | 同 `build.target` | CSS 压缩目标浏览器 |
| `build.sourcemap` | `boolean \| 'inline' \| 'hidden'` | `false` | source map |
| `build.rolldownOptions` | `object` | — | Rolldown 打包配置 |
| `build.minify` | `boolean \| 'oxc' \| 'terser'` | `'oxc'` | JS 压缩 |
| `build.terserOptions` | `object` | — | Terser 额外配置 |
| `build.write` | `boolean` | `true` | 是否写入磁盘 |
| `build.emptyOutDir` | `boolean` | `true` | 构建前清空输出目录 |
| `build.copyPublicDir` | `boolean` | `true` | 是否复制 public 目录 |
| `build.lib` | `object` | — | 库模式配置 |
| `build.manifest` | `boolean \| string` | `false` | 生成资产清单 |
| `build.ssrManifest` | `boolean \| string` | `false` | SSR 清单 |
| `build.ssr` | `boolean \| string` | `false` | SSR 构建 |
| `build.chunkSizeWarningLimit` | `number` | `500` | chunk 大小警告阈值 (KB) |
| `build.watch` | `object \| null` | `null` | 构建监听模式 |
| `build.dynamicImportVarsOptions` | `object` | — | 动态导入变量配置 |
| `build.license` | `boolean \| object` | `false` | 生成许可证文件 |
| `build.chunkImportMap` | `boolean` | `false` | 🧪 实验性 Import Maps |

---

### 依赖优化选项（Dep Optimization Options）

| 选项 | 类型 | 默认值 | 作用 |
|------|------|--------|------|
| `optimizeDeps.entries` | `string \| string[]` | `'index.html'` | 入口文件 |
| `optimizeDeps.exclude` | `string[]` | — | 排除的依赖 |
| `optimizeDeps.include` | `string[]` | — | 强制预构建的依赖 |
| `optimizeDeps.esbuildOptions` | `object` | — | esbuild 选项 |
| `optimizeDeps.holdUntilCrawlEnd` | `boolean` | `true` | 是否等待依赖扫描完成 |

---

### 预览选项（Preview Options）

| 选项 | 类型 | 默认值 | 作用 |
|------|------|--------|------|
| `preview.host` | `string \| boolean` | `'localhost'` | 监听地址 |
| `preview.port` | `number` | `4173` | 监听端口 |
| `preview.strictPort` | `boolean` | `false` | 端口冲突是否退出 |
| `preview.https` | `boolean \| object` | `false` | HTTPS |
| `preview.open` | `boolean \| string` | `false` | 自动打开浏览器 |
| `preview.proxy` | `Record<string, object>` | — | 请求代理 |
| `preview.cors` | `boolean \| object` | `true` | CORS |
| `preview.headers` | `Record<string, string>` | — | 自定义响应头 |

---

### SSR 选项（SSR Options）

| 选项 | 类型 | 默认值 | 作用 |
|------|------|--------|------|
| `ssr.external` | `string[]` | — | SSR 外部化依赖 |
| `ssr.noExternal` | `string \| RegExp \| (string \| RegExp)[]` | — | 不外部化的依赖 |
| `ssr.target` | `'node' \| 'webworker'` | `'node'` | SSR 构建目标 |

---

### Worker 选项（Worker Options）

| 选项 | 类型 | 默认值 | 作用 |
|------|------|--------|------|
| `worker.format` | `'es' \| 'iife'` | `'iife'` | worker 打包格式 |
| `worker.plugins` | `Plugin[]` | — | worker 专用插件 |
| `worker.rolldownOptions` | `object` | — | worker 打包 Rolldown 选项 |
