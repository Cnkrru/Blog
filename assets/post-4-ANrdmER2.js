var e=`---
title: Mermaid图测试
date: 2026-04-12
category: 测试
tags: [测试, Mermaid, 图表]
description: 本文用于测试 Mermaid 图表渲染功能，支持流程图、时序图、甘特图、类图、状态图和饼图等多种图表类型，展示了不同场景下的图表应用。
keywords: Mermaid, 图表, 流程图, 时序图, 甘特图, 类图, 状态图, 饼图, 测试
---

# Mermaid图测试

本文用于测试 Mermaid 图表渲染功能，支持流程图、时序图、甘特图等多种图表类型。

## 流程图

### 简单流程图

\`\`\`mermaid
graph TD
    A[开始] --> B{判断条件}
    B -->|条件1| C[处理1]
    B -->|条件2| D[处理2]
    C --> E[结束]
    D --> E
\`\`\`

### 用户登录流程

\`\`\`mermaid
graph LR
    A[用户输入] --> B{验证信息}
    B -->|成功| C[登录成功]
    B -->|失败| D[显示错误]
    D --> A
    C --> E[跳转首页]
\`\`\`

### 系统架构图

\`\`\`mermaid
graph TB
    A[客户端] --> B[负载均衡器]
    B --> C1[服务器1]
    B --> C2[服务器2]
    B --> C3[服务器3]
    C1 --> D[(数据库1)]
    C2 --> D
    C3 --> D
    C1 --> E[(缓存)]
    C2 --> E
    C3 --> E
\`\`\`

## 时序图

### 用户请求时序

\`\`\`mermaid
sequenceDiagram
    participant User as 用户
    participant Frontend as 前端
    participant Backend as 后端
    participant DB as 数据库

    User->>Frontend: 访问页面
    Frontend->>Backend: 发送请求
    Backend->>DB: 查询数据
    DB-->>Backend: 返回结果
    Backend-->>Frontend: 返回JSON
    Frontend-->>User: 渲染页面
\`\`\`

### 订单处理流程

\`\`\`mermaid
sequenceDiagram
    participant Customer as 客户
    participant Order as 订单系统
    participant Payment as 支付系统
    participant Warehouse as 仓储系统

    Customer->>Order: 创建订单
    Order->>Payment: 请求支付
    Payment->>Customer: 跳转支付
    Customer-->>Payment: 完成支付
    Payment-->>Order: 支付成功
    Order->>Warehouse: 通知发货
    Warehouse-->>Customer: 发送商品
\`\`\`

## 甘特图

### 项目计划

\`\`\`mermaid
gantt
    title 项目开发计划
    dateFormat  YYYY-MM-DD
    section 设计
    需求分析       :a1, 2026-01-01, 7d
    原型设计       :a2, after a1, 5d
    UI设计        :a3, after a2, 7d
    section 开发
    前端开发       :b1, 2026-01-20, 15d
    后端开发       :b2, 2026-01-20, 15d
    API对接       :b3, after b1, 5d
    section 测试
    单元测试       :c1, 2026-02-05, 5d
    集成测试       :c2, after c1, 5d
    性能测试       :c3, after c2, 3d
\`\`\`

## 类图

### 博客系统类图

\`\`\`mermaid
classDiagram
    class User {
        +String username
        +String email
        +login()
        +logout()
    }

    class Post {
        +String title
        +String content
        +Date createdAt
        +publish()
        +delete()
    }

    class Comment {
        +String content
        +Date createdAt
        +approve()
    }

    class Category {
        +String name
        +addPost()
        +removePost()
    }

    User "1" --> "*" Post : creates
    User "1" --> "*" Comment : writes
    Post "1" --> "*" Comment : has
    Category "1" --> "*" Post : contains
\`\`\`

## 状态图

### 订单状态流转

\`\`\`mermaid
stateDiagram-v2
    [*] --> 待支付
    待支付 --> 已支付 : 支付成功
    已支付 --> 已取消 : 用户取消
    已支付 --> 已发货 : 商家发货
    已发货 --> 运输中 : 物流揽件
    运输中 --> 已签收 : 确认收货
    已签收 --> 已完成 : 完成订单
    已取消 --> [*]
    已完成 --> [*]
\`\`\`

## 饼图

### 技术栈分布

\`\`\`mermaid
pie title 技术栈使用分布
    "Vue.js" : 35
    "JavaScript" : 25
    "CSS" : 20
    "HTML" : 15
    "其他" : 5
\`\`\`

---

Mermaid 图表渲染功能测试完成！所有图表类型都能正确显示。`;export{e as default};