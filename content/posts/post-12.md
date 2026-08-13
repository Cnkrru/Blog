---
title: Frontend-阅读进度条组件
date: 2026-08-10
category: 前端
tags: [前端]
description: 介绍前端组件：阅读进度条的制作方法
keywords: frontend
---
## 制作方法
1. 阅读进度条根据当前页面高度/全部页面高度来计算进度
2. 获取参数需要了解Web API的DOM模型的部分属性
3. 使用JS实时更新CSS变量
    - `document.documentElement.style.setProperty(<css变量>,<参数> )`
    - 绑定scroll事件
4. 注意事项：
    - 不绑定事件不会实时更新CSS最新状态
> scroll常见于制作返回顶部组件，关于这个API，详细请看:[Frontend-Scroll-Screen](post-13.md)
---
## 示例代码
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        :root {
            --progress-width: 50%;
        }
        .progress-container {
            width: 100%;
            height: 20px;
            background-color: #f3f3f3;
            border-radius: 10px;
            position: fixed;
        }

        .progress-bar {
            width: var(--progress-width);
            height: 100%;
            background-color: #4caf50;
            transition: width 0.5s ease-in-out;
        }

        .placeholder {
            height: 2000px;
            overflow: auto;
        }
    </style>
</head>
<body>
    <div class="progress-container">
        <div class="progress-bar"></div>
    </div>
    <div class="placeholder"></div>
    <script>
        function updateProgressBar() {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            const clientHeight = document.documentElement.clientHeight || window.innerHeight;
            const maxScroll = scrollHeight - clientHeight;
            const scrollPercentage = maxScroll > 0 ? Math.min((scrollTop / maxScroll) * 100, 100) : 0;
            document.documentElement.style.setProperty('--progress-width', `${scrollPercentage}%`);
        }
        
        window.addEventListener('scroll', updateProgressBar);
    </script>
</body>
</html>
```
---
> 编辑于2026-08-09

> 作者：Cnkrru

> 联系方式：3253884026@qq.com