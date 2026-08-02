# Vite 配置文件 `vite.config.ts` 详解

> 来源：[Vite v8.1.4 官方文档](https://vite.dev/config/)

---

## 一、是什么

`vite.config.ts` 是 Vite 的**配置文件**（原生支持 TypeScript）。当运行 `vite` 命令时，Vite 会自动解析项目根目录下的 `vite.config.js` 或 `vite.config.ts`。

最简形式：

```ts
// vite.config.ts
export default {
  // 配置选项
}
```

也可以通过 `--config` 显式指定：

```bash
vite --config my-config.js
```

---

## 二、用途

配置文件用于**自定义 Vite 的开发服务器、构建行为、插件**等一切行为，主要包括：

| 场景 | 配置什么 |
|------|---------|
| 开发 | 端口号、代理、HMR、host |
| 构建 | 输出目录、压缩方式、代码分割、sourcemap |
| 路径 | 根目录、别名、公共基础路径 |
| 插件 | 加载官方/社区/自定义插件 |
| 环境 | 环境变量前缀、模式切换 |

---

## 三、`defineConfig` 辅助函数

`defineConfig` 是 Vite 提供的内置工具函数，纯粹为了**TypeScript 类型提示**，实际运行时不改变任何行为。

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  // IDE 会在此处自动补全所有 Vite 配置项，并提供类型检查
  server: { port: 3000 },
  build: { outDir: 'dist' }
})
```

### 支持函数式写法

```ts
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return { /* 开发专用 */ }
  } else {
    return { /* 构建专用 */ }
  }
})
```

### 支持异步写法

```ts
export default defineConfig(async ({ command, mode }) => {
  const data = await fetchConfig()
  return { /* ... */ }
})
```

### 等价写法（不需要 import）

```ts
import type { UserConfig } from 'vite'

export default {
  // ...
} satisfies UserConfig
```

---

## 四、配置选项完整分类

### 4.1 共享选项（Shared Options）

适用于 `dev`、`build`、`preview` 三种模式：

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `root` | `string` | `process.cwd()` | 项目根目录（含 `index.html` 的目录） |
| `base` | `string` | `'/'` | 公共基础路径，也可设为 `'./'`（嵌入式部署） |
| `mode` | `string` | `'development'` / `'production'` | 运行模式 |
| `define` | `Record<string, string>` | — | 全局常量替换（构建时静态替换） |
| `plugins` | `(Plugin \| Plugin[])[]` | — | 插件数组，忽略假值，展平嵌套 |
| `publicDir` | `string \| false` | `'public'` | 静态资源目录 |
| `cacheDir` | `string` | `'node_modules/.vite'` | 缓存目录，`--force` 可强制重建 |
| `resolve.alias` | `Record<string, string>` | — | 导入别名（如 `'@' → './src'`） |
| `resolve.extensions` | `string[]` | `['.mjs','.js','.mts','.ts','.jsx','.tsx','.json']` | 省略扩展名时的尝试顺序 |
| `logLevel` | `'info' \| 'warn' \| 'error' \| 'silent'` | `'info'` | 日志级别 |
| `envDir` | `string` | `root` | 加载 `.env` 文件的目录 |
| `envPrefix` | `string \| string[]` | `'VITE_'` | 暴露给客户端的变量前缀（不能为空串） |
| `appType` | `'spa' \| 'mpa' \| 'custom'` | `'spa'` | 应用类型 |

### 4.2 开发服务器选项（Server Options）

仅 `vite dev` 生效：

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `server.host` | `string` | `'localhost'` | 监听地址 |
| `server.port` | `number` | `5173` | 监听端口 |
| `server.https` | `boolean \| object` | `false` | 是否启用 HTTPS |
| `server.proxy` | `Record<string, object>` | — | 代理配置（API 请求转发） |
| `server.open` | `boolean \| string` | `false` | 启动时自动打开浏览器 |
| `server.hmr` | `boolean \| object` | `true` | 热更新配置 |
| `server.watch` | `object` | — | chokidar 文件监听选项 |

### 4.3 构建选项（Build Options）

仅 `vite build` 生效：

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `build.outDir` | `string` | `'dist'` | 输出目录 |
| `build.assetsDir` | `string` | `'assets'` | 静态资源子目录 |
| `build.assetsInlineLimit` | `number` | `4096` (4KB) | 小于此值的资源内联为 base64 |
| `build.cssCodeSplit` | `boolean` | `true` | 是否分割异步 chunk 中的 CSS |
| `build.cssMinify` | `boolean \| 'lightningcss' \| 'esbuild'` | `'lightningcss'` | CSS 压缩引擎 |
| `build.sourcemap` | `boolean \| 'inline' \| 'hidden'` | `false` | 是否生成 source map |
| `build.minify` | `boolean \| 'oxc' \| 'terser'` | `'oxc'` | JS 压缩引擎 |
| `build.terserOptions` | `object` | — | Terser 额外配置（如 `drop_console`） |
| `build.target` | `string \| string[]` | `'baseline-widely-available'` | 浏览器兼容目标 |
| `build.emptyOutDir` | `boolean` | `true` | 构建前清空输出目录 |
| `build.copyPublicDir` | `boolean` | `true` | 是否复制 `publicDir` 到输出目录 |
| `build.chunkSizeWarningLimit` | `number` | `500` (KB) | chunk 大小警告阈值 |
| `build.lib` | `object` | — | 库模式配置 |
| `build.manifest` | `boolean \| string` | `false` | 生成资产清单文件 |
| `build.ssr` | `boolean \| string` | `false` | SSR 构建模式 |

### 4.4 依赖优化选项（Dep Optimization Options）

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `optimizeDeps.entries` | `string \| string[]` | `'index.html'` | 入口文件 |
| `optimizeDeps.exclude` | `string[]` | — | 排除的依赖（不预构建） |
| `optimizeDeps.include` | `string[]` | — | 强制预构建的依赖 |
| `optimizeDeps.esbuildOptions` | `object` | — | esbuild 构建选项 |

### 4.5 SSR 选项（SSR Options）

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `ssr.external` | `string[]` | — | SSR 外部化依赖 |
| `ssr.noExternal` | `string \| RegExp \| (string \| RegExp)[]` | — | 不外部化的依赖 |
| `ssr.target` | `'node' \| 'webworker'` | `'node'` | SSR 构建目标 |

### 4.6 预览选项（Preview Options）

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `preview.host` | `string` | `'localhost'` | 监听地址 |
| `preview.port` | `number` | `4173` | 监听端口 |
| `preview.open` | `boolean \| string` | `false` | 自动打开浏览器 |

### 4.7 Worker 选项（Worker Options）

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `worker.format` | `'es' \| 'iife'` | `'iife'` | worker 打包格式 |
| `worker.plugins` | `Plugin[]` | — | worker 专用插件 |
| `worker.rolldownOptions` | `object` | — | worker 打包容器的 Rollup 选项 |

---

## 五、配置文件工作原理

### 加载机制

1. 默认使用 **Rolldown** 将配置打包为临时文件后加载
2. 可通过 `--configLoader runner` 切换到模块运行器模式
3. 可通过 `--configLoader native` 使用 Node 原生 TS 支持（但不会检测文件变更）

### 环境变量加载时机

配置文件求值时，`.env` 文件**尚未自动加载**到 `process.env`。如需在配置中使用 `.env` 变量，需手动调用 `loadEnv`：

```ts
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    server: { port: +(env.APP_PORT || 5173) }
  }
})
```

### 条件配置

根据 `command`、`mode`、`isSsrBuild`、`isPreview` 返回不同配置：

```ts
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return { /* 开发配置 */ }
  }
  if (mode === 'staging') {
    return { /* 预发布配置 */ }
  }
  return { /* 生产配置 */ }
})
```

---

## 六、本项目中实际用到的配置

```ts
export default defineConfig({
  base: '/',                           // 公共基础路径
  server: { https: false },            // 禁用 HTTPS（本地开发）
  resolve: {
    alias: { '@': './src' }            // @ 别名 → src/
  },
  optimizeDeps: {
    exclude: ['*.md']                  // 不预构建 .md 文件
  },
  build: {
    cssCodeSplit: true,                // 分割 CSS
    minify: 'terser',                  // 用 terser 压缩
    terserOptions: {
      compress: {
        drop_console: true,            // 移除 console
        drop_debugger: true            // 移除 debugger
      }
    },
    cssMinify: 'esbuild',              // CSS 用 esbuild 压缩
    sourcemap: false,                  // 不生成 source map
    chunkSizeWarningLimit: 1000,       // 1MB chunk 警告阈值
    rollupOptions: {
      external: ['**/*.md'],           // .md 文件不打包
      output: {
        manualChunks: manualChunks     // 自定义分包策略
      }
    }
  },
  plugins: [
    vue(),                             // 编译 .vue 文件
    Pages({ /* ... */ }),              // 文件系统路由
    copyJsFilesPlugin,                 // 拷贝特效 JS 到 dist
    copyVercelConfigPlugin,            // 拷贝 vercel.json 到 dist
    generateOgImagesPlugin             // 构建时生成 OG 封面图
  ],
  ssgOptions: { /* ... */ }            // vite-ssg 插件配置
})
```
