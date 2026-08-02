@echo off
title Blog - Vue 3 个人技术博客
cd /d "%~dp0"

echo ========================================
echo   Blog - Vue 3 SSR Blog
echo   框架: Vue 3 + Vite + vite-ssg
echo   开发服务器: http://localhost:5173
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [X] 未检测到 Node.js，请先安装 Node.js 并配置环境变量
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo [!] 正在安装依赖 npm install...
    call npm install
    if errorlevel 1 (
        echo [X] npm install 失败，请检查网络或 Node.js 环境
        pause
        exit /b 1
    )
)

echo [*] 启动 Vite 开发服务器 npm run dev
echo [!] 按 Ctrl+C 停止
echo.
call npm run dev

pause
