---
title: Frontend-页面赞助组件
date: 2026-08-11
category: 前端
tags: [前端]
description: 介绍前端组件：页面赞助组件制作方法
keywords: frontend
---
## 制作方法
1. 这个就是一个弹窗放图片就行
2. 用`dialog`标签实现弹窗
---
## 代码
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .dialog {
            border: none;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .dialog h1 {
            margin-top: 0;
        }
        button {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
    </style>
</head>
<body>
    <dialog class="dialog">
        <h1>赞助</h1>
        <img src="sponsor-image.jpg" alt="赞助图片">
        <button class="close">关闭</button>
    </dialog>
    <button class="open">赞助我</button>

    <script>
        const openBtn = document.querySelector('.open');
        const closeBtn = document.querySelector('.close');
        const dialog = document.querySelector('dialog');

        openBtn.addEventListener('click', () => {dialog.showModal();});
        closeBtn.addEventListener('click', () => {dialog.close();});
    </script>
</body>
</html>
```
---
> 编辑于2026-08-11

> 作者：Cnkrru

> 联系方式：3253884026@qq.com