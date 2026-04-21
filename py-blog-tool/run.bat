@echo off
chcp 65001
REM Vue-Blog 管理工具启动脚本

REM 切换到项目目录
cd /d %~dp0

REM 检查虚拟环境是否存在
if not exist "ui_tool_venv" (
    echo 虚拟环境不存在，正在创建...
    uv venv ui_tool_venv
    
    echo 正在安装依赖...
    ui_tool_venv\Scripts\pip install PyQt5 matplotlib pandas markdown pyyaml chardet
)

REM 激活虚拟环境并运行工具
echo 正在启动 Vue-Blog 管理工具...
ui_tool_venv\Scripts\python ui_tool\main.py

pause