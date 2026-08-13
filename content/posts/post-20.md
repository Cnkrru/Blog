---
title: Frontend-页面分享组件
date: 2026-08-11
category: 前端
tags: [前端]
description: 介绍前端组件：页面分享制作方法
keywords: frontend
---
## 制作方法
1. 这个组件是调用了第三方服务`addtoany`
2. 官网:[https://www.addtoany.com/](https://www.addtoany.com/)
3. 这个第三方服务把UI和服务都弄好了，开箱即用，挺好的
> 前端设计，作者认为熟悉一些浏览器API，JavaScript能力，CSS属性，UI设计，flex/grid布局，能独立设计一个页面的UI并实现部分组件即可
> 优先复用成熟组件，小组件自己写，想自定义复杂组件的话也可以自己写
---
## 代码
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div class="a2a_kit a2a_kit_size_32 a2a_default_style">
        <a class="a2a_dd" href="https://www.addtoany.com/share">分享</a>
        <a class="a2a_button_wechat">微信</a>
        <a class="a2a_button_facebook">Facebook</a>
    </div>
    <script src="https://static.addtoany.com/menu/page.js"></script>
</body>
</html>
```
---
> 编辑于2026-08-11

> 作者：Cnkrru

> 联系方式：3253884026@qq.com