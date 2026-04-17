var e=`---
title: KaTeX数学公式测试
date: 2026-04-04
category: 测试
tags: [测试, KaTeX, 数学公式]
description: 本文用于测试 KaTeX 数学公式渲染功能，支持行内公式和行间公式，包括二次方程求根公式、欧拉恒等式、定积分、矩阵运算等多种数学表达式。
keywords: KaTeX, 数学公式, 行内公式, 行间公式, 二次方程, 欧拉恒等式, 定积分, 矩阵运算, 测试
---

# KaTeX数学公式测试

本文用于测试 KaTeX 数学公式渲染功能，支持行内公式和行间公式。

## 行内公式

行内公式示例：这是一元二次方程 $ax^2 + bx + c = 0$ 的求解公式。

勾股定理：$a^2 + b^2 = c^2$

欧拉公式：$e^{i\\pi} + 1 = 0$

## 行间公式

### 二次方程求根公式

$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

### 欧拉恒等式

$$e^{i\\pi} + 1 = 0$$

这个公式被认为是数学中最美丽的公式，因为它包含了五个最重要的数学常数。

### 定积分

$$\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)$$

其中 $F(x)$ 是 $f(x)$ 的原函数。

### 极限定义

$$\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n = e$$

### 矩阵运算

$$
\\begin{pmatrix}
a_{11} & a_{12} \\\\
a_{21} & a_{22}
\\end{pmatrix}
\\begin{pmatrix}
x \\\\
y
\\end{pmatrix}
=
\\begin{pmatrix}
b_{1} \\\\
b_{2}
\\end{pmatrix}
$$

### 求和公式

$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$

### 连乘公式

$$\\prod_{i=1}^{n} i = n!$$

### 三角函数

$$\\sin^2\\theta + \\cos^2\\theta = 1$$

$$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$$

### 对数恒等式

$$\\log_a (xy) = \\log_a x + \\log_a y$$

$$\\log_a \\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y$$

$$\\log_a x^n = n \\log_a x$$

### 傅里叶变换

$$F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} \\, dt$$

### 概率论

**正态分布概率密度函数：**

$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$$

### 物理学

**质能方程：**

$$E = mc^2$$

**薛定谔方程：**

$$i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r}, t) = \\hat{H}\\Psi(\\mathbf{r}, t)$$

---

KaTeX 数学公式渲染功能测试完成！所有数学表达式都能正确渲染显示。`;export{e as default};