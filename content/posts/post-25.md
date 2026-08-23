---
title: Github Action配置
date: 2026-08-16
category: git
tags: [git]
description: 记录GitHub Action如何配置
keywords: GITHUB
---
## 介绍
- GitHub服务器接收`yaml`格式的配置文件
- 关于yaml:[notes](https://notes.cnkrru.top)
- 配置文件概念
```csv
概念,说明
workflow,自动化配置文件(定义在`.github/workflow/*.yaml`)
event.触发行为(push,pull_request,schedule)
job,工作流执行单元(默认并发)
step,job的操作
runner,运行job的虚拟机
action,可复用的步骤单元
```
- 工作流文件夹
```
.github/
|-- workflow/
    |-- build.yaml
    |-- deplay.yaml
```
---
## 语法
> 列出来的并不是所有的语法
1. 骨架
    1. name:工作流名称
    2. on:触发事件
    3. env:环境变量
    4. jobs:工作流执行单元
2. 触发事件
    1. push(推送)
        - branch:分支
        - path:特定路径变更时触发事件
    2. pull_request(请求推送)
        - branch
        - types:
    3. schedule(定时触发)
        - cron
    4. workflow_dispatch(手动触发)
    5. release(release发布事件)
        - type
    6. workflow_run(其他工作流完成后触发)
3. 条件执行
step:
    - name: 事件名
        if: 执行条件
        run: 运行脚本
---
## 示例
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

# 设置 GITHUB_TOKEN 权限
permissions:
  contents: read
  pages: write
  id-token: write

# 确保同时只有一个部署任务运行
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build static site
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'                  # 构建产物目录

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
---
> 编辑于2026-08-11

> 作者：Cnkrru

> 联系方式：3253884026@qq.com