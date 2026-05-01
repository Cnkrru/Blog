---
title: CSS初始化以及版心容器代码
date: 2026-04-210
category: 前端
tags: [前端, CSS]
description: 详细介绍CSS初始化以及版心容器代码备份。
keywords: CSS, 初始化
---
>备份一下CSS初始化以及版心容器代码.可以在此基础上修改，本人博客在开发时在body初始化中加上flex布局来达到预期效果
---

### init.css

```css

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
html, body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
}

body {
    font-family: Arial, "Microsoft YaHei", sans-serif;
    font-size: 16px;
    line-height: 1.5;
    min-height: 100vh;
    background-attachment: fixed;
    background-size: cover;
    background-repeat: no-repeat;
}

a {
    text-decoration: none;
}

input, button, textarea, select {
    border: none;
    outline: none;
    font: inherit;
}

button {
    cursor: pointer;
}

img {
    vertical-align: middle;
    max-width: 100%;
}

h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
}

hr {
    margin: 0;
    padding: 0;
}

```
---

### container.css
```css

.container {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 0 20px;
}
```
---
> 如有建议，请联系我,邮箱:3253884026@qq.com
