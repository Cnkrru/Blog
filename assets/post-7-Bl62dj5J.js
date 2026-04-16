var e=`---
title: 测试通知系统
date: 2026-04-16
categories: 测试
tags: [通知, 测试, Vue]
description: 测试博客的通知系统功能
---

# 测试通知系统

这是一篇测试通知系统的文章，我们将在这篇文章中测试博客的通知功能。

## 通知系统介绍

通知系统是博客的一个重要功能，它可以在用户执行某些操作时显示提示信息，提升用户体验。

## 测试通知功能

点击下面的按钮来测试通知功能：

<button onclick="if(window.toast) window.toast('这是一条测试通知')" class="test-button">测试通知</button>

## 通知类型

我们可以测试不同类型的通知：

<button onclick="if(window.toast && window.toast.success) window.toast.success('操作成功！')" class="test-button">成功通知</button>
<button onclick="if(window.toast && window.toast.error) window.toast.error('操作失败！')" class="test-button">错误通知</button>
<button onclick="if(window.toast && window.toast.warning) window.toast.warning('警告信息！')" class="test-button">警告通知</button>
<button onclick="if(window.toast && window.toast.info) window.toast.info('这是一条信息通知')" class="test-button">信息通知</button>

## 通知系统的应用场景

通知系统可以应用在以下场景：

1. **操作成功**：当用户执行某个操作成功时，显示成功通知
2. **操作失败**：当用户执行某个操作失败时，显示错误通知
3. **提醒信息**：显示一些重要的提醒信息
4. **系统通知**：显示系统相关的通知

## 通知系统的配置

通知系统的配置包括：

- 通知位置
- 通知持续时间
- 通知样式
- 通知动画

## 总结

通知系统是博客的一个重要功能，它可以提升用户体验，让用户及时了解操作结果和系统状态。

<style>
.test-button {
  display: inline-block;
  padding: 8px 16px;
  margin: 5px;
  background-color: var(--button-bg);
  color: var(--button-text);
  border: 1px solid var(--button-border);
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.test-button:hover {
  background-color: var(--button-hover-bg);
  transform: translateY(-3px);
}
</style>`;export{e as default};