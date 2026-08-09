---
title: Frontend-打印为PDF导出组件
date: 2026-08-09
category: 前端
tags: [前端]
description: 介绍前端组件：将页面导出为PDF的制作方法
keywords: frontend
---

## 制作方法
- 需要用到浏览器的API：`window.printpdf()`函数
- 该函数绑定一个按钮即可，一键导出为PDF

## 示例代码
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>printpdf</title>
    <style>
        .printpdf {
            width: 80px;
            height: 40px;
            padding: 10px;
            border: 1px solid pink;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 10px;
            color: #333;
            background-color: pink;
        }
    </style>
</head>
<body>
    <button class="printpdf">PDF导出</button>
    <script>
        const pdf = document.querySelector('.printpdf');
        pdf.addEventListener('click', () => {window.print();});
    </script>
</body>
</html>
```
---
> 编辑于2026-08-09

> 作者：Cnkrru

> 联系方式：3253884026@qq.com

