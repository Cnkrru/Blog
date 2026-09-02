---
title: Frontend-主题切换
date: 2026-04-21
updated: 2026-08-10
category: 前端
tags: [前端]
history:
  - 2026-08-07 适配CSS变量方案，移除硬编码颜色
  - 2026-07-10 新增Sakura樱粉主题和Compact布局
  - 2026-05-15 完善亮暗模式自动切换
description: 详细介绍前端组件——主题切换，介绍组件如何制作。
keywords: 前端组件, 主题切换, TypeScript
---
## 制作方法
1. 一般使用CSS变量的方式来实现，关于CSS变量详见于:[Frontend-CSS变量](/post/14)
2. 按钮绑定一下`click`事件就行
---
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>themetoggle</title>
    <style>
        :root {
            --bg-color: #fff;
            --text-color: #000;
        }

        .dark-theme {
            --bg-color: #000;
            --text-color: #fff;
        }

        .placeholder {
            height: 2000px;
            overflow: auto;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
        }

        .themetoggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;

            background-color: #007BFF;
            border: none;
            border-radius: 50%;
            cursor: pointer;

            color: #fff;
        }
    </style>    
</head>
<body>
    <div class="placeholder"></div>
    <button class="themetoggle">Toggle Theme</button>
    <script>
        const themeToggleButton = document.querySelector('.themetoggle');
        const placeholder = document.querySelector('.placeholder');

        function toggleTheme() {
            document.body.classList.toggle('dark-theme');
        }

        themeToggleButton.addEventListener('click', toggleTheme);
    </script>    
</body>
</html>
```
---
> 编辑于2026-04-21

> 作者：Cnkrru

> 联系方式：3253884026@qq.com
