---
order: 9
title: express-3-前后端分离，单端口服务配置
date: 2026-10-31
category: 后端
tags: [express, serverPanel]
description: 记录express项目前后端分离，但是一个端口起前后端的配置
keywords: express
---

## 简介

笔者第一次做后端，不想前后端分离，那样要处理跨域，很麻烦，但是又想用vue这个前端框架

- `express.static(path)`这个方法可以实现后端服务起前端页面，但是只能是纯HTML+CSS+JS
- 笔者准备前端部分用vue，将构建产物挂载到`express.static()`方法上

```info
这里笔者直接初始化vue+express，各自一个文件夹，互不干扰
- 这里也算是正式开始做第一个前后端的个人项目了(serverPanel),给服务器做一个面板，试过宝塔面板，但是一堆广告，不想用，准备自己做一个轻量版本的
```

## 步骤

### 1. 初始化express项目

- 关于express初始化，请参考
  - [express-1-初次体验](post-1)
  - [express-2-drizzle+sqlite配置](post-2)
  - [typescript-代码规范工具配置](post-7)

### 2. 初始化vue项目

- 这里是在项目的子文件夹`client`初始化vue项目

```terminal
$ npm create vue@latest client

> express@1.0.0 npx
> create-vue client

T  Vue.js - The Progressive JavaScript Framework
|
o  是否使用 TypeScript 语法？
|  Yes
|
o  请选择要包含的功能： (↑/↓ 切换，空格选择，a 全选，回车确认)
|  Router（单页面应用开发）, Linter（错误预防）,
|  Prettier（代码格式化）
|
o  选择要包含的试验特性： (↑/↓ 切换，空格选择，a 全选，回车确认)
|  none
|
o  跳过所有示例代码，创建一个空白的 Vue 项目？
|  No
```

#### vue初始化后的项目文件结构

- 代码规范工具和项目框架都初始好了

```filetree
- .vscode/ | 编辑器配置
  - extensions.json
  - settings.json
- public/ | 公共静态资源
  - favicon.ico
- src/ | 源码目录
  - assets/ | 静态资源
    - base.css
    - logo.svg
    - main.css
  - components/ | 通用组件
    - icons/
      - IconCommunity.vue
      - IconDocumentation.vue
      - IconEcosystem.vue
      - IconSupport.vue
      - IconTooling.vue
    - HelloWorld.vue
    - TheWelcome.vue
    - WelcomeItem.vue
  - router/ | 路由配置
    - index.ts
  - views/ | 页面视图
    - AboutView.vue
    - HomeView.vue
  - App.vue | 根组件
  - main.ts | 入口文件
- .editorconfig | 缩进与换行约定
- .gitattributes
- .gitignore
- .oxlintrc.json | oxlint 配置
- .prettierrc.json | prettier 配置
- env.d.ts | 环境类型声明
- eslint.config.ts | eslint 配置
- index.html | 入口 HTML
- package-lock.json
- package.json
- README.md
- tsconfig.app.json | 应用侧 TS 配置
- tsconfig.json
- tsconfig.node.json | 构建侧 TS 配置
- vite.config.ts | vite 配置
```

### 3. 修改后端配置文件

```tip
这里主要是需要检查一下`eslint.config.mjs`,`tsconfig.json`,`package.json`,不能直接把原来的照搬过来，需要把原本挂载纯HTML，CSS，JS前端的部分去掉
- 由于每个人的配置可能不相同，这里不细说,只给出笔者的配置
- 主要是这些配置需要查文档，学习之后，配置起来才比较明白，笔者一般是用到什么查什么，有时候是项目初始化直接配置好的，有时候是AI帮忙配置的，笔者也只了解配置过的选项，没配置过的笔者不会主动去学，在笔者看来，用到什么再去学对应东西，更有效
```

#### 1. package.json的prettier的配置

```diff
-    "format": "prettier --write --no-error-on-unmatched-pattern",
-    "format:check": "prettier --check --no-error-on-unmatched-pattern",
+    "format": "prettier --write .",
+    "format:check": "prettier --check .",
```

#### 2. index.ts挂载前端构建产物

```ts
const clientDist = fileURLToPath(new URL('../../client/dist', import.meta.url))
app.use(express.static(clientDist))
```

- 这个主要是原来一份prettier管后端和前端静态文件两部分，现在分离了，把前端部分去掉

### 4. 前端vite.config.ts配置

- 将请求的`/api`路由转发到本机的3000端口

```diff
+ server: {
+  proxy: {
+    '/api': 'http://localhost:3000',
+  },
+ },
```

### 5. 启动项目

- 在client文件夹起一个终端

```sh
npm run dev
```

- 在server文件夹起一个终端

```sh
npm run dev
```

```tip
这里后端部分启动服务后进入3000端口会看到vue项目初始化的页面，因为前端配置了端口转发，把页面转发到了3000
如果想看后端部分
- localhost:3000/<后端路径>
- localhost:3000/api-docs
    - swagger文档
```
