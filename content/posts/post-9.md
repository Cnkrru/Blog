---
title: SSG-vitepress
date: 2026-04-23
updated: 2026-08-07
category: 前端
tags: [前端]
history:
  - 2026-08-07 补充VitePress与Docsify对比分析
  - 2026-07-29 同步迁移经验到独立文章
description: 详细介绍VitePress-1-快速开始。
keywords: VitePress, 快速开始
---
### 准备工作
> 安装Node.js(用于安装vitepress)
> 安装git(不强求但推荐，用于提交代码到GitHub仓库)
1. node.js介绍
   - node是JavaScript后端运行环境，本地写的markdown文章经过JavaScript在node环境依照vitepress模板进行编译。输出HTML+CSS+JavaScript
   - JavaScript在前端的能力依赖浏览器API，在后端的能力依赖node，node可以看作JavaScript版本的python解释器
   - JavaScript这门语言最初设计是为了前端，后来依靠node具有后端能力
   - 这一部分本人不太清楚，JavaScript属于解释性语言还是编译性语言也不是很清楚，应该需要学习编译原理
2. git介绍
   - git是一种终端，如果你的电脑是Windows系统，可以看作类似于CMD和powershell的东西，它支持UNIX系的shell语法
   - UNIX和DOS是操作系统的两种分支，LUNIX是类UNIX系统，MAC是UNIX正统续作，两者类似，Windows是DOS的续作
   - git在这里用于和GitHub仓库进行连接，由LUNIX最初开发者Lunas开发（可能拼错了）
   - git也能执行那些挂载到环境变量的包管理器的shell子命令
---
### 构建步骤
1. 安装VitePress
   ```bash
    npm add -D vitepress@next
   ```
   > 给npm安装vitepress包
2. 初始化VitePress
   ```bash
    npx vitepress init
   ```
   > 初始化站点
3. 初始化选项
   1. 在哪里初始化:这里默认'./'，可以自己手动输入一个名字，作为文件夹名，比如:'./docs'
   2. vitepress在哪里读取你的md文件，官方推荐和自己初始化的文件夹一个位置，比如:'./docs'
   3. 命名站点:这里默认显示'My Awesome Project',你可以根据自己的项目名称来命名。
   4. 站点描述:这里默认显示'A VitePress Site',你可以根据自己的项目描述来修改。
   5. 选择主题:这里默认选择'Default Theme'（默认主题，和Vitepress官网样式一样）,你可以自己选择别的。
   6. 三个配置:后面三个配置，都直接yes即可，如果没学过前端，可能不知道在说什么
   > 可能不是最新版，笔者已将个人用vitepress搭建的站点迁移至本人制作的Cdocs站点生成器，后续不再使用vitepress。如遇疑问，请去官网了解

   > 中文官网地址：[vitepress](https://vitepress.dev/zh/)

4. 文件夹初始结构
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  ├─ api-examples.md
│  ├─ markdown-examples.md
│  └─ index.md
└─ package.json

> 如果选择使用JavaScript，而不是typescript，config文件是js文件，反之则是ts

> ts与js：ts会编译为js，写js和ts并无差异，只在于开发体验不同，ts相较于js更加完善

5. 修改配置文件来完善VitePress配置
> 在这里作者并未说明配置，个人配置已记录于本人笔记站点:[https://notes.cnkrru.top](https://notes.cnkrru.top)
6. 本地运行VitePress
   ```bash
    npm run docs:dev
   ```
> 访问http://localhost:[port]查看效果

> vite，vue项目端口号一般是5173，dev指令可以修改，应该在package.json，这个文件一般是JavaScript项目的配置文件
7. 构建VitePress
   ```bash
    npm run docs:build
   ```
> 一般不在本地构建产物，常见做法是推送到GITHUB，GITHUB Action自动构建，或者仓库连接vercel，vercel自动构建，不过要注意vercel上选择的node版本
8. 构建预览
   ```bash
    npm run docs:preview
   ```
> 不怎么用，`npm run docs:dev`一般就可以了，一键构建并预览
   访问http://localhost:[port]查看效果

10. 部署VitePress
   - 选择一个服务器部署，比如GitHub Pages，vercel，netlify，这三种都支持静态站点部署，也最为常见
   - 笔者刚接触前端时用GitHub，后来用vercel，netlify用过一次，但是不太熟悉
   - 推荐vercel，CDN节点多，中国访问快，也可以买个域名去cloudflare配置CDN，再到vercel配置，两者联动，中国访问友好
---
### 配置
1. 个人配置
> 懒得教如何配置了，和其他SSG一个样子，作者基于个人的配置封装了一个SKILL
> SKILL地址:[https://notes.cnkrru.top/docs/skills/vitepress-builder/SKILL](https://notes.cnkrru.top/docs/skills/vitepress-builder/SKILL)
- 配置都在这个SKILL里了
2. 官方文档
> [https://vitepress.dev/zh/guide/getting-started](https://vitepress.dev/zh/guide/getting-started)
- 我的配置就是照着这个一步步搭建的，应该差不了多少，不过作者之后不再用vitepress了，用自己用vue做的站点模板cvdocs了
   - cvdocs:[https://github.com/Cnkrru/Notes](https://github.com/Cnkrru/Notes)
   - 比不上vitepress，这个只是作者在用了几个SSG，学了vue之后自己做的一个轻量的SSG，自用
---
> 编辑于2026-04-23

> 作者：Cnkrru

> 联系方式：3253884026@qq.com
