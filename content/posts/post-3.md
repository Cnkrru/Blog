---
title: Frontend-HTML-CSS组件
date: 2026-04-20
updated: 2026-08-09
category: 技术
tags: [前端, 组件]
description: 详细介绍前端组件——HTML-CSS组件，介绍这些只需要HTML和CSS的简单组件如何制作。
keywords: HTML-CSS, 前端, 组件
---
## LOGO组件
1. LOGO制作一般分为两种：
    - 图片样式
    - 文字样式
2. 代码
> 图片样式
```html
    <div class="logo" 
         style="
          width: 100px;
          height: 100px;
          border: 1px solid pink;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          ">
    <a href="/">
        <img src="../src/assets/imgs/avator.jpg" alt="logo" 
        style="
        width: 100%;
        height: 100%;
        border-radius: 50%;
        ">
    </a>
</div>
```
> 文字样式
```html
    <div class="logo-text" 
         style="
          width: 100px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          ">
        <a href="/" style="text-decoration: none;color: #333;">
            <span style="font-size: 24px;font-weight: bold;">LOGO</span>
        </a>
    </div>
```
> 不建议内写style，太丑了，维护起来也是灾难
---
## 头像组件
1. 头像设计没什么特殊的，放个图片弄个圆角就行，一般还要弄一个链接
2. 代码
    - 直接复用图形样式LOGO即可，
---
## 导航组件
1. 导航组件一般是一个列表，每个列表项都是一个链接
2. 代码
```html
    <ul style="flex-direction: column; padding: 0; margin: 0;font-size: 16px; list-style: none; display: flex; gap: 20px;">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
```
> 想要横着的就把flex-direction改成row，改一下方向
---
## 版权组件
1. 版权组件一般是一个简单的文字，显示在页面底部
    - 版权符号：`&copy`
    - 这是HTML实体符号的写法`&实体符号`
2. 代码
```html
<p style="front-size: 14px; color: #666; text-align: center">
    &copy; 2023 你的博客名称. 所有权利保留.
</p>
```
---
## 欢迎语组件
- 欢迎语组件就是一段话内嵌一个`<a>`标签跳转链接，这里不赘述
---
##
> 编辑于2026-04-20

> 作者：Cnkrru

> 联系方式：3253884026@qq.com
