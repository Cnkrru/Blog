---
title: shell与git 常用指令
date: 2026-07-03
category: shell
tags: [git，shell]
description: 记录一些shell，git常用指令
keywords: git，shell
---
# Shell简介
> shell是C编写的一种解释性脚本语言，专门用于终端与操作系统的交互
> shell天生支持其他语言os库的功能，并自带一些指令集合

> Windows自带终端CMD和Powershell常用于运行shell脚本（bat/ps1）
> git也常用于运行shell脚本。指令，不过更常用于GITHUB相关操作

> 可以人为新的注册shell指令，如果是Windows操作系统，需要在环境变量PATH里添加注册shell指令的exe的路径
> python解释器，npm包管理器，hugo站点生成器均是如此
---
## shell指令
> shell指令基本都是对应英语的缩写，很好记忆，不过现在很少用，常用于运维
1. `cd <路径>`
    - 进入指定路径
2. ls 
    - 列出当前路径下的文件/文件夹
3. `del <文件/文件夹>`
    - 删除指定文件/文件夹
4. `rm <文件/文件夹>`
    - 删除指定文件/文件夹
---
## python/pip
> python解释器注册到PATH后可在终端运行py脚本
> pip是python的包管理器
1. python --version / -v
    - PATH挂载的py解释器的版本
2. pip list
    - pip在全局安装的python包
3. `pip install / uninstall <包名>`
    - 全局安装/卸载指定包
    - 如果在uv虚拟环境，则是 `uv install / uninstall <包名>`
---
## npm
> npm是JavaScript/typescript的包管理器
> typescript是JavaScript的优化与封装，ts修了js的一些缺点，ts会编译成js
1. npm --version / -v
    - PATH挂载的py解释器的版本
2. npm list
    - pip在全局安装的python包
3. `npm install / uninstall <包名>`
    - 全局安装/卸载指定包
    - 如果在uv虚拟环境，则是 `uv install / uninstall <包名>`
4. npm run dev
    - 构建并启动服务本地预览
    - vue项目，electron项目，vue项目默认端口是5173
5. npm run build
    - 构建产物，输出到指定文件夹，一般是dist
---
## vcpkg
> vcpkg是Cpp的包管理器，需要搭配编译器MSVC.MinGW使用，一般构建项目需要编译器+vcpkg+Cmake
> 包管理器指令大多相似，不再重复

---
> 编辑于2026-07-03
> 作者：Cnkrru
> 联系方式：3253884026@qq.com
