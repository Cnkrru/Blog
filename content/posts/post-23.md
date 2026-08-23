---
title: Cmake介绍
date: 2026-08-13
category: Cpp
tags: [Cpp]
description: 记录Cpp相关知识
keywords: Cpp
---
## Cmake
### Cmake介绍
> 对于C和Cpp项目，我们可以这样理解构建过程：
> - 源码 -> 配置CmakeList.txt -> 生成构建工具的配置文件 -> 构建工具根据生成的配置文件准备原料 -> 将`原料`交给编译器编译为二进制
> - 可以看作，源码是`做饭的原料`，CmakeList是`菜谱`，配置文件是`做饭工具+购物清单`，构建工具准备`原料`，编译器是`厨师`，将其做成`食物`
---
### 编译器
```csv
Windows,MacOS,Linux
MSVC,Clang,GCC
```
> 并非全部，只是主流，比如Windows系统还有一种主流编译器`MinGW`,不同的编译器安装的库也会不同，编译产物可能会有些差别，但是程序结果一般相同
---
### 构建工具
```csv
平台,构建工具,配置文件
Windows,VS(MSVC),vproject/.sln
MacOS,Xcode,xcodeproj
Linux,UNIX Makefile,Makefile
```
> 也有全平台的`Ninja`  
> 这些依赖于CmakeList来生成对应的配置文件
> CMake本身是跨平台的，也有其他工具，但是在一些方面总会不如Cmake
---
### 源码与库
- 由于操作系统设计的差异，C/CPP的库并不一定都是跨平台的，不过标准库和一些第三方库(比如QT)一般跨平台
- 这些库跨平台主要是依赖于按平台来进行条件编译，比如我用标准库写的一段代码。在Windows编译成`0010 1010`,在MacOS可能会编译成`1010 0101`（瞎写的）
- 虽然编译的产物不同，但是效果相同
---
### 编译性语言与解释性语言
- 编译性语言根据源码，编译成对应的二进制，如果运行在不同底座上，就不行
- 解释性语言，代码运行在解释器上，解释器本身是跨平台的，所以到处运行，至于解释器为什么跨平台，因为解释器一般是由编译性语言写的，比如python解释器`Cpython`是用C写的，在设计时便按条件编译，与标准库能跨平台的原理相同
- 虚拟机，至于java这种运行在java虚拟机上的语言，虚拟机跨平台的原理与解释器跨平台的原理类似，但是又有区别，java源码会编译为class字节码，进一步运行在虚拟机上，这里作者不懂
- 速度问题，解释性语言一般会比编译性语言慢很多，因为相当于又多了一层封装，而且很多解释性语言自带GC机制(内存回收),不需要手动管理内存，解释器会有一部分性能浪费在内存处理上，并不是说编译性语言就没有GC了，go语言有，速度介于C/CPP这种手动管理内存的编译性语言和解释性语言之间
- 无论哪种语言，能解决问题的就是好语言，无高低好坏之分，有些可能会被淘汰，比如php，有些兴起，比如rust，都只是一时的，但是各个编程语言是类似的，学好一门后端语言，学其他的也容易不少，后端语言大多相通，而且随着硬件水平提升，速度不再是开发者的追求，开发速度也是一个值得关注的事
---
### Cmake相关文件夹与配置文件
```csv
文件夹,文件夹作用,配置文件
src,放源码和CmakeList,CmakeList.txt
build,构建中间产物,CmakeCache.txt
install,安装目录,Cmake_install.cmake
```
---
### Cmake语法
> 内容太多，具体请看:[notes](https://notes.cnkrru.top)
- 语法风格和后端语言比较相似，容易上手
### 包管理与构建
- 我们不管用什么语言做项目，都需要`包管理器`和`构建工具`
```csv
编程语言,包管理器,构建工具,配置文件
python,pip,setuptools,pyproject.toml
javascript,npm,webpack/vite,package.json
rust,cargo,cargo,cargo.toml
Cpp,vcpkg,Cmake+make,CmakeList.txt+vcpkg.json
```
- python:
  - `pip list`可以看安装的全局包，里面会有pip和setuptool，也有其他包管理器和构建工具，不过作者没用过
- JavaScript
  - `npm list -g`可以看全局包，不过JavaScript项目隔离做的比较好，构建工具和依赖一般在项目的package.json里配置
- rust
  - 用的少，语言比较新，虽然特效和工具都是最新潮的，但是生态弱
> 学习什么语言，如果是找工作，确实应该选一个容易找工作的，比如Java，go，但是如果是给自己用，想做一下自己想做的东西，用成熟的语言会好些
### 依赖管理
> 东西实在太多，我挑着自己想学的学，并在这里介绍
- 依赖管理 -> 包管理器，我使用的是vcpkg，微软官方出的，用着还行
- 包管理器还有Conan，我没用过
- vcpkg安装包时需要指定平台(标准库和跨平台包则不用)
```shell
vcpkg install fmt spdlog nlohmann-json
vcpkg install qt6

# 指定 目标平台配置
vcpkg install fmt:x64-windows             # MSVC 64位
vcpkg install fmt:x64-windows-static      # 静态链接
vcpkg install fmt:x64-mingw-dynamic       # MinGW 动态链接
```
- Cmake中配置vcpkg
```shell
cmake -B build -S . \
    -DCMAKE_TOOLCHAIN_FILE="[vcpkg-root]/scripts/buildsystems/vcpkg.cmake"
```
- 包管理`vcpkg.json`
> 和package.json长得一样
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": [
    "fmt",
    "spdlog",
    "nlohmann-json",
    {
      "name": "openssl",
      "features": ["tools"]
    }
  ]
}
```
---
> 编辑于2026-08-14

> 作者：Cnkrru

> 联系方式：3253884026@qq.com