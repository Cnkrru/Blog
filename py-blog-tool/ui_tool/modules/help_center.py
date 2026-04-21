#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
帮助中心模块
"""

from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QTextEdit,
    QTabWidget, QLabel
)
from PyQt5.QtCore import Qt

from utils.ui_utils import show_info_message

class HelpCenterPanel(QWidget):
    """帮助中心面板"""
    
    def __init__(self, project_root):
        super().__init__()
        self.project_root = project_root
        self.init_ui()
    
    def init_ui(self):
        """初始化界面"""
        layout = QVBoxLayout(self)
        
        # 标签页
        tab_widget = QTabWidget()
        
        # 功能说明标签
        features_tab = QWidget()
        features_layout = QVBoxLayout(features_tab)
        
        features_text = QTextEdit()
        features_text.setReadOnly(True)
        features_content = '''# 功能说明

## 文章管理
- 搜索文章：通过关键词搜索文章
- 预览文章：查看文章详细信息
- 编辑文章：修改文章元数据
- 删除文章：删除不需要的文章
- 创建文章：创建新文章
- 更新搜索索引：更新文章搜索索引

## 站点维护
- 创建Markdown模板：创建文章模板
- 草稿管理：管理草稿文件
- 草稿转文章：将草稿转换为正式文章
- 清空草稿：清空所有草稿
- 站点统计：查看站点统计信息
- 自动清理：清理临时文件

## 分类管理
- 添加分类：添加新分类
- 编辑分类：修改分类名称
- 删除分类：删除分类

## 标签管理
- 添加标签：添加新标签
- 编辑标签：修改标签名称
- 删除标签：删除标签

## 数据统计
- 文章统计：查看文章统计信息
- 分类分布：查看分类分布图表
- 标签云：查看标签使用频率

## 配置管理
- 编辑配置：编辑配置文件

## 日志管理
- 查看日志：查看日志文件内容
- 清理过期日志：清理30天前的日志

## 版本管理
- 查看版本信息：查看当前版本信息
- 检查更新：检查是否有新版本
'''
        features_text.setMarkdown(features_content)
        features_layout.addWidget(features_text)
        
        # 使用指南标签
        guide_tab = QWidget()
        guide_layout = QVBoxLayout(guide_tab)
        
        guide_text = QTextEdit()
        guide_text.setReadOnly(True)
        guide_content = '''# 使用指南

## 基本操作

### 启动工具
1. 进入项目目录
2. 激活虚拟环境：`ui_tool_venv\Scripts\activate.ps1`
3. 运行工具：`python ui_tool\main.py`

### 文章管理
1. 在左侧导航栏选择"文章管理"
2. 点击"刷新"按钮加载文章列表
3. 选择文章后可以进行预览、编辑、删除操作
4. 点击"创建"按钮创建新文章
5. 点击"更新搜索索引"按钮更新搜索索引

### 站点维护
1. 在左侧导航栏选择"站点维护"
2. 点击"创建Markdown模板"创建文章模板
3. 点击"草稿管理"管理草稿文件
4. 点击"草稿转文章"将草稿转换为正式文章
5. 点击"清空草稿"清空所有草稿
6. 点击"站点统计"查看站点统计信息
7. 点击"自动清理"清理临时文件

### 分类管理
1. 在左侧导航栏选择"分类管理"
2. 点击"刷新"按钮加载分类列表
3. 点击"添加"按钮添加新分类
4. 选择分类后可以进行编辑、删除操作

### 标签管理
1. 在左侧导航栏选择"标签管理"
2. 点击"刷新"按钮加载标签列表
3. 点击"添加"按钮添加新标签
4. 选择标签后可以进行编辑、删除操作

### 数据统计
1. 在左侧导航栏选择"数据统计"
2. 在"文章统计"标签页查看统计信息
3. 在"图表分析"标签页查看分类分布和标签云

### 配置管理
1. 在左侧导航栏选择"配置管理"
2. 点击"刷新"按钮加载配置文件列表
3. 选择配置文件后点击"编辑"按钮编辑配置

### 日志管理
1. 在左侧导航栏选择"日志管理"
2. 点击"刷新"按钮加载日志文件列表
3. 选择日志文件后点击"查看"按钮查看日志内容
4. 点击"清理过期日志"按钮清理30天前的日志

### 版本管理
1. 在左侧导航栏选择"版本管理"
2. 查看当前版本信息
3. 点击"检查更新"按钮检查是否有新版本
'''
        guide_text.setMarkdown(guide_content)
        guide_layout.addWidget(guide_text)
        
        # 常见问题标签
        faq_tab = QWidget()
        faq_layout = QVBoxLayout(faq_tab)
        
        faq_text = QTextEdit()
        faq_text.setReadOnly(True)
        faq_content = '''# 常见问题

## 1. 工具无法启动
**问题**：运行 `python ui_tool\main.py` 时提示缺少模块
**解决方法**：
- 确保已激活虚拟环境
- 确保已安装所有依赖：`pip install PyQt5 matplotlib pandas markdown pyyaml chardet`

## 2. 文章管理功能无法使用
**问题**：文章管理模块显示空白
**解决方法**：
- 确保 `public\config\search.json` 文件存在
- 确保 `search.json` 文件格式正确

## 3. 草稿管理功能无法使用
**问题**：草稿管理显示"草稿目录为空"
**解决方法**：
- 草稿目录会自动创建，无需手动创建
- 先点击"创建Markdown模板"创建草稿

## 4. 配置管理功能无法使用
**问题**：配置管理显示"配置目录不存在"
**解决方法**：
- 确保 `public\config` 目录存在
- 确保配置文件格式正确

## 5. 日志管理功能无法使用
**问题**：日志管理显示"日志目录不存在"
**解决方法**：
- 日志目录会自动创建，无需手动创建
- 工具运行时会自动生成日志文件

## 6. 数据统计图表无法显示
**问题**：点击"分类分布"或"标签云"按钮后无反应
**解决方法**：
- 确保已安装 matplotlib：`pip install matplotlib`
- 确保文章数据存在

## 7. 工具运行缓慢
**问题**：工具启动或操作时响应缓慢
**解决方法**：
- 关闭不必要的应用程序
- 确保电脑性能足够
- 对于大量文章的操作，可能需要等待一段时间

## 8. 工具崩溃
**问题**：工具突然崩溃
**解决方法**：
- 检查日志文件获取错误信息
- 确保所有依赖版本正确
- 重新启动工具
'''
        faq_text.setMarkdown(faq_content)
        faq_layout.addWidget(faq_text)
        
        # 添加标签页
        tab_widget.addTab(features_tab, '功能说明')
        tab_widget.addTab(guide_tab, '使用指南')
        tab_widget.addTab(faq_tab, '常见问题')
        
        # 添加到布局
        layout.addWidget(tab_widget)
        
        # 关于按钮
        about_button = QPushButton('关于')
        about_button.clicked.connect(self.show_about)
        layout.addWidget(about_button)
    
    def show_about(self):
        """显示关于信息"""
        about_content = '''# Vue-Blog 管理工具

## 版本
1.0.0

## 功能
- 文章管理
- 站点维护
- 分类管理
- 标签管理
- 数据统计
- 配置管理
- 日志管理
- 版本管理

## 技术栈
- Python 3.10+
- PyQt5
- matplotlib
- pandas
- markdown
- pyyaml

## 开发者
Cnkrru

## 版权
© 2026 Vue-Blog. All rights reserved.
'''
        
        from PyQt5.QtWidgets import QDialog
        dialog = QDialog(self)
        dialog.setWindowTitle('关于')
        dialog.resize(400, 300)
        
        layout = QVBoxLayout(dialog)
        text_edit = QTextEdit()
        text_edit.setReadOnly(True)
        text_edit.setMarkdown(about_content)
        layout.addWidget(text_edit)
        
        dialog.exec_()