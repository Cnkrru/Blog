---
title: Frontend-HTML-CSS组件
date: 2026-04-20
category: 技术
tags: [前端, 组件]
description: 详细介绍前端组件——HTML-CSS组件，介绍这些只需要HTML和CSS的简单组件如何制作。
keywords: HTML-CSS, 前端, 组件
---

## LOGO组件

### Logo制作思路

>LOGO制作一般分为两种：
>1. 图片样式
>2. 文字样式

### 结构

**图片样式：**
```

div.logo
└── a
    └── img
```

**文字样式：**
```

div.logo
└── a
    └── p
```

---

### 代码

**图片样式**
```html

<div class="logo">
    <a href="/">
        <img src="/logo.png" alt="logo">
    </a>
</div>
```

```css

.logo {
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo img {
    width: 100px;
    height: 100px;
}
```
---

**文字样式**
```html

<div class="logo">
    <a href="/">
        <p>Logo</p>
    </a>
</div>
```

```css

.logo {
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo p {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}
```

---

## Avatar组件

### Avatar组件制作思路

>1. 头像设计一般只是一个图片
>2. 圆形边框

### 结构

```

div.avatar
└── img
```
---

### 代码

```html

<div class="avatar">
  <img src="avatar.jpg" alt="用户头像">
</div>
```

```css
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
```

---

## 导航组件设计

### 导航组件制作思路

>1. 导航组件一般是一个列表，每个列表项都是一个链接
>2. 水平排列

### 结构

```

ul.nav
├── li
│   └── a
├── li
│   └── a
├── li
│   └── a
├── li
│   └── a
└── li
    └── a
```

---

### 代码

```html

<ul class="nav">
    <li><a href="/">首页</a></li>
    <li><a href="/about">关于</a></li>
    <li><a href="/contact">联系</a></li>
    <li><a href="/blog">博客</a></li>
    <li><a href="/archive">归档</a></li>
</ul>
```

```css

.nav {
    display: flex;
    justify-content: center;
    align-items: center;
}
.nav li {
    margin-right: 20px;
}
.nav li a {
    text-decoration: none;
    color: #333;
}
```

---

## 版权组件设计

### 版权组件制作思路

>1. 版权组件一般是一个简单的文字，显示在页面底部

### 结构

```

p
```
---

### 代码

```html

<p class="copyright">
    &copy; 2023 你的博客名称. 所有权利保留.
</p>
```

```css

.copyright {
    font-size: 14px;
    color: #666;
    text-align: center;
}
```

---
> 如有建议，请联系我,邮箱:3253884026@qq.com
