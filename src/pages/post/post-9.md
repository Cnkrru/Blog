---
title: VitePress-1-快速开始
date: 2026-04-21
category: 前端
tags: [前端, VitePress]
description: 详细介绍VitePress-1-快速开始。
keywords: VitePress, 快速开始
---
### 准备工作
>- 安装Node.js
>- 安装git bash(不强求但推荐)
---

### 构建步骤
- 安装VitePress
   ```bash

    npm add -D vitepress@next
   ```
- 初始化VitePress
   ```bash

    npx vitepress init
   ```
- 初始化选项
1.在哪里初始化:这里默认'./'，可以自己手动输入一个名字，作为文件夹名，比如:'./docs'
2.vitepress在哪里读取你的md文件，官方推荐和自己初始化的文件夹一个位置，比如:'./docs'
3.命名站点:这里默认显示'My Awesome Project',你可以根据自己的项目名称来命名。
4.站点描述:这里默认显示'A VitePress Site',你可以根据自己的项目描述来修改。
5.选择主题:这里默认选择'Default Theme'（默认主题，和Vitepress官网样式一样）,你可以自己选择别的。
6.三个配置:后面三个配置，都直接yes即可，如果没学过前端，可能不知道在说什么


- 文件夹初始结构
.
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  ├─ api-examples.md
│  ├─ markdown-examples.md
│  └─ index.md
└─ package.json

- 修改配置文件来完善VitePress配置
- 本地运行VitePress
   ```bash

    npm run docs:dev
   ```
   访问http://localhost:[port]查看效果
- 构建VitePress
   ```bash

    npm run docs:build
   ```
- 预览build
   ```bash

    npm run docs:preview
   ```
   访问http://localhost:[port]查看效果

- 部署VitePress
   选择一个服务器部署，比如GitHub Pages
---
> 如有建议，请联系我,邮箱:3253884026@qq.com
