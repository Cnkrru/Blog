---
title: VitePress-1-快速开始
date: 2026-04-23
category: 前端
tags: [前端, VitePress]
description: 详细介绍VitePress-1-快速开始。
keywords: VitePress, 快速开始
---
### 准备工作
> - 安装Node.js(用于安装vitepress)
> - 安装git bash(不强求但推荐，用于提交代码到GitHub仓库)
---
### 构建步骤
1. 安装VitePress
   ```bash
    npm add -D vitepress@next
   ```
2. 初始化VitePress
   ```bash
    npx vitepress init
   ```
3. 初始化选项
   1. 在哪里初始化:这里默认'./'，可以自己手动输入一个名字，作为文件夹名，比如:'./docs'
   2. vitepress在哪里读取你的md文件，官方推荐和自己初始化的文件夹一个位置，比如:'./docs'
   3. 命名站点:这里默认显示'My Awesome Project',你可以根据自己的项目名称来命名。
   4. 站点描述:这里默认显示'A VitePress Site',你可以根据自己的项目描述来修改。
   5. 选择主题:这里默认选择'Default Theme'（默认主题，和Vitepress官网样式一样）,你可以自己选择别的。
   6. 三个配置:后面三个配置，都直接yes即可，如果没学过前端，可能不知道在说什么

4. 文件夹初始结构
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  ├─ api-examples.md
│  ├─ markdown-examples.md
│  └─ index.md
└─ package.json

5. 修改配置文件来完善VitePress配置
6. 本地运行VitePress
   ```bash
    npm run docs:dev
   ```
   访问http://localhost:[port]查看效果
7. 构建VitePress
   ```bash
    npm run docs:build
   ```
8. 构建预览
   ```bash
    npm run docs:preview
   ```
   访问http://localhost:[port]查看效果

10. 部署VitePress
   - 选择一个服务器部署，比如GitHub Pages
   - 推荐vercel，CDN节点多，中国访问快，也可以买个域名去cloudflare配置CDN，再到vercel配置，两者联动，中国访问友好
---
> 编辑于2026-04-23
> 作者：Cnkrru
> 联系方式：3253884026@qq.com
