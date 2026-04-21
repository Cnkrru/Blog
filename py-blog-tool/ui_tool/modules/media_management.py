#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
媒体管理模块
"""

from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QTableWidget,
    QTableWidgetItem, QLabel, QFileDialog, QTextEdit, QFormLayout,
    QListWidget, QListWidgetItem, QSplitter, QComboBox
)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QPixmap
from pathlib import Path
import os
import shutil

from utils.common import get_project_root, ensure_directory
from utils.ui_utils import (
    setup_table_widget, add_table_row, clear_table, get_selected_row,
    show_info_message, show_error_message, show_question_message
)

class MediaManagementPanel(QWidget):
    """媒体管理面板"""
    
    def __init__(self, project_root):
        super().__init__()
        self.project_root = project_root
        self.media_dir = project_root / 'src' / 'assets' / 'imgs'
        self.init_ui()
    
    def init_ui(self):
        """初始化界面"""
        layout = QVBoxLayout(self)
        
        # 功能按钮
        button_layout = QHBoxLayout()
        upload_button = QPushButton('上传文件')
        upload_button.clicked.connect(self.upload_file)
        
        refresh_button = QPushButton('刷新')
        refresh_button.clicked.connect(self.load_media)
        
        delete_button = QPushButton('删除')
        delete_button.clicked.connect(self.delete_file)
        
        button_layout.addWidget(upload_button)
        button_layout.addWidget(refresh_button)
        button_layout.addWidget(delete_button)
        
        # 分类选择
        category_layout = QHBoxLayout()
        category_label = QLabel('分类:')
        self.category_combo = QComboBox()
        self.category_combo.addItems(['所有', '图片', '文档', '其他'])
        self.category_combo.currentTextChanged.connect(self.filter_media)
        
        category_layout.addWidget(category_label)
        category_layout.addWidget(self.category_combo)
        
        # 主内容区域
        splitter = QSplitter(Qt.Horizontal)
        
        # 左侧文件列表
        self.media_table = QTableWidget()
        headers = ['文件名', '类型', '大小', '修改时间']
        setup_table_widget(self.media_table, headers)
        
        # 右侧预览
        preview_widget = QWidget()
        preview_layout = QVBoxLayout(preview_widget)
        
        self.preview_label = QLabel('预览')
        self.preview_label.setAlignment(Qt.AlignCenter)
        self.preview_label.setStyleSheet("border: 1px solid #ddd;")
        
        self.file_info = QTextEdit()
        self.file_info.setReadOnly(True)
        
        preview_layout.addWidget(self.preview_label)
        preview_layout.addWidget(self.file_info)
        
        splitter.addWidget(self.media_table)
        splitter.addWidget(preview_widget)
        splitter.setSizes([600, 400])
        
        # 连接信号
        self.media_table.itemSelectionChanged.connect(self.update_preview)
        
        # 添加到布局
        layout.addLayout(button_layout)
        layout.addLayout(category_layout)
        layout.addWidget(splitter)
        
        # 加载媒体文件
        self.load_media()
    
    def load_media(self):
        """加载媒体文件"""
        try:
            # 确保媒体目录存在
            ensure_directory(self.media_dir)
            
            # 获取所有媒体文件
            media_files = []
            for root, dirs, files in os.walk(self.media_dir):
                for file in files:
                    file_path = Path(root) / file
                    media_files.append(file_path)
            
            # 显示媒体文件
            clear_table(self.media_table)
            for file_path in media_files:
                rel_path = file_path.relative_to(self.project_root)
                file_type = file_path.suffix[1:].lower()
                file_size = file_path.stat().st_size
                mtime = file_path.stat().st_mtime
                mtime_str = self.format_datetime(mtime)
                
                add_table_row(
                    self.media_table, 
                    [file_path.name, file_type, f'{file_size} bytes', mtime_str]
                )
            
        except Exception as e:
            show_error_message(self, '错误', f'加载媒体文件失败: {e}')
    
    def filter_media(self):
        """过滤媒体文件"""
        category = self.category_combo.currentText()
        if category == '所有':
            self.load_media()
            return
        
        try:
            # 获取所有媒体文件
            media_files = []
            for root, dirs, files in os.walk(self.media_dir):
                for file in files:
                    file_path = Path(root) / file
                    media_files.append(file_path)
            
            # 过滤文件
            filtered_files = []
            for file_path in media_files:
                file_type = file_path.suffix[1:].lower()
                if category == '图片' and file_type in ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']:
                    filtered_files.append(file_path)
                elif category == '文档' and file_type in ['md', 'txt', 'pdf', 'doc', 'docx']:
                    filtered_files.append(file_path)
                elif category == '其他':
                    file_type = file_path.suffix[1:].lower()
                    if file_type not in ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'md', 'txt', 'pdf', 'doc', 'docx']:
                        filtered_files.append(file_path)
            
            # 显示过滤后的文件
            clear_table(self.media_table)
            for file_path in filtered_files:
                rel_path = file_path.relative_to(self.project_root)
                file_type = file_path.suffix[1:].lower()
                file_size = file_path.stat().st_size
                mtime = file_path.stat().st_mtime
                mtime_str = self.format_datetime(mtime)
                
                add_table_row(
                    self.media_table, 
                    [file_path.name, file_type, f'{file_size} bytes', mtime_str]
                )
            
        except Exception as e:
            show_error_message(self, '错误', f'过滤媒体文件失败: {e}')
    
    def upload_file(self):
        """上传文件"""
        try:
            # 打开文件选择对话框
            file_dialog = QFileDialog()
            file_dialog.setFileMode(QFileDialog.ExistingFiles)
            file_dialog.setWindowTitle('选择要上传的文件')
            
            if file_dialog.exec_() == QFileDialog.Accepted:
                files = file_dialog.selectedFiles()
                uploaded = 0
                
                for file_path in files:
                    src_path = Path(file_path)
                    dest_path = self.media_dir / src_path.name
                    
                    # 确保目标目录存在
                    ensure_directory(self.media_dir)
                    
                    # 复制文件
                    shutil.copy2(src_path, dest_path)
                    uploaded += 1
                
                show_info_message(self, '成功', f'已上传 {uploaded} 个文件')
                self.load_media()
                
        except Exception as e:
            show_error_message(self, '错误', f'上传文件失败: {e}')
    
    def delete_file(self):
        """删除文件"""
        row = get_selected_row(self.media_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一个文件')
            return
        
        file_name = self.media_table.item(row, 0).text()
        file_path = self.media_dir / file_name
        
        if show_question_message(self, '确认删除', f'确定要删除文件 "{file_name}" 吗？'):
            try:
                if file_path.exists():
                    file_path.unlink()
                show_info_message(self, '成功', '文件已删除')
                self.load_media()
                
            except Exception as e:
                show_error_message(self, '错误', f'删除文件失败: {e}')
    
    def update_preview(self):
        """更新预览"""
        row = get_selected_row(self.media_table)
        if row == -1:
            self.preview_label.setText('预览')
            self.file_info.setPlainText('')
            return
        
        file_name = self.media_table.item(row, 0).text()
        file_path = self.media_dir / file_name
        
        try:
            # 显示文件信息
            file_size = file_path.stat().st_size
            mtime = file_path.stat().st_mtime
            mtime_str = self.format_datetime(mtime)
            file_type = file_path.suffix[1:].lower()
            
            info = f"文件名: {file_name}\n"
            info += f"路径: {file_path.relative_to(self.project_root)}\n"
            info += f"大小: {file_size} bytes\n"
            info += f"修改时间: {mtime_str}\n"
            info += f"类型: {file_type}"
            
            self.file_info.setPlainText(info)
            
            # 显示预览
            if file_type in ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']:
                pixmap = QPixmap(str(file_path))
                if not pixmap.isNull():
                    # 调整预览大小
                    preview_size = self.preview_label.size()
                    scaled_pixmap = pixmap.scaled(
                        preview_size.width() - 20, 
                        preview_size.height() - 20, 
                        Qt.KeepAspectRatio
                    )
                    self.preview_label.setPixmap(scaled_pixmap)
                else:
                    self.preview_label.setText('无法预览')
            else:
                self.preview_label.setText('无法预览此类型文件')
                
        except Exception as e:
            show_error_message(self, '错误', f'更新预览失败: {e}')
    
    def format_datetime(self, timestamp):
        """格式化时间戳"""
        from datetime import datetime
        return datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')