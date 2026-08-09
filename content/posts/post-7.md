---
title: Frontend-建站时长
date: 2026-04-21
updated: 2026-08-09
category: 前端
tags: [前端]
description: 详细介绍前端组件——网站年龄组件，介绍组件如何制作。
keywords: frontend
---
## 制作方法
- 需要调用JS在前端内置的库：Date
- JS`<const绑定的选择器>.textcontent`渲染到HTML上
---
### 时间戳
时间戳指的是从1970-01-01 00：00：00开始计时的一段毫秒数

各种后端语言一般都有时间库，比如py的time，datetime，C的time，都是基于时间戳。

基础的封装：用毫秒数->年月日时分秒，推算过程需要注意一下闰年，每一月有多少天
### Date库
1. new Date(`<参数>`)
    - 创建一个date对象
    - 参数：
        1. 指定时间戳数字
        2. 年月日 时分秒
        3. 不填（默认获取当前的时间戳）
2. Date.now()
    - 返回当前时间戳
3. Date.prototype.`<操作>``<时区>``<类型>`
    1. 操作：get/set/to
        - get：由时间戳转为具体类型的时间
        - set：没用过
        - to：没用过
    2. 时区：默认/UTC标准世界时间
    3. 类型：年月日时分秒（还有一些，用不到，不写了）
    4. 示例：
        - 年 -> `Date.prototype.getFullYear()`
        - 月 -> `Date.prototype.getMonth()`
        - 日 -> `Date.prototype.getDate()`
        - 时 -> `Date.prototype.getHours()`
        - 分 -> `Date.prototype.getMinutes()`
        - 秒 -> `Date.prototype.getSeconds()`
> Date库文档：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)        
---
## 代码:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>siteage</title>
    <style>
        .siteage {
            width: 80%;
            height: 40px;

            padding: 5px;
            border: 1px solid pink;
            border-radius: 4px;

            display: flex;
            justify-content: center;
            align-items: center;
            
            font-size: 10px;
            color: #333;
        }    
    </style>
</head>
<body>
    <div class="container">
        <div class="siteage"></div>
    </div>
    <script>
        const siteage = document.querySelector('.siteage');
        const init_date = new Date('2023-01-01');
        const current_date = new Date();
        const diff_time = current_date - init_date;
        const year = Date.prototype.getFullYear.call(new Date(diff_time))-1970;
        const month = Date.prototype.getMonth.call(new Date(diff_time));
        const day = Date.prototype.getDate.call(new Date(diff_time)) - 1;
        const hours = Date.prototype.getHours.call(new Date(diff_time));
        const minutes = Date.prototype.getMinutes.call(new Date(diff_time));
        const seconds = Date.prototype.getSeconds.call(new Date(diff_time));

        siteage.textContent = `${year} 年, ${month} 月, ${day} 天， ${hours} 小时, ${minutes} 分钟, ${seconds} 秒`;
    </script>
</body>
</html>
```
---
> 编辑于2026-04-21

> 作者：Cnkrru

> 联系方式：3253884026@qq.com