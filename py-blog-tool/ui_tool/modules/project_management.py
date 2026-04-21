#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
项目管理模块
"""

from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QTableWidget,
    QTableWidgetItem, QLineEdit, QLabel, QTextEdit, QFormLayout, QDateEdit
)
from PyQt5.QtCore import Qt, QDate
from pathlib import Path
import json

from utils.common import get_project_root, read_json, write_json
from utils.ui_utils import (
    setup_table_widget, add_table_row, clear_table, get_selected_row,
    show_info_message, show_error_message, show_question_message
)

class ProjectManagementPanel(QWidget):
    """项目管理面板"""
    
    def __init__(self, project_root):
        super().__init__()
        self.project_root = project_root
        self.projects_json = project_root / 'public' / 'config' / 'projects.json'
        self.init_ui()
    
    def init_ui(self):
        """初始化界面"""
        layout = QVBoxLayout(self)
        
        # 搜索栏
        search_layout = QHBoxLayout()
        search_label = QLabel('搜索:')
        self.search_input = QLineEdit()
        search_button = QPushButton('搜索')
        search_button.clicked.connect(self.search_projects)
        
        search_layout.addWidget(search_label)
        search_layout.addWidget(self.search_input)
        search_layout.addWidget(search_button)
        
        # 项目列表
        self.project_table = QTableWidget()
        headers = ['ID', '标题', '描述', '日期']
        setup_table_widget(self.project_table, headers)
        
        # 按钮栏
        button_layout = QHBoxLayout()
        refresh_button = QPushButton('刷新')
        refresh_button.clicked.connect(self.load_projects)
        
        preview_button = QPushButton('预览')
        preview_button.clicked.connect(self.preview_project)
        
        edit_button = QPushButton('编辑')
        edit_button.clicked.connect(self.edit_project)
        
        delete_button = QPushButton('删除')
        delete_button.clicked.connect(self.delete_project)
        
        create_button = QPushButton('创建')
        create_button.clicked.connect(self.create_project)
        
        button_layout.addWidget(refresh_button)
        button_layout.addWidget(preview_button)
        button_layout.addWidget(edit_button)
        button_layout.addWidget(delete_button)
        button_layout.addWidget(create_button)
        
        # 添加到布局
        layout.addLayout(search_layout)
        layout.addWidget(self.project_table)
        layout.addLayout(button_layout)
        
        # 加载项目列表
        self.load_projects()
    
    def load_projects(self):
        """加载项目列表"""
        try:
            projects = read_json(self.projects_json)
            clear_table(self.project_table)
            
            for project in projects:
                add_table_row(
                    self.project_table, 
                    [project['id'], project['title'], project.get('description', ''), 
                     project.get('date', '')]
                )
            
        except Exception as e:
            show_error_message(self, '错误', f'加载项目失败: {e}')
    
    def search_projects(self):
        """搜索项目"""
        search_text = self.search_input.text().lower()
        if not search_text:
            self.load_projects()
            return
        
        try:
            projects = read_json(self.projects_json)
            filtered_projects = [
                project for project in projects 
                if search_text in project['title'].lower() or 
                   search_text in project.get('description', '').lower()
            ]
            
            clear_table(self.project_table)
            for project in filtered_projects:
                add_table_row(
                    self.project_table, 
                    [project['id'], project['title'], project.get('description', ''), 
                     project.get('date', '')]
                )
            
        except Exception as e:
            show_error_message(self, '错误', f'搜索失败: {e}')
    
    def preview_project(self):
        """预览项目"""
        row = get_selected_row(self.project_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一个项目')
            return
        
        project_id = self.project_table.item(row, 0).text()
        
        try:
            projects = read_json(self.projects_json)
            project = next((p for p in projects if p['id'] == project_id), None)
            
            if project:
                # 创建预览窗口
                preview_widget = QWidget()
                preview_layout = QVBoxLayout(preview_widget)
                
                title_label = QLabel(f"标题: {project['title']}")
                title_label.setStyleSheet("font-size: 16px; font-weight: bold;")
                
                date_label = QLabel(f"日期: {project.get('date', '无')}")
                
                desc_label = QLabel("描述:")
                desc_text = QTextEdit()
                desc_text.setPlainText(project.get('description', '无'))
                desc_text.setReadOnly(True)
                
                preview_layout.addWidget(title_label)
                preview_layout.addWidget(date_label)
                preview_layout.addWidget(desc_label)
                preview_layout.addWidget(desc_text)
                
                preview_widget.setWindowTitle('项目预览')
                preview_widget.resize(600, 400)
                preview_widget.show()
            else:
                show_error_message(self, '错误', '项目不存在')
                
        except Exception as e:
            show_error_message(self, '错误', f'预览失败: {e}')
    
    def edit_project(self):
        """编辑项目"""
        row = get_selected_row(self.project_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一个项目')
            return
        
        project_id = self.project_table.item(row, 0).text()
        
        try:
            projects = read_json(self.projects_json)
            project = next((p for p in projects if p['id'] == project_id), None)
            
            if project:
                # 创建编辑窗口
                edit_widget = QWidget()
                edit_layout = QFormLayout(edit_widget)
                
                # 标题
                title_edit = QLineEdit(project['title'])
                edit_layout.addRow('标题:', title_edit)
                
                # 日期
                date_edit = QDateEdit()
                if project.get('date'):
                    date = QDate.fromString(project['date'], 'yyyy-MM-dd')
                    date_edit.setDate(date)
                edit_layout.addRow('日期:', date_edit)
                
                # 描述
                desc_edit = QTextEdit(project.get('description', ''))
                edit_layout.addRow('描述:', desc_edit)
                
                # 按钮
                button_layout = QHBoxLayout()
                save_button = QPushButton('保存')
                cancel_button = QPushButton('取消')
                
                def save_changes():
                    project['title'] = title_edit.text()
                    project['date'] = date_edit.date().toString('yyyy-MM-dd')
                    project['description'] = desc_edit.toPlainText()
                    
                    if write_json(self.projects_json, projects):
                        show_info_message(self, '成功', '项目已更新')
                        self.load_projects()
                        edit_widget.close()
                    else:
                        show_error_message(self, '错误', '保存失败')
                
                save_button.clicked.connect(save_changes)
                cancel_button.clicked.connect(edit_widget.close)
                
                button_layout.addWidget(save_button)
                button_layout.addWidget(cancel_button)
                edit_layout.addRow(button_layout)
                
                edit_widget.setWindowTitle('编辑项目')
                edit_widget.resize(500, 400)
                edit_widget.show()
            else:
                show_error_message(self, '错误', '项目不存在')
                
        except Exception as e:
            show_error_message(self, '错误', f'编辑失败: {e}')
    
    def delete_project(self):
        """删除项目"""
        row = get_selected_row(self.project_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一个项目')
            return
        
        project_id = self.project_table.item(row, 0).text()
        project_title = self.project_table.item(row, 1).text()
        
        if show_question_message(self, '确认删除', f'确定要删除项目 "{project_title}" 吗？'):
            try:
                projects = read_json(self.projects_json)
                projects = [p for p in projects if p['id'] != project_id]
                
                if write_json(self.projects_json, projects):
                    show_info_message(self, '成功', '项目已删除')
                    self.load_projects()
                else:
                    show_error_message(self, '错误', '删除失败')
                    
            except Exception as e:
                show_error_message(self, '错误', f'删除失败: {e}')
    
    def create_project(self):
        """创建项目"""
        # 创建创建窗口
        create_widget = QWidget()
        create_layout = QFormLayout(create_widget)
        
        # 标题
        title_edit = QLineEdit()
        create_layout.addRow('标题:', title_edit)
        
        # 日期
        date_edit = QDateEdit()
        date_edit.setDate(QDate.currentDate())
        create_layout.addRow('日期:', date_edit)
        
        # 描述
        desc_edit = QTextEdit()
        create_layout.addRow('描述:', desc_edit)
        
        # 按钮
        button_layout = QHBoxLayout()
        save_button = QPushButton('创建')
        cancel_button = QPushButton('取消')
        
        def save_project():
            try:
                projects = read_json(self.projects_json)
                
                # 生成新ID
                max_id = max(int(p['id']) for p in projects if p['id'].isdigit()) if projects else -1
                new_id = str(max_id + 1)
                
                # 创建新项目
                new_project = {
                    'id': new_id,
                    'title': title_edit.text(),
                    'date': date_edit.date().toString('yyyy-MM-dd'),
                    'description': desc_edit.toPlainText()
                }
                
                projects.append(new_project)
                
                if write_json(self.projects_json, projects):
                    show_info_message(self, '成功', '项目已创建')
                    self.load_projects()
                    create_widget.close()
                else:
                    show_error_message(self, '错误', '创建失败')
                    
            except Exception as e:
                show_error_message(self, '错误', f'创建失败: {e}')
        
        save_button.clicked.connect(save_project)
        cancel_button.clicked.connect(create_widget.close)
        
        button_layout.addWidget(save_button)
        button_layout.addWidget(cancel_button)
        create_layout.addRow(button_layout)
        
        create_widget.setWindowTitle('创建项目')
        create_widget.resize(500, 400)
        create_widget.show()