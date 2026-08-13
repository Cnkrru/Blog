---
title: Frontend-返回顶部组件
date: 2026-04-19
updated: 2026-08-06
category: 前端
tags: [前端]
description: 详细介绍前端组件——返回顶部，介绍组件如何制作。
keywords: 前端, 组件, 返回顶部, TypeScript
---
## 制作方法
1. 依靠`scroll`API来实现，关于scroll详见于:[Frontend-Scroll-Screen](post-13.md)
2. 如果要实现滚动一定距离再显示，使用CSS变量，JS控制opacity来实现，关于CSS变量详见于:[Frontend-CSS变量](post-14.md)
---
## 代码:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>backtotop</title>
    <style>
        :root {
            --btt-opacity: 0;
        }

        .placeholder {
            height: 20000px;
            overflow: auto;
        }
        .backtotop {
            position: fixed;

            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;

            background-color: #007BFF;
            border: none;
            border-radius: 50%;
            cursor: pointer;

            opacity: var(--btt-opacity);
            transition: opacity 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="placeholder"></div>
    <button class="backtotop"></button>

    <script>
        const btt_button = document.querySelector('.backtotop');
        const placeholder = document.querySelector('.placeholder');
        function scrollToTop() {window.scroll({ top: 0, behavior: 'smooth' });}
        function updateButtonVisibility() 
        {
            if (window.scrollY > 300) {document.documentElement.style.setProperty('--btt-opacity', 1);} 
            else {document.documentElement.style.setProperty('--btt-opacity', 0);}
        }

        btt_button.addEventListener('click', scrollToTop);
        window.addEventListener('scroll', updateButtonVisibility);

    </script>
</body>
</html>
```
---
> 编辑于2026-04-19

> 作者：Cnkrru

> 联系方式：3253884026@qq.com
