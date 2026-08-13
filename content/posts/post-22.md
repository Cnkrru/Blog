---
title: Frontend-通知按钮组件
date: 2026-08-11
category: 前端
tags: [前端]
description: 介绍前端组件：通知按钮组件制作方法
keywords: frontend
---
## 制作方法
1. 需要调用浏览器API`notification`
    - 文档:[MDN-notification](https://developer.mozilla.org/zh-CN/docs/Web/API/Notifications_API)
2. 该API并不适用于所有浏览器，不过基于谷歌浏览器内核的都行，比如谷歌浏览器，edge浏览器
3. API内容
    - 检查浏览器是否支持该API
    ```javascript
        if (!'Notification' in window) {console.error('[ERROR]:该浏览器不支持通知API');}
        else{console.log('[INFO]:该浏览器支持通知API')}
    ```
    - 获取权限
        - default：没有问用户是否允许通知
        - granted：问过用户，用户同意了
        - denied：用户拒绝了
        通过实例属性`requestPermission`获取权限参数
    - 创建通知
        - `new Notification(<title,options>)`
        - options:
            - body：文本内容
            - icon：图标
            - badge：移动端图标
            - requireInteraction：通知是否自动关闭
            ……
            还有一些，不列了，并不是所有属性都要用到，
    - 关闭通知
        - `<实例>.close()`
---
## 代码
```html

```
---