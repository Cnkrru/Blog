#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
版本管理模块
"""

from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QLabel, QTextEdit
)
from PyQt5.QtCore import Qt
from pathlib import Path
import json
import requests

from utils.common import get_project_root
from utils.ui_utils import show_info_message, show_error_message

class VersionManagementPanel(QWidget):
    """版本管理面板"""
    
    def __init__(self, project_root):
        super().__init__()
        self.project_root = project_root
        self.current_version = "1.0.0"
        self.init_ui()
    
    def init_ui(self):
        """初始化界面"""
        layout = QVBoxLayout(self)
        
        # 版本信息
        version_info = QTextEdit()
        version_info.setReadOnly(True)
        version_info.setStyleSheet("font-family: monospace; font-size: 12px;")
        
        version_content = f'''# 版本信息

## 当前版本
{self.current_version}

## 功能特性
- 文章管理：搜索、预览、编辑、删除、创建文章
- 站点维护：模板创建、草稿管理、站点统计
- 分类管理：添加、编辑、删除分类
- 标签管理：添加、编辑、删除标签
- 数据统计：文章统计、图表分析
- 配置管理：编辑配置文件
- 日志管理：查看、清理日志
- 版本管理：版本信息、检查更新
- 帮助中心：功能说明、使用指南、常见问题

## 技术栈
- Python 3.10+
- PyQt5
- matplotlib
- pandas
- markdown
- pyyaml

## 版权信息
© 2026 Vue-Blog. All rights reserved.
'''
        version_info.setMarkdown(version_content)
        
        # 按钮
        button_layout = QHBoxLayout()
        check_update_button = QPushButton('检查更新')
        check_update_button.clicked.connect(self.check_update)
        
        about_button = QPushButton('关于')
        about_button.clicked.connect(self.show_about)
        
        button_layout.addWidget(check_update_button)
        button_layout.addWidget(about_button)
        
        # 添加到布局
        layout.addWidget(version_info)
        layout.addLayout(button_layout)
    
    def check_update(self):
        """检查更新"""
        # 模拟检查更新
        try:
            # 这里可以实现真实的版本检查逻辑
            # 例如从GitHub API获取最新版本
            # 现在使用模拟数据
            show_info_message(self, '检查更新', f'当前版本：{self.current_version}\n已是最新版本')
            
        except Exception as e:
            show_error_message(self, '错误', f'检查更新失败: {e}')
    
    def show_about(self):
        """显示关于信息"""
        about_content = f'''# Vue-Blog 管理工具

## 版本
{self.current_version}

## 功能
- 文章管理
- 站点维护
- 分类管理
- 标签管理
- 数据统计
- 配置管理
- 日志管理
- 版本管理
- 帮助中心

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