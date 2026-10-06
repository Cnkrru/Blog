---
title: "Markdown 排版预览"
date: 2026-10-05
description: "一篇用来检查各种 Markdown 元素渲染效果的测试文章。"
tags: ["Markdown", "测试"]
categories: ["折腾记录"]
---

这篇没有实际内容，只是用来检查主题对各种 Markdown 元素的渲染是否正常。

## 文本样式

这是普通段落。**这是加粗**，*这是斜体*，~~这是删除线~~，这是 `行内代码`。
[这是一个链接](https://gohugo.io/)。

> 这是一段引用。
> 用来检查引用的左边框和背景是否正确。

## 列表

无序列表：

- 第一项
- 第二项
  - 嵌套项
  - 另一个嵌套项
- 第三项

有序列表：

1. 第一步
2. 第二步
3. 第三步

任务列表：

- [x] 已完成的事情
- [ ] 还没做的事情

## 代码

行内代码：`npm run dev`。

Go 代码块：

```go
package main

import "fmt"

func main() {
    fmt.Println("hello, hugo")
}
```

Python 代码块：

```python
def fib(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

## 表格

| 主题色 | 主色 | 说明 |
| --- | --- | --- |
| blue | `#2563eb` | 默认蓝 |
| cyan | `#06b6d4` | 青空 |
| ink | `#b23a2e` | 水墨 |
| purple | `#8b5cf6` | 紫韵 |
| sakura | `#e8758f` | 樱粉 |

## 其他

分割线：

---

按 <kbd>Ctrl</kbd> + <kbd>K</kbd> 可以快速搜索。
