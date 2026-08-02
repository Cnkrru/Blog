---
title: 导航站点从Docsify迁移至VitePress
date: 2026-07-29
category: 前端
tags: [前端, VitePress, Docsify, 导航站, 站点迁移]
description: 将个人导航站点从Docsify v4迁移至VitePress的完整记录，包含旧配置存档、迁移原因以及VitePress配置详情。
keywords: Docsify, VitePress, 导航站, 站点迁移, 静态站点生成器, SSG
---

## 迁移背景

我的导航站点（`nav`）原先使用 **Docsify v4** 搭建，托管于 GitHub Pages。Docsify 是一个运行时渲染的文档生成器，通过 CDN 引入 JS 在浏览器端动态渲染 Markdown，无需构建步骤。

经过一段时间使用，决定迁移至 **VitePress**，主要原因：

1. **构建时渲染**：VitePress 在构建时生成静态 HTML，首屏加载更快、SEO 更友好
2. **Vite 生态**：与博客项目共用 Vite 技术栈，降低维护成本
3. **更好的开发体验**：热更新、TypeScript 支持、丰富的主题定制能力
4. **无需运行时依赖 CDN**：Docsify 的所有功能依赖 CDN（框架、搜索、分页等插件），VitePress 构建后完全自包含
5. **统一技术栈**：博客已使用 Vite + Vue 3，导航站统一到 VitePress 后更易维护，同时方便后续迁移至自建 Vue 博客

## 旧 Docsify 配置存档

以下是迁移前的完整配置，留作记录。

### 项目结构

```
nav/
├── index.html          # 主入口（含所有配置和自定义样式/脚本）
├── index.md            # 首页内容
├── _sidebar.md         # 侧边栏导航
├── _404.md             # 404 页面
├── .nojekyll           # GitHub Pages 禁用 Jekyll
├── README.md
└── pages/
    ├── tools.md        # 工具网站
    ├── learning.md     # 学习网站
    ├── entertainment.md # 娱乐休闲
    ├── dev-tools.md    # 开发工具
    ├── game.md         # 游戏网站
    ├── software.md     # 软件推荐
    └── contact.md      # 联系我们
```

### Docsify 核心配置

```javascript
window.$docsify = {
  name: '导航',
  nameLink: true,
  homepage: 'index.md',
  themeColor: '#3F51B5',
  auto2top: true,
  loadSidebar: true,
  autoHeader: true,
  loadNavbar: false,
  mergeNavbar: false,
  notFoundPage: true,
  relativePath: true,
  topMargin: 90,

  search: {
    maxAge: 86400000,
    paths: 'auto',
    placeholder: '搜索',
    noData: '没有结果',
    depth: 6,
    hideOtherSidebarContent: false,
  },

  ga: 'UA-XXXXX-Y',

  pagination: {
    previousText: '上一章',
    nextText: '下一章',
    crossChapter: true,
    crossChapterText: true,
  },

  footer: {
    copy: '<span>&copy; 2026 </span>',
    auth: 'Cnkrru power by docsify',
    pre: '<hr/>',
    style: 'text-align: center;',
  },
}
```

### 自定义样式系统

旧站点使用 CSS 变量实现亮色/深色双主题：

| 变量 | 亮色 | 深色 |
|---|---|---|
| `--primary-color` | `#3F51B5` | `#64b5f6` |
| `--bg-color` | `#ffffff` | `#1a1a1a` |
| `--text-color` | `#333333` | `#e0e0e0` |
| `--card-bg` | `#ffffff` | `#2d2d2d` |
| `--card-border` | `#eaecef` | `#404040` |
| `--sidebar-bg` | `#ffffff` | `#2d2d2d` |

卡片使用 CSS Grid 响应式布局：`grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`，hover 时上浮 8px + 阴影增强。

### CDN 插件依赖

| 插件 | CDN 地址 |
|---|---|
| Docsify 核心 | `cdn.jsdelivr.net/npm/docsify@4` |
| Vue 主题 | `docsify/lib/themes/vue.css` |
| 搜索 | `docsify/lib/plugins/search.min.js` |
| Google Analytics | `docsify/lib/plugins/ga.min.js` |
| 分页 | `docsify-pagination/dist/docsify-pagination.min.js` |
| 页脚 | `unpkg.com/docsify-footer-enh` |
| 侧边栏折叠 | `docsify-sidebar-collapse` |

### 自定义 JavaScript

- **深色模式切换**：通过 `localStorage` 持久化，切换 `body.dark-mode` class
- **加载动画**：旋转 spinner，`window.load` 后 500ms 隐藏
- **返回顶部**：监听 scroll 事件超过 300px 显示按钮

### 侧边栏结构

```markdown
* [工具网站](/pages/tools.md)
* [学习网站](/pages/learning.md)
* [娱乐休闲](/pages/entertainment.md)
* [开发工具](/pages/dev-tools.md)
* [游戏网站](/pages/game.md)
* [软件推荐](/pages/software.md)
* [联系我们](/pages/contact.md)
```

共 7 个分类，涵盖 35+ 个网站链接，全部使用 HTML 卡片组件渲染。

### 页面列表

| 页面 | 内容 | 链接数 |
|---|---|---|
| 工具网站 | Convertio、IP查询 | 2 |
| 学习网站 | 菜鸟教程、Z-Library | 2 |
| 娱乐休闲 | 落雪音乐、Kazumi、Venera | 3 |
| 开发工具 | VSCode、VS、JetBrains、Trae、Cursor、Kiro、Arduino、Git | 8 |
| 游戏网站 | Steam、Epic、育碧、EA、UU、雷神、Steam++、OpenSpeedy | 8 |
| 软件推荐 | 图吧工具箱、Everything、Geek、7-Zip、Bandizip、Wisec、WinTune、OBS、VLC、Snipaste、Obsidian | 11 |
| 联系我们 | GitHub、邮箱 | 1 |

合计 **35 个导航链接**。

## 新 VitePress 配置

迁移后使用 VitePress 搭建，配置如下：

### 项目结构

```
nav/
├── .vitepress/
│   ├── config.mjs          # VitePress 配置
│   └── theme/
│       ├── index.js        # 主题入口
│       └── style.css       # 自定义样式
├── index.md                # 首页
├── tools.md                # 工具网站
├── learning.md             # 学习网站
├── entertainment.md        # 娱乐休闲
├── dev-tools.md            # 开发工具
├── game.md                 # 游戏网站
├── software.md             # 软件推荐
├── contact.md              # 联系我们
├── package.json
└── start.bat
```

### VitePress 配置要点

- 保留原有卡片式 HTML 布局，通过自定义 CSS 注入
- 使用 VitePress 原生侧边栏替代 docsify `_sidebar.md`
- 内置搜索替代 docsify 搜索插件
- VitePress 原生深色模式替代自定义 theme toggle
- 构建输出到 `dist/`，可直接部署

## 总结

从 Docsify 到 VitePress 的迁移是一次技术栈升级。Docsify 适合快速搭建文档站，而 VitePress 在构建性能、SEO、开发体验方面更有优势。迁移后导航站与博客共享 Vite 生态，维护更加便利。
