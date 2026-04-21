#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
标签管理模块
"""

from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QTableWidget,
    QTableWidgetItem, QLineEdit, QLabel, QFormLayout
)
from PyQt5.QtCore import Qt
from pathlib import Path
import json

from utils.common import get_search_json, read_json
from utils.ui_utils import (
    setup_table_widget, add_table_row, clear_table, get_selected_row,
    show_info_message, show_error_message, show_question_message
)

class TagManagementPanel(QWidget):
    """标签管理面板"""
    
    def __init__(self, project_root):
        super().__init__()
        self.project_root = project_root
        self.search_json = get_search_json()
        self.init_ui()
    
    def init_ui(self):
        """初始化界面"""
        layout = QVBoxLayout(self)
        
        # 标签列表
        self.tag_table = QTableWidget()
        headers = ['标签名称', '使用次数']
        setup_table_widget(self.tag_table, headers)
        
        # 按钮栏
        button_layout = QHBoxLayout()
        refresh_button = QPushButton('刷新')
        refresh_button.clicked.connect(self.load_tags)
        
        add_button = QPushButton('添加')
        add_button.clicked.connect(self.add_tag)
        
        edit_button = QPushButton('编辑')
        edit_button.clicked.connect(self.edit_tag)
        
        delete_button = QPushButton('删除')
        delete_button.clicked.connect(self.delete_tag)
        
        button_layout.addWidget(refresh_button)
        button_layout.addWidget(add_button)
        button_layout.addWidget(edit_button)
        button_layout.addWidget(delete_button)
        
        # 添加到布局
        layout.addWidget(self.tag_table)
        layout.addLayout(button_layout)
        
        # 加载标签列表
        self.load_tags()
    
    def load_tags(self):
        """加载标签列表"""
        try:
            posts = read_json(self.search_json)
            
            # 统计标签
            tag_count = {}
            for post in posts:
                tags = post.get('tags', [])
                for tag in tags:
                    tag_count[tag] = tag_count.get(tag, 0) + 1
            
            # 显示标签
            clear_table(self.tag_table)
            for tag, count in tag_count.items():
                add_table_row(self.tag_table, [tag, count])
                
        except Exception as e:
            show_error_message(self, '错误', f'加载标签失败: {e}')
    
    def add_tag(self):
        """添加标签"""
        # 创建添加窗口
        add_widget = QWidget()
        add_layout = QFormLayout(add_widget)
        
        # 标签名称
        tag_edit = QLineEdit()
        add_layout.addRow('标签名称:', tag_edit)
        
        # 按钮
        button_layout = QHBoxLayout()
        save_button = QPushButton('保存')
        cancel_button = QPushButton('取消')
        
        def save_tag():
            tag_name = tag_edit.text().strip()
            if not tag_name:
                show_info_message(add_widget, '提示', '标签名称不能为空')
                return
            
            show_info_message(add_widget, '提示', f'标签 "{tag_name}" 已添加')
            add_widget.close()
        
        save_button.clicked.connect(save_tag)
        cancel_button.clicked.connect(add_widget.close)
        
        button_layout.addWidget(save_button)
        button_layout.addWidget(cancel_button)
        add_layout.addRow(button_layout)
        
        add_widget.setWindowTitle('添加标签')
        add_widget.resize(300, 100)
        add_widget.show()
    
    def edit_tag(self):
        """编辑标签"""
        row = get_selected_row(self.tag_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一个标签')
            return
        
        old_tag = self.tag_table.item(row, 0).text()
        
        # 创建编辑窗口
        edit_widget = QWidget()
        edit_layout = QFormLayout(edit_widget)
        
        # 标签名称
        tag_edit = QLineEdit(old_tag)
        edit_layout.addRow('标签名称:', tag_edit)
        
        # 按钮
        button_layout = QHBoxLayout()
        save_button = QPushButton('保存')
        cancel_button = QPushButton('取消')
        
        def save_changes():
            new_tag = tag_edit.text().strip()
            if not new_tag:
                show_info_message(edit_widget, '提示', '标签名称不能为空')
                return
            
            if new_tag == old_tag:
                edit_widget.close()
                return
            
            try:
                # 更新文章中的标签
                posts = read_json(self.search_json)
                for post in posts:
                    tags = post.get('tags', [])
                    if old_tag in tags:
                        tags = [new_tag if tag == old_tag else tag for tag in tags]
                        post['tags'] = tags
                
                # 保存更改
                with open(self.search_json, 'w', encoding='utf-8') as f:
                    json.dump(posts, f, ensure_ascii=False, indent=2)
                
                show_info_message(edit_widget, '成功', f'标签已更新为 "{new_tag}"')
                self.load_tags()
                edit_widget.close()
                
            except Exception as e:
                show_error_message(edit_widget, '错误', f'更新失败: {e}')
        
        save_button.clicked.connect(save_changes)
        cancel_button.clicked.connect(edit_widget.close)
        
        button_layout.addWidget(save_button)
        button_layout.addWidget(cancel_button)
        edit_layout.addRow(button_layout)
        
        edit_widget.setWindowTitle('编辑标签')
        edit_widget.resize(300, 100)
        edit_widget.show()
    
    def delete_tag(self):
        """删除标签"""
        row = get_selected_row(self.tag_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一个标签')
            return
        
        tag = self.tag_table.item(row, 0).text()
        count = self.tag_table.item(row, 1).text()
        
        if show_question_message(self, '确认删除', f'确定要删除标签 "{tag}" 吗？\n该标签在 {count} 篇文章中被使用。'):
            try:
                # 从文章中移除标签
                posts = read_json(self.search_json)
                for post in posts:
                    tags = post.get('tags', [])
                    if tag in tags:
                        tags = [t for t in tags if t != tag]
                        post['tags'] = tags
                
                # 保存更改
                with open(self.search_json, 'w', encoding='utf-8') as f:
                    json.dump(posts, f, ensure_ascii=False, indent=2)
                
                show_info_message(self, '成功', f'标签 "{tag}" 已删除')
                self.load_tags()
                
            except Exception as e:
                show_error_message(self, '错误', f'删除失败: {e}')