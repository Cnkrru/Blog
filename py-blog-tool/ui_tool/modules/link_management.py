#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
链接管理模块
"""

from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QTableWidget,
    QTableWidgetItem, QLineEdit, QLabel, QTextEdit, QFormLayout
)
from PyQt5.QtCore import Qt
from pathlib import Path
import json

from utils.common import get_project_root, read_json, write_json
from utils.ui_utils import (
    setup_table_widget, add_table_row, clear_table, get_selected_row,
    show_info_message, show_error_message, show_question_message
)

class LinkManagementPanel(QWidget):
    """链接管理面板"""
    
    def __init__(self, project_root):
        super().__init__()
        self.project_root = project_root
        self.links_json = project_root / 'public' / 'config' / 'links.json'
        self.init_ui()
    
    def init_ui(self):
        """初始化界面"""
        layout = QVBoxLayout(self)
        
        # 搜索栏
        search_layout = QHBoxLayout()
        search_label = QLabel('搜索:')
        self.search_input = QLineEdit()
        search_button = QPushButton('搜索')
        search_button.clicked.connect(self.search_links)
        
        search_layout.addWidget(search_label)
        search_layout.addWidget(self.search_input)
        search_layout.addWidget(search_button)
        
        # 链接列表
        self.link_table = QTableWidget()
        headers = ['ID', '名称', 'URL', '描述']
        setup_table_widget(self.link_table, headers)
        
        # 按钮栏
        button_layout = QHBoxLayout()
        refresh_button = QPushButton('刷新')
        refresh_button.clicked.connect(self.load_links)
        
        edit_button = QPushButton('编辑')
        edit_button.clicked.connect(self.edit_link)
        
        delete_button = QPushButton('删除')
        delete_button.clicked.connect(self.delete_link)
        
        create_button = QPushButton('创建')
        create_button.clicked.connect(self.create_link)
        
        button_layout.addWidget(refresh_button)
        button_layout.addWidget(edit_button)
        button_layout.addWidget(delete_button)
        button_layout.addWidget(create_button)
        
        # 添加到布局
        layout.addLayout(search_layout)
        layout.addWidget(self.link_table)
        layout.addLayout(button_layout)
        
        # 加载链接列表
        self.load_links()
    
    def load_links(self):
        """加载链接列表"""
        try:
            links = read_json(self.links_json)
            clear_table(self.link_table)
            
            for link in links:
                add_table_row(
                    self.link_table, 
                    [link['id'], link['name'], link['url'], link.get('description', '')]
                )
            
        except Exception as e:
            show_error_message(self, '错误', f'加载链接失败: {e}')
    
    def search_links(self):
        """搜索链接"""
        search_text = self.search_input.text().lower()
        if not search_text:
            self.load_links()
            return
        
        try:
            links = read_json(self.links_json)
            filtered_links = [
                link for link in links 
                if search_text in link['name'].lower() or 
                   search_text in link['url'].lower() or
                   search_text in link.get('description', '').lower()
            ]
            
            clear_table(self.link_table)
            for link in filtered_links:
                add_table_row(
                    self.link_table, 
                    [link['id'], link['name'], link['url'], link.get('description', '')]
                )
            
        except Exception as e:
            show_error_message(self, '错误', f'搜索失败: {e}')
    
    def edit_link(self):
        """编辑链接"""
        row = get_selected_row(self.link_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一个链接')
            return
        
        link_id = self.link_table.item(row, 0).text()
        
        try:
            links = read_json(self.links_json)
            link = next((l for l in links if l['id'] == link_id), None)
            
            if link:
                # 创建编辑窗口
                edit_widget = QWidget()
                edit_layout = QFormLayout(edit_widget)
                
                # 名称
                name_edit = QLineEdit(link['name'])
                edit_layout.addRow('名称:', name_edit)
                
                # URL
                url_edit = QLineEdit(link['url'])
                edit_layout.addRow('URL:', url_edit)
                
                # 描述
                desc_edit = QTextEdit(link.get('description', ''))
                edit_layout.addRow('描述:', desc_edit)
                
                # 按钮
                button_layout = QHBoxLayout()
                save_button = QPushButton('保存')
                cancel_button = QPushButton('取消')
                
                def save_changes():
                    link['name'] = name_edit.text()
                    link['url'] = url_edit.text()
                    link['description'] = desc_edit.toPlainText()
                    
                    if write_json(self.links_json, links):
                        show_info_message(self, '成功', '链接已更新')
                        self.load_links()
                        edit_widget.close()
                    else:
                        show_error_message(self, '错误', '保存失败')
                
                save_button.clicked.connect(save_changes)
                cancel_button.clicked.connect(edit_widget.close)
                
                button_layout.addWidget(save_button)
                button_layout.addWidget(cancel_button)
                edit_layout.addRow(button_layout)
                
                edit_widget.setWindowTitle('编辑链接')
                edit_widget.resize(500, 400)
                edit_widget.show()
            else:
                show_error_message(self, '错误', '链接不存在')
                
        except Exception as e:
            show_error_message(self, '错误', f'编辑失败: {e}')
    
    def delete_link(self):
        """删除链接"""
        row = get_selected_row(self.link_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一个链接')
            return
        
        link_id = self.link_table.item(row, 0).text()
        link_name = self.link_table.item(row, 1).text()
        
        if show_question_message(self, '确认删除', f'确定要删除链接 "{link_name}" 吗？'):
            try:
                links = read_json(self.links_json)
                links = [l for l in links if l['id'] != link_id]
                
                if write_json(self.links_json, links):
                    show_info_message(self, '成功', '链接已删除')
                    self.load_links()
                else:
                    show_error_message(self, '错误', '删除失败')
                    
            except Exception as e:
                show_error_message(self, '错误', f'删除失败: {e}')
    
    def create_link(self):
        """创建链接"""
        # 创建创建窗口
        create_widget = QWidget()
        create_layout = QFormLayout(create_widget)
        
        # 名称
        name_edit = QLineEdit()
        create_layout.addRow('名称:', name_edit)
        
        # URL
        url_edit = QLineEdit()
        create_layout.addRow('URL:', url_edit)
        
        # 描述
        desc_edit = QTextEdit()
        create_layout.addRow('描述:', desc_edit)
        
        # 按钮
        button_layout = QHBoxLayout()
        save_button = QPushButton('创建')
        cancel_button = QPushButton('取消')
        
        def save_link():
            try:
                links = read_json(self.links_json)
                
                # 生成新ID
                max_id = max(int(l['id']) for l in links if l['id'].isdigit()) if links else -1
                new_id = str(max_id + 1)
                
                # 创建新链接
                new_link = {
                    'id': new_id,
                    'name': name_edit.text(),
                    'url': url_edit.text(),
                    'description': desc_edit.toPlainText()
                }
                
                links.append(new_link)
                
                if write_json(self.links_json, links):
                    show_info_message(self, '成功', '链接已创建')
                    self.load_links()
                    create_widget.close()
                else:
                    show_error_message(self, '错误', '创建失败')
                    
            except Exception as e:
                show_error_message(self, '错误', f'创建失败: {e}')
        
        save_button.clicked.connect(save_link)
        cancel_button.clicked.connect(create_widget.close)
        
        button_layout.addWidget(save_button)
        button_layout.addWidget(cancel_button)
        create_layout.addRow(button_layout)
        
        create_widget.setWindowTitle('创建链接')
        create_widget.resize(500, 400)
        create_widget.show()