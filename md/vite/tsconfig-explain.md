# 本项目 TypeScript 配置详解

## 概览

项目有两个 `tsconfig` 文件，通过 **Project References**（项目引用）关联：

| 文件 | 用途 | 严格模式 | 作用域 |
|------|------|:---:|------|
| `tsconfig.json` | 浏览器端源码 | ❌ `strict: false` | `src/**/*` |
| `tsconfig.node.json` | Node.js 构建端 | ✅ `strict: true` | `vite.config.ts` + `src/plugins/` |

这种分离是 Vite 推荐的模式：浏览器代码和 Node 构建代码各有一套 TS 配置，互不干扰。

---

## `tsconfig.json` — 浏览器端配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "types": ["vite/client", "node"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue", "src/router/index.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

### 逐项解释

#### 📦 编译目标与模块

| 选项 | 值 | 说明 |
|------|-----|------|
| `target` | `"ES2020"` | 编译输出的 JS 标准。ES2020 支持可选链 `?.`、空值合并 `??`、动态 `import()` 等，现代浏览器都支持 |
| `module` | `"ESNext"` | 保留 ESM 的 `import/export` 语法不变，交给 Vite 处理打包 |
| `lib` | `["ES2020", "DOM", "DOM.Iterable"]` | 告诉 TS 哪些全局 API 可用：ES2020 标准库 + DOM API（`document`/`window`）+ 可迭代 DOM 集合 |

---

#### 🔍 类型检查

| 选项 | 值 | 说明 |
|------|-----|------|
| `strict` | `false` | ⚠️ 关闭严格模式，即 `strictNullChecks`、`strictFunctionTypes` 等全部不启用。意味着 `null`/`undefined` 不检查，`any` 类型的隐患不会被发现 |
| `noUnusedLocals` | `false` | 不检查未使用的局部变量（`let x = 1` 没用到不会报错） |
| `noUnusedParameters` | `false` | 不检查未使用的函数参数 |
| `noFallthroughCasesInSwitch` | `true` | 检查 `switch` 中是否有忘记写 `break` 的穿透 |

> ⚠️ `strict: false` 是本项目最大的类型安全隐患，建议后续逐步开启。

---

#### 🗺️ 模块解析

| 选项 | 值 | 说明 |
|------|-----|------|
| `moduleResolution` | `"bundler"` | 模拟打包器（Vite/Rollup）的模块解析方式。支持省略扩展名、`package.json` 的 `exports` 字段等 |
| `baseUrl` | `"."` | 非相对路径导入的基准目录（项目根） |
| `paths` | `{"@/*": ["src/*"]}` | 路径映射：`import Header from '@/components/Header.vue'` 等价于 `import Header from 'src/components/Header.vue'` |
| `allowImportingTsExtensions` | `true` | 允许 import 时写 `.ts` 扩展名（如 `import './foo.ts'`），构建时 Vite 会处理 |
| `resolveJsonModule` | `true` | 允许直接 `import data from './config.json'`，会自动推导 JSON 的类型 |
| `isolatedModules` | `true` | 按文件独立编译（Vite/esbuild 的编译方式），防止某些需要全局分析的 TS 语法 |

---

#### 🎨 JSX 与构建

| 选项 | 值 | 说明 |
|------|-----|------|
| `jsx` | `"preserve"` | 保留 JSX 语法不转换，由 Vite + `@vitejs/plugin-vue` 处理 |
| `noEmit` | `true` | TS 不输出任何文件，只做类型检查。实际编译由 Vite 完成 |

---

#### ⚡ 其他

| 选项 | 值 | 说明 |
|------|-----|------|
| `useDefineForClassFields` | `true` | 使用 ES2022 标准语义定义类字段（与 `Class field declarations` 的行为对齐） |
| `skipLibCheck` | `true` | 跳过 `.d.ts` 类型声明文件的检查，大幅加速编译。不检查第三方库的类型错误 |
| `types` | `["vite/client", "node"]` | 引入 Vite 和 Node.js 的全局类型声明（如 `import.meta.env`、`process.env` 等） |

---

#### 📂 作用域

| 选项 | 值 | 说明 |
|------|-----|------|
| `include` | `["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue", "src/router/index.ts"]` | TS 的子项目只包含 `src/` 下源码，不包含根目录配置文件 |
| `references` | `[{"path": "./tsconfig.node.json"}]` | 引用 `tsconfig.node.json`，使 IDE 能跳转到对方项目的类型定义 |

---

## `tsconfig.node.json` — Node.js 构建端配置

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["vite.config.ts", "src/plugins/**/*.ts"]
}
```

| 选项 | 值 | 说明 |
|------|-----|------|
| `composite` | `true` | 启用项目引用模式。必须配合 `references` 使用，会生成 `.tsbuildinfo` 增量编译缓存 |
| `strict` | `true` | ✅ Node 端开启了严格模式（因为只涉及少量配置文件，不会像浏览器端那样大面积报错） |
| `skipLibCheck` | `true` | 跳过类型声明文件检查，加速编译 |
| `module` | `"ESNext"` | 输出 ESM 格式 |
| `moduleResolution` | `"bundler"` | 打包器模式解析 |
| `allowSyntheticDefaultImports` | `true` | 允许 `import React from 'react'` 这种写法（即使没有 `default` 导出） |
| `baseUrl` | `"."` | 同浏览器端 |
| `paths` | `{"@/*": ["src/*"]}` | 同浏览器端 |
| `include` | `["vite.config.ts", "src/plugins/**/*.ts"]` | 只管辖根目录的构建配置文件 |

---

## 两个 tsconfig 的关系图

```
tsconfig.json (浏览端)
  │
  ├─ compilerOptions (strict: false)
  ├─ include: src/**/*           ← 浏览器源码
  │
  └─ references ──────────────────────┐
                                      │
tsconfig.node.json (Node端)          │
  │                                   │
  ├─ compilerOptions (strict: true)  │
  │   └─ composite: true ◄───────────┘ (配合 references 使用)
  │
  └─ include: vite.config.ts       ← 构建配置
              src/plugins/**/*      ← 自定义插件
```

**好处**：IDE 打开 `vite.config.ts` 时用 Node 端的严格模式，打开 `src/App.vue` 时用浏览器端的宽松模式，各管各的。

---

## 与 Vite 的关系

`tsconfig.json` 只做**类型检查**，不参与实际编译。真正的编译由以下工具链完成：

```
TypeScript 源码 (.ts / .vue)
        │
        ├─ tsconfig.json      → IDE 类型检查 + 报错提示
        │
        └─ Vite + esbuild     → 实际编译 + 打包
           ├─ esbuild 处理 .ts → .js
           └─ @vitejs/plugin-vue 处理 .vue
```
