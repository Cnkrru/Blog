---
order: 2
title: Linux服务器-1
date: 2026-10-05
category: Linux
tags: [Linux，个人]
description: 记录第一次接触Linux服务器
keywords: Linux服务器
---

## 引言

心血来潮买了个腾讯云2G2核的云服务器，想部署一些私人服务，特为此记录一下
---

## 实操过程

### 基础配置

1. 配置SSH  
   SSH是一种加密网络协议，用来控制服务器
   1. 生成SSH密钥(此处只介绍Windows)
      - `ssh-keygen -t ed25519 -C "orcaterm-key"`
   2. 查看密钥
      - `type $env:USERPROFILE\.ssh\id_ed25519.pub`
2. 启用防火墙
3. 更新补丁
4. 配置lighthouse用户

### 开发配置

1. git
   - 下载放到全局
   - 配置用户名+邮箱
