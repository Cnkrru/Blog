#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
日志管理模块
"""

from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QTableWidget,
    QTableWidgetItem, QTextEdit, QLabel
)
from PyQt5.QtCore import Qt
from pathlib import Path
import os
import datetime

from utils.common import get_project_root
from utils.ui_utils import (
    setup_table_widget, add_table_row, clear_table, get_selected_row,
    show_info_message, show_error_message, show_question_message
)

class LogManagementPanel(QWidget):
    """日志管理面板"""
    
    def __init__(self, project_root):
        super().__init__()
        self.project_root = project_root
        self.log_dir = project_root / 'logs'
        self.init_ui()
    
    def init_ui(self):
        """初始化界面"""
        layout = QVBoxLayout(self)
        
        # 日志文件列表
        self.log_table = QTableWidget()
        headers = ['日志文件', '修改时间', '大小']
        setup_table_widget(self.log_table, headers)
        
        # 日志内容显示
        self.log_content = QTextEdit()
        self.log_content.setReadOnly(True)
        
        # 按钮栏
        button_layout = QHBoxLayout()
        refresh_button = QPushButton('刷新')
        refresh_button.clicked.connect(self.load_logs)
        
        view_button = QPushButton('查看')
        view_button.clicked.connect(self.view_log)
        
        clean_button = QPushButton('清理过期日志')
        clean_button.clicked.connect(self.clean_logs)
        
        button_layout.addWidget(refresh_button)
        button_layout.addWidget(view_button)
        button_layout.addWidget(clean_button)
        
        # 添加到布局
        layout.addWidget(self.log_table)
        layout.addWidget(self.log_content)
        layout.addLayout(button_layout)
        
        # 加载日志文件列表
        self.load_logs()
    
    def load_logs(self):
        """加载日志文件列表"""
        try:
            # 确保日志目录存在
            if not self.log_dir.exists():
                self.log_dir.mkdir(parents=True, exist_ok=True)
            
            # 获取日志文件
            log_files = list(self.log_dir.glob('*.log'))
            
            # 显示日志文件
            clear_table(self.log_table)
            for log_file in log_files:
                mtime = log_file.stat().st_mtime
                size = log_file.stat().st_size
                mtime_str = datetime.datetime.fromtimestamp(mtime).strftime('%Y-%m-%d %H:%M:%S')
                add_table_row(self.log_table, [log_file.name, mtime_str, f'{size} bytes'])
                
        except Exception as e:
            show_error_message(self, '错误', f'加载日志失败: {e}')
    
    def view_log(self):
        """查看日志文件"""
        row = get_selected_row(self.log_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一个日志文件')
            return
        
        log_name = self.log_table.item(row, 0).text()
        log_file = self.log_dir / log_name
        
        try:
            # 读取日志内容
            with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # 显示日志内容
            self.log_content.setPlainText(content)
            
        except Exception as e:
            show_error_message(self, '错误', f'查看日志失败: {e}')
    
    def clean_logs(self):
        """清理过期日志"""
        if show_question_message(self, '确认清理', '确定要清理过期日志吗？\n将删除30天前的日志文件。'):
            try:
                # 获取30天前的日期
                cutoff_date = datetime.datetime.now() - datetime.timedelta(days=30)
                
                # 清理过期日志
                cleaned = []
                if self.log_dir.exists():
                    for log_file in self.log_dir.glob('*.log'):
                        mtime = log_file.stat().st_mtime
                        log_date = datetime.datetime.fromtimestamp(mtime)
                        if log_date < cutoff_date:
                            log_file.unlink()
                            cleaned.append(log_file.name)
                
                if cleaned:
                    show_info_message(self, '成功', f'已清理 {len(cleaned)} 个过期日志文件')
                    self.load_logs()
                else:
                    show_info_message(self, '提示', '没有过期日志需要清理')
                    
            except Exception as e:
                show_error_message(self, '错误', f'清理日志失败: {e}')