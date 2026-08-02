# Vite 插件是否可以放在单独文件中？

> 来源：[Vite v8.1.4 Plugin API 文档](https://vite.dev/guide/api-plugin.html)

---

## 结论：可以，而且是推荐做法

Vite 官方文档明确指出：

> 你可以在 `vite.config.js` 中直接定义插件，**无需创建独立的 npm 包**。

这意味着：
- ✅ 插件可以写在单独的文件中
- ✅ 不一定要发布成 npm 包
- ✅ 只在当前项目使用的插件，放本地文件即可
- ✅ 如果多个项目复用，再考虑发布为 `vite-plugin-xxx`

---

## 基本模式

插件本质上是一个**工厂函数**，返回包含钩子的对象：

```ts
// plugins/my-plugin.ts
import type { Plugin } from 'vite'

export default function myPlugin(): Plugin {
  return {
    name: 'my-plugin',        // ⚠️ 必须：用于日志和错误提示
    enforce: 'pre',           // 可选：控制执行顺序

    // === 通用钩子（继承自 Rolldown）===
    resolveId(id) { /* ... */ },
    load(id) { /* ... */ },
    transform(code, id) { /* ... */ },

    // === Vite 专用钩子 ===
    config(config) { /* ... */ },
    configResolved(config) { /* ... */ },
    configureServer(server) { /* ... */ },
    transformIndexHtml(html) { /* ... */ },
    handleHotUpdate(ctx) { /* ... */ },
  }
}
```

然后在 `vite.config.ts` 中导入使用：

```ts
// vite.config.ts
import myPlugin from './plugins/my-plugin'

export default defineConfig({
  plugins: [
    myPlugin()      // 调用工厂函数
  ]
})
```

---

## 本项目的实际情况

当前项目的所有 3 个自定义插件都写在 `vite.config.ts` 内部：

```ts
// 全部在 vite.config.ts 中定义
const copyJsFilesPlugin: Plugin = { /* ... */ }        // 第 42-64 行
const copyVercelConfigPlugin: Plugin = { /* ... */ }   // 第 66-79 行
const generateOgImagesPlugin: Plugin = { /* ... */ }   // 第 81-113 行
```

可以重构为：

```
src/
└── plugins/
    ├── copy-js-files.ts         // copyJsFilesPlugin
    ├── copy-vercel-config.ts    // copyVercelConfigPlugin
    └── generate-og-images.ts    // generateOgImagesPlugin
```

---

## 插件可用的全部生命周期钩子

### 通用钩子（Rolldown 兼容，dev + build 均调用）

| 钩子 | 时机 | 说明 |
|------|------|------|
| `options` | 开始 | 读取并修改 Rolldown 选项 |
| `buildStart` | 开始 | 构建开始时调用 |
| `resolveId` | 解析 | 自定义模块路径解析 |
| `load` | 加载 | 自定义模块加载 |
| `transform` | 转换 | 转换模块代码 |
| `buildEnd` | 结束 | 构建结束时调用（无论成功失败） |
| `closeBundle` | 结束 | bundle 关闭时调用 |

### Vite 专用钩子

| 钩子 | 说明 |
|------|------|
| `config(config, env)` | 在解析配置**前**修改用户配置，可返回部分配置对象进行合并 |
| `configResolved(config)` | 获得最终解析完成的配置（只读） |
| `configureServer(server)` | 配置开发服务器，可添加中间件 |
| `configurePreviewServer(server)` | 配置预览服务器 |
| `transformIndexHtml(html)` | 转换 `index.html` 内容 |
| `handleHotUpdate(ctx)` | 自定义 HMR 更新逻辑 |

### 本项目中用到的钩子

| 自定义插件 | 使用的钩子 | 作用 |
|-----------|-----------|------|
| `copyJsFilesPlugin` | `buildEnd` | 构建完成后拷贝 JS 文件到 dist |
| `copyVercelConfigPlugin` | `buildEnd` | 构建完成后拷贝 vercel.json 到 dist |
| `generateOgImagesPlugin` | `writeBundle` | 写盘时生成 OG 封面 SVG |

---

## 常见用法：条件应用

```ts
export default function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    apply: 'build',       // 只在构建时启用
    // apply: 'serve',    // 或只在开发时启用
    // apply(config, { command }) { return command === 'build' }

    buildEnd() { /* ... */ }
  }
}
```

---

## 常见用法：控制执行顺序

```ts
{
  name: 'my-plugin',
  enforce: 'pre',    // 在核心插件之前执行
  // enforce: 'post' // 在核心插件之后执行
}
```

执行顺序：`Alias` → `pre 插件` → `Vite 核心插件` → `普通插件` → `Vite 构建插件` → `post 插件`

---

## 路径规范化

Vite 内部使用 POSIX 分隔符（`/`），处理路径时需规范化：

```ts
import { normalizePath } from 'vite'

normalizePath('src\\components\\Header.vue')  // → 'src/components/Header.vue'
```

---

## 文件过滤

推荐使用 `@rollup/pluginutils` 的 `createFilter`：

```ts
import { createFilter } from '@rollup/pluginutils'

const filter = createFilter(include, exclude)
// filter('src/foo.ts') → true/false
```
