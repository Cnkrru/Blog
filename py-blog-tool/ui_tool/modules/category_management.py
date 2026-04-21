#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
分类管理模块
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

class CategoryManagementPanel(QWidget):
    """分类管理面板"""
    
    def __init__(self, project_root):
        super().__init__()
        self.project_root = project_root
        self.search_json = get_search_json()
        self.init_ui()
    
    def init_ui(self):
        """初始化界面"""
        layout = QVBoxLayout(self)
        
        # 分类列表
        self.category_table = QTableWidget()
        headers = ['分类名称', '文章数量']
        setup_table_widget(self.category_table, headers)
        
        # 按钮栏
        button_layout = QHBoxLayout()
        refresh_button = QPushButton('刷新')
        refresh_button.clicked.connect(self.load_categories)
        
        add_button = QPushButton('添加')
        add_button.clicked.connect(self.add_category)
        
        edit_button = QPushButton('编辑')
        edit_button.clicked.connect(self.edit_category)
        
        delete_button = QPushButton('删除')
        delete_button.clicked.connect(self.delete_category)
        
        button_layout.addWidget(refresh_button)
        button_layout.addWidget(add_button)
        button_layout.addWidget(edit_button)
        button_layout.addWidget(delete_button)
        
        # 添加到布局
        layout.addWidget(self.category_table)
        layout.addLayout(button_layout)
        
        # 加载分类列表
        self.load_categories()
    
    def load_categories(self):
        """加载分类列表"""
        try:
            posts = read_json(self.search_json)
            
            # 统计分类
            category_count = {}
            for post in posts:
                category = post.get('category', '未分类')
                if category:
                    category_count[category] = category_count.get(category, 0) + 1
            
            # 添加未分类
            if '未分类' not in category_count:
                category_count['未分类'] = sum(1 for post in posts if not post.get('category'))
            
            # 显示分类
            clear_table(self.category_table)
            for category, count in category_count.items():
                add_table_row(self.category_table, [category, count])
                
        except Exception as e:
            show_error_message(self, '错误', f'加载分类失败: {e}')
    
    def add_category(self):
        """添加分类"""
        # 创建添加窗口
        add_widget = QWidget()
        add_layout = QFormLayout(add_widget)
        
        # 分类名称
        category_edit = QLineEdit()
        add_layout.addRow('分类名称:', category_edit)
        
        # 按钮
        button_layout = QHBoxLayout()
        save_button = QPushButton('保存')
        cancel_button = QPushButton('取消')
        
        def save_category():
            category_name = category_edit.text().strip()
            if not category_name:
                show_info_message(add_widget, '提示', '分类名称不能为空')
                return
            
            show_info_message(add_widget, '提示', f'分类 "{category_name}" 已添加')
            add_widget.close()
        
        save_button.clicked.connect(save_category)
        cancel_button.clicked.connect(add_widget.close)
        
        button_layout.addWidget(save_button)
        button_layout.addWidget(cancel_button)
        add_layout.addRow(button_layout)
        
        add_widget.setWindowTitle('添加分类')
        add_widget.resize(300, 100)
        add_widget.show()
    
    def edit_category(self):
        """编辑分类"""
        row = get_selected_row(self.category_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一个分类')
            return
        
        old_category = self.category_table.item(row, 0).text()
        
        # 创建编辑窗口
        edit_widget = QWidget()
        edit_layout = QFormLayout(edit_widget)
        
        # 分类名称
        category_edit = QLineEdit(old_category)
        edit_layout.addRow('分类名称:', category_edit)
        
        # 按钮
        button_layout = QHBoxLayout()
        save_button = QPushButton('保存')
        cancel_button = QPushButton('取消')
        
        def save_changes():
            new_category = category_edit.text().strip()
            if not new_category:
                show_info_message(edit_widget, '提示', '分类名称不能为空')
                return
            
            if new_category == old_category:
                edit_widget.close()
                return
            
            try:
                # 更新文章中的分类
                posts = read_json(self.search_json)
                for post in posts:
                    if post.get('category') == old_category:
                        post['category'] = new_category
                
                # 保存更改
                with open(self.search_json, 'w', encoding='utf-8') as f:
                    json.dump(posts, f, ensure_ascii=False, indent=2)
                
                show_info_message(edit_widget, '成功', f'分类已更新为 "{new_category}"')
                self.load_categories()
                edit_widget.close()
                
            except Exception as e:
                show_error_message(edit_widget, '错误', f'更新失败: {e}')
        
        save_button.clicked.connect(save_changes)
        cancel_button.clicked.connect(edit_widget.close)
        
        button_layout.addWidget(save_button)
        button_layout.addWidget(cancel_button)
        edit_layout.addRow(button_layout)
        
        edit_widget.setWindowTitle('编辑分类')
        edit_widget.resize(300, 100)
        edit_widget.show()
    
    def delete_category(self):
        """删除分类"""
        row = get_selected_row(self.category_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一个分类')
            return
        
        category = self.category_table.item(row, 0).text()
        count = self.category_table.item(row, 1).text()
        
        if show_question_message(self, '确认删除', f'确定要删除分类 "{category}" 吗？\n该分类下有 {count} 篇文章将被标记为未分类。'):
            try:
                # 更新文章中的分类
                posts = read_json(self.search_json)
                for post in posts:
                    if post.get('category') == category:
                        post['category'] = '未分类'
                
                # 保存更改
                with open(self.search_json, 'w', encoding='utf-8') as f:
                    json.dump(posts, f, ensure_ascii=False, indent=2)
                
                show_info_message(self, '成功', f'分类 "{category}" 已删除')
                self.load_categories()
                
            except Exception as e:
                show_error_message(self, '错误', f'删除失败: {e}')