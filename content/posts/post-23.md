---
title: CPP-Qt学习与AL开发日志-1
date: 2026-08-13
category: Cpp
tags: [Cpp，Qt]
description: 记录Qt学习
keywords: Qt
---
## Cmake
### Cmake介绍
- CmakeList.txt看起来有点像py的requirements.txt，js的package.json，rust的cargo.toml，不过并不相同
- 我们不管用什么语言做项目，都需要`包管理器`和`构建工具`
```csv
编程语言,包管理器,构建工具,配置文件
python,pip,setuptools,pyproject.toml
javascript,npm,webpack/vite,package.json
rust,cargo,cargo,cargo.toml
Cpp,vcpkg,Cmake+make,CmakeList.txt+vcpkg.json
```
- 前三者的包管理器与构建工具的配置共用一个文件，而Cpp则是分开写，老东西的遗留问题，确实比不上新的
- 可以把包管理器当作仓库，Cmake当作设计师，make作为管理，编译器当作工人，多方协同一步步走下来，才能编译出二进制产物
- 其他语言把这个步骤简化了很多，很省事
### 依赖管理
> 东西实在太多，我挑着自己想学的学，并在这里介绍
- 依赖管理 -> 包管理器，我使用的是vcpkg，微软官方出的，用着还行
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