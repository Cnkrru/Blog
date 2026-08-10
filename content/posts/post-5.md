---
title: Frontend-沉浸阅读组件
date: 2026-04-20
updated: 2026-08-10
category: 前端
tags: [前端]
description: 详细介绍前端组件——沉浸阅读，介绍组件如何制作。
keywords: 前端组件, 沉浸阅读
---
## 制作方法
1. 用`classList.toggle()`切换类名
2. 主题切换是通过CSS属性改变颜色，沉浸阅读是通过切换类来实现，需要给一个组件准备两套类
    - 按道理来说不管是切换类还是使用CSS变量都可以，修改CSS属性来实现的组件一般是通过这两种途径
---

### 代码:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>immersivereading</title>
    <style>
        body.immersive-reading .placeholder {
            height: 2000px;
            width: 50%;
        }
        .placeholder {
            height: 2000px;
            width: 100%;
            overflow: auto;
            background-color: pink;
            transition: width 0.3s ease;
        }
        .toggle-button {
            position: fixed;

            width: 40px;
            height: 40px;

            bottom: 10px;
            right: 10px;
            
            padding: 10px 20px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="placeholder"></div>
    <button class="toggle-button"></button>
    <script>
        const placeholder = document.querySelector('.placeholder');
        const toggleButton = document.querySelector('.toggle-button');

        function toggleImmersiveReading() {
            document.body.classList.toggle('immersive-reading');
            console.log('[info]已切换');
        }
        toggleButton.addEventListener('click', toggleImmersiveReading);
    </script>
</body>
</html>
```
---
> 编辑于2026-04-20

> 作者：Cnkrru

> 联系方式：3253884026@qq.com
