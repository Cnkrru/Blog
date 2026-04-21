#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
配置管理模块
"""

from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QTableWidget,
    QTableWidgetItem, QLineEdit, QLabel, QFormLayout, QComboBox
)
from PyQt5.QtCore import Qt
from pathlib import Path
import json
import yaml

from utils.common import get_project_root, read_json, write_json, read_yaml, write_yaml
from utils.ui_utils import (
    setup_table_widget, add_table_row, clear_table, get_selected_row,
    show_info_message, show_error_message, show_question_message
)

class ConfigManagementPanel(QWidget):
    """配置管理面板"""
    
    def __init__(self, project_root):
        super().__init__()
        self.project_root = project_root
        self.config_dir = project_root / 'public' / 'config'
        self.init_ui()
    
    def init_ui(self):
        """初始化界面"""
        layout = QVBoxLayout(self)
        
        # 配置文件列表
        self.config_table = QTableWidget()
        headers = ['配置文件', '类型', '大小']
        setup_table_widget(self.config_table, headers)
        
        # 按钮栏
        button_layout = QHBoxLayout()
        refresh_button = QPushButton('刷新')
        refresh_button.clicked.connect(self.load_configs)
        
        edit_button = QPushButton('编辑')
        edit_button.clicked.connect(self.edit_config)
        
        button_layout.addWidget(refresh_button)
        button_layout.addWidget(edit_button)
        
        # 添加到布局
        layout.addWidget(self.config_table)
        layout.addLayout(button_layout)
        
        # 加载配置文件列表
        self.load_configs()
    
    def load_configs(self):
        """加载配置文件列表"""
        try:
            if not self.config_dir.exists():
                show_info_message(self, '提示', '配置目录不存在')
                return
            
            # 获取配置文件
            config_files = list(self.config_dir.glob('*.*'))
            
            # 显示配置文件
            clear_table(self.config_table)
            for config_file in config_files:
                file_type = config_file.suffix[1:]
                file_size = config_file.stat().st_size
                add_table_row(self.config_table, [config_file.name, file_type, f'{file_size} bytes'])
                
        except Exception as e:
            show_error_message(self, '错误', f'加载配置失败: {e}')
    
    def edit_config(self):
        """编辑配置文件"""
        row = get_selected_row(self.config_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一个配置文件')
            return
        
        config_name = self.config_table.item(row, 0).text()
        config_file = self.config_dir / config_name
        file_type = self.config_table.item(row, 1).text()
        
        try:
            # 读取配置文件
            if file_type == 'json':
                config_data = read_json(config_file)
            elif file_type in ['yaml', 'yml']:
                config_data = read_yaml(config_file)
            else:
                show_info_message(self, '提示', '不支持的配置文件类型')
                return
            
            # 创建编辑窗口
            edit_widget = QWidget()
            edit_layout = QVBoxLayout(edit_widget)
            
            # 显示配置内容
            import json
            config_text = json.dumps(config_data, ensure_ascii=False, indent=2)
            
            from PyQt5.QtWidgets import QTextEdit
            text_edit = QTextEdit(config_text)
            edit_layout.addWidget(text_edit)
            
            # 按钮
            button_layout = QHBoxLayout()
            save_button = QPushButton('保存')
            cancel_button = QPushButton('取消')
            
            def save_config():
                try:
                    new_config = json.loads(text_edit.toPlainText())
                    
                    if file_type == 'json':
                        success = write_json(config_file, new_config)
                    elif file_type in ['yaml', 'yml']:
                        success = write_yaml(config_file, new_config)
                    
                    if success:
                        show_info_message(edit_widget, '成功', '配置已保存')
                        edit_widget.close()
                    else:
                        show_error_message(edit_widget, '错误', '保存失败')
                        
                except json.JSONDecodeError as e:
                    show_error_message(edit_widget, '错误', f'JSON格式错误: {e}')
                except Exception as e:
                    show_error_message(edit_widget, '错误', f'保存失败: {e}')
            
            save_button.clicked.connect(save_config)
            cancel_button.clicked.connect(edit_widget.close)
            
            button_layout.addWidget(save_button)
            button_layout.addWidget(cancel_button)
            edit_layout.addLayout(button_layout)
            
            edit_widget.setWindowTitle(f'编辑配置: {config_name}')
            edit_widget.resize(600, 500)
            edit_widget.show()
            
        except Exception as e:
            show_error_message(self, '错误', f'编辑配置失败: {e}')