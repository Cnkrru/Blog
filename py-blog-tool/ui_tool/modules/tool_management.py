#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
工具页面管理模块
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

class ToolManagementPanel(QWidget):
    """工具页面管理面板"""
    
    def __init__(self, project_root):
        super().__init__()
        self.project_root = project_root
        self.tools_json = project_root / 'public' / 'config' / 'tools.json'
        self.init_ui()
    
    def init_ui(self):
        """初始化界面"""
        layout = QVBoxLayout(self)
        
        # 搜索栏
        search_layout = QHBoxLayout()
        search_label = QLabel('搜索:')
        self.search_input = QLineEdit()
        search_button = QPushButton('搜索')
        search_button.clicked.connect(self.search_tools)
        
        search_layout.addWidget(search_label)
        search_layout.addWidget(self.search_input)
        search_layout.addWidget(search_button)
        
        # 工具列表
        self.tool_table = QTableWidget()
        headers = ['ID', '标题', '描述']
        setup_table_widget(self.tool_table, headers)
        
        # 按钮栏
        button_layout = QHBoxLayout()
        refresh_button = QPushButton('刷新')
        refresh_button.clicked.connect(self.load_tools)
        
        preview_button = QPushButton('预览')
        preview_button.clicked.connect(self.preview_tool)
        
        edit_button = QPushButton('编辑')
        edit_button.clicked.connect(self.edit_tool)
        
        delete_button = QPushButton('删除')
        delete_button.clicked.connect(self.delete_tool)
        
        create_button = QPushButton('创建')
        create_button.clicked.connect(self.create_tool)
        
        button_layout.addWidget(refresh_button)
        button_layout.addWidget(preview_button)
        button_layout.addWidget(edit_button)
        button_layout.addWidget(delete_button)
        button_layout.addWidget(create_button)
        
        # 添加到布局
        layout.addLayout(search_layout)
        layout.addWidget(self.tool_table)
        layout.addLayout(button_layout)
        
        # 加载工具列表
        self.load_tools()
    
    def load_tools(self):
        """加载工具列表"""
        try:
            tools = read_json(self.tools_json)
            clear_table(self.tool_table)
            
            for tool in tools:
                add_table_row(
                    self.tool_table, 
                    [tool['id'], tool['title'], tool.get('description', '')]
                )
            
        except Exception as e:
            show_error_message(self, '错误', f'加载工具失败: {e}')
    
    def search_tools(self):
        """搜索工具"""
        search_text = self.search_input.text().lower()
        if not search_text:
            self.load_tools()
            return
        
        try:
            tools = read_json(self.tools_json)
            filtered_tools = [
                tool for tool in tools 
                if search_text in tool['title'].lower() or 
                   search_text in tool.get('description', '').lower()
            ]
            
            clear_table(self.tool_table)
            for tool in filtered_tools:
                add_table_row(
                    self.tool_table, 
                    [tool['id'], tool['title'], tool.get('description', '')]
                )
            
        except Exception as e:
            show_error_message(self, '错误', f'搜索失败: {e}')
    
    def preview_tool(self):
        """预览工具"""
        row = get_selected_row(self.tool_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一个工具')
            return
        
        tool_id = self.tool_table.item(row, 0).text()
        
        try:
            tools = read_json(self.tools_json)
            tool = next((t for t in tools if t['id'] == tool_id), None)
            
            if tool:
                # 创建预览窗口
                preview_widget = QWidget()
                preview_layout = QVBoxLayout(preview_widget)
                
                title_label = QLabel(f"标题: {tool['title']}")
                title_label.setStyleSheet("font-size: 16px; font-weight: bold;")
                
                desc_label = QLabel("描述:")
                desc_text = QTextEdit()
                desc_text.setPlainText(tool.get('description', '无'))
                desc_text.setReadOnly(True)
                
                preview_layout.addWidget(title_label)
                preview_layout.addWidget(desc_label)
                preview_layout.addWidget(desc_text)
                
                preview_widget.setWindowTitle('工具预览')
                preview_widget.resize(600, 400)
                preview_widget.show()
            else:
                show_error_message(self, '错误', '工具不存在')
                
        except Exception as e:
            show_error_message(self, '错误', f'预览失败: {e}')
    
    def edit_tool(self):
        """编辑工具"""
        row = get_selected_row(self.tool_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一个工具')
            return
        
        tool_id = self.tool_table.item(row, 0).text()
        
        try:
            tools = read_json(self.tools_json)
            tool = next((t for t in tools if t['id'] == tool_id), None)
            
            if tool:
                # 创建编辑窗口
                edit_widget = QWidget()
                edit_layout = QFormLayout(edit_widget)
                
                # 标题
                title_edit = QLineEdit(tool['title'])
                edit_layout.addRow('标题:', title_edit)
                
                # 描述
                desc_edit = QTextEdit(tool.get('description', ''))
                edit_layout.addRow('描述:', desc_edit)
                
                # 按钮
                button_layout = QHBoxLayout()
                save_button = QPushButton('保存')
                cancel_button = QPushButton('取消')
                
                def save_changes():
                    tool['title'] = title_edit.text()
                    tool['description'] = desc_edit.toPlainText()
                    
                    if write_json(self.tools_json, tools):
                        show_info_message(self, '成功', '工具已更新')
                        self.load_tools()
                        edit_widget.close()
                    else:
                        show_error_message(self, '错误', '保存失败')
                
                save_button.clicked.connect(save_changes)
                cancel_button.clicked.connect(edit_widget.close)
                
                button_layout.addWidget(save_button)
                button_layout.addWidget(cancel_button)
                edit_layout.addRow(button_layout)
                
                edit_widget.setWindowTitle('编辑工具')
                edit_widget.resize(500, 400)
                edit_widget.show()
            else:
                show_error_message(self, '错误', '工具不存在')
                
        except Exception as e:
            show_error_message(self, '错误', f'编辑失败: {e}')
    
    def delete_tool(self):
        """删除工具"""
        row = get_selected_row(self.tool_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一个工具')
            return
        
        tool_id = self.tool_table.item(row, 0).text()
        tool_title = self.tool_table.item(row, 1).text()
        
        if show_question_message(self, '确认删除', f'确定要删除工具 "{tool_title}" 吗？'):
            try:
                tools = read_json(self.tools_json)
                tools = [t for t in tools if t['id'] != tool_id]
                
                if write_json(self.tools_json, tools):
                    show_info_message(self, '成功', '工具已删除')
                    self.load_tools()
                else:
                    show_error_message(self, '错误', '删除失败')
                    
            except Exception as e:
                show_error_message(self, '错误', f'删除失败: {e}')
    
    def create_tool(self):
        """创建工具"""
        # 创建创建窗口
        create_widget = QWidget()
        create_layout = QFormLayout(create_widget)
        
        # 标题
        title_edit = QLineEdit()
        create_layout.addRow('标题:', title_edit)
        
        # 描述
        desc_edit = QTextEdit()
        create_layout.addRow('描述:', desc_edit)
        
        # 按钮
        button_layout = QHBoxLayout()
        save_button = QPushButton('创建')
        cancel_button = QPushButton('取消')
        
        def save_tool():
            try:
                tools = read_json(self.tools_json)
                
                # 生成新ID
                max_id = max(int(t['id']) for t in tools if t['id'].isdigit()) if tools else -1
                new_id = str(max_id + 1)
                
                # 创建新工具
                new_tool = {
                    'id': new_id,
                    'title': title_edit.text(),
                    'description': desc_edit.toPlainText()
                }
                
                tools.append(new_tool)
                
                if write_json(self.tools_json, tools):
                    show_info_message(self, '成功', '工具已创建')
                    self.load_tools()
                    create_widget.close()
                else:
                    show_error_message(self, '错误', '创建失败')
                    
            except Exception as e:
                show_error_message(self, '错误', f'创建失败: {e}')
        
        save_button.clicked.connect(save_tool)
        cancel_button.clicked.connect(create_widget.close)
        
        button_layout.addWidget(save_button)
        button_layout.addWidget(cancel_button)
        create_layout.addRow(button_layout)
        
        create_widget.setWindowTitle('创建工具')
        create_widget.resize(500, 400)
        create_widget.show()