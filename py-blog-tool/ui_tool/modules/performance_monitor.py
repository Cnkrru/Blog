#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
性能监控模块
"""

from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QTableWidget,
    QTableWidgetItem, QLabel, QTextEdit, QGroupBox, QProgressBar
)
from PyQt5.QtCore import Qt, QThread, pyqtSignal
from pathlib import Path
import os
import time
import json
import requests
from urllib.parse import urljoin

from utils.common import get_project_root, read_json, write_json
from utils.ui_utils import (
    setup_table_widget, add_table_row, clear_table, get_selected_row,
    show_info_message, show_error_message, show_question_message
)

class PerformanceMonitorThread(QThread):
    """性能监控线程"""
    update_progress = pyqtSignal(int)
    update_result = pyqtSignal(dict)
    update_error = pyqtSignal(str)
    
    def __init__(self, project_root, base_url):
        super().__init__()
        self.project_root = project_root
        self.base_url = base_url
    
    def run(self):
        """运行性能监控"""
        try:
            results = {}
            
            # 1. 分析静态资源大小
            self.update_progress.emit(20)
            static_assets = self.analyze_static_assets()
            results['static_assets'] = static_assets
            
            # 2. 分析页面加载速度
            self.update_progress.emit(50)
            page_load = self.analyze_page_load()
            results['page_load'] = page_load
            
            # 3. 分析SEO指标
            self.update_progress.emit(80)
            seo_metrics = self.analyze_seo_metrics()
            results['seo_metrics'] = seo_metrics
            
            # 4. 生成性能报告
            self.update_progress.emit(100)
            self.update_result.emit(results)
            
        except Exception as e:
            self.update_error.emit(str(e))
    
    def analyze_static_assets(self):
        """分析静态资源大小"""
        assets_dir = self.project_root / 'dist'
        if not assets_dir.exists():
            return {'error': 'dist目录不存在，请先构建项目'}
        
        total_size = 0
        file_count = 0
        file_types = {}
        
        for root, dirs, files in os.walk(assets_dir):
            for file in files:
                file_path = Path(root) / file
                file_size = file_path.stat().st_size
                total_size += file_size
                file_count += 1
                
                # 统计文件类型
                file_ext = file.split('.')[-1].lower() if '.' in file else 'unknown'
                if file_ext not in file_types:
                    file_types[file_ext] = {'count': 0, 'size': 0}
                file_types[file_ext]['count'] += 1
                file_types[file_ext]['size'] += file_size
        
        return {
            'total_size': total_size,
            'file_count': file_count,
            'file_types': file_types
        }
    
    def analyze_page_load(self):
        """分析页面加载速度"""
        try:
            # 测试首页加载速度
            start_time = time.time()
            response = requests.get(self.base_url, timeout=10)
            load_time = (time.time() - start_time) * 1000  # 转换为毫秒
            
            return {
                'load_time': load_time,
                'status_code': response.status_code,
                'content_length': len(response.content)
            }
        except Exception as e:
            return {'error': str(e)}
    
    def analyze_seo_metrics(self):
        """分析SEO指标"""
        try:
            # 测试首页SEO指标
            response = requests.get(self.base_url, timeout=10)
            content = response.text
            
            # 检查meta标签
            has_title = '<title>' in content
            has_description = '<meta name="description"' in content
            has_keywords = '<meta name="keywords"' in content
            
            return {
                'has_title': has_title,
                'has_description': has_description,
                'has_keywords': has_keywords,
                'status_code': response.status_code
            }
        except Exception as e:
            return {'error': str(e)}

class PerformanceMonitorPanel(QWidget):
    """性能监控面板"""
    
    def __init__(self, project_root):
        super().__init__()
        self.project_root = project_root
        self.base_url = 'http://localhost:3000'  # 默认本地开发服务器
        self.init_ui()
    
    def init_ui(self):
        """初始化界面"""
        layout = QVBoxLayout(self)
        
        # 基本设置
        settings_group = QGroupBox('基本设置')
        settings_layout = QHBoxLayout(settings_group)
        
        url_label = QLabel('网站URL:')
        self.url_input = QLabel(self.base_url)
        
        settings_layout.addWidget(url_label)
        settings_layout.addWidget(self.url_input)
        
        # 监控按钮
        button_layout = QHBoxLayout()
        start_monitor_button = QPushButton('开始监控')
        start_monitor_button.clicked.connect(self.start_monitoring)
        
        save_report_button = QPushButton('保存报告')
        save_report_button.clicked.connect(self.save_report)
        
        button_layout.addWidget(start_monitor_button)
        button_layout.addWidget(save_report_button)
        
        # 进度条
        self.progress_bar = QProgressBar()
        self.progress_bar.setValue(0)
        
        # 结果显示
        result_group = QGroupBox('监控结果')
        result_layout = QVBoxLayout(result_group)
        
        # 静态资源分析
        assets_group = QGroupBox('静态资源分析')
        assets_layout = QVBoxLayout(assets_group)
        self.assets_table = QTableWidget()
        headers = ['文件类型', '文件数量', '大小 (KB)']
        setup_table_widget(self.assets_table, headers)
        assets_layout.addWidget(self.assets_table)
        
        # 页面加载分析
        load_group = QGroupBox('页面加载分析')
        load_layout = QVBoxLayout(load_group)
        self.load_info = QTextEdit()
        self.load_info.setReadOnly(True)
        load_layout.addWidget(self.load_info)
        
        # SEO分析
        seo_group = QGroupBox('SEO分析')
        seo_layout = QVBoxLayout(seo_group)
        self.seo_info = QTextEdit()
        self.seo_info.setReadOnly(True)
        seo_layout.addWidget(self.seo_info)
        
        # 性能建议
        suggestion_group = QGroupBox('性能建议')
        suggestion_layout = QVBoxLayout(suggestion_group)
        self.suggestion_info = QTextEdit()
        self.suggestion_info.setReadOnly(True)
        suggestion_layout.addWidget(self.suggestion_info)
        
        # 添加到结果布局
        result_layout.addWidget(assets_group)
        result_layout.addWidget(load_group)
        result_layout.addWidget(seo_group)
        result_layout.addWidget(suggestion_group)
        
        # 添加到主布局
        layout.addWidget(settings_group)
        layout.addLayout(button_layout)
        layout.addWidget(self.progress_bar)
        layout.addWidget(result_group)
        
        # 监控结果
        self.monitor_results = {}
    
    def start_monitoring(self):
        """开始监控"""
        # 重置界面
        self.progress_bar.setValue(0)
        clear_table(self.assets_table)
        self.load_info.setPlainText('')
        self.seo_info.setPlainText('')
        self.suggestion_info.setPlainText('')
        
        # 启动监控线程
        self.monitor_thread = PerformanceMonitorThread(self.project_root, self.base_url)
        self.monitor_thread.update_progress.connect(self.update_progress)
        self.monitor_thread.update_result.connect(self.update_result)
        self.monitor_thread.update_error.connect(self.update_error)
        self.monitor_thread.start()
    
    def update_progress(self, value):
        """更新进度条"""
        self.progress_bar.setValue(value)
    
    def update_result(self, results):
        """更新监控结果"""
        self.monitor_results = results
        
        # 显示静态资源分析
        if 'static_assets' in results:
            assets = results['static_assets']
            if 'error' in assets:
                self.assets_table.setRowCount(1)
                self.assets_table.setItem(0, 0, QTableWidgetItem('错误'))
                self.assets_table.setItem(0, 1, QTableWidgetItem(''))
                self.assets_table.setItem(0, 2, QTableWidgetItem(assets['error']))
            else:
                for ext, data in assets['file_types'].items():
                    add_table_row(
                        self.assets_table, 
                        [ext, str(data['count']), f"{data['size'] / 1024:.2f}"]
                    )
        
        # 显示页面加载分析
        if 'page_load' in results:
            load = results['page_load']
            if 'error' in load:
                self.load_info.setPlainText(f"错误: {load['error']}")
            else:
                info = f"加载时间: {load['load_time']:.2f} 毫秒\n"
                info += f"状态码: {load['status_code']}\n"
                info += f"内容大小: {load['content_length'] / 1024:.2f} KB"
                self.load_info.setPlainText(info)
        
        # 显示SEO分析
        if 'seo_metrics' in results:
            seo = results['seo_metrics']
            if 'error' in seo:
                self.seo_info.setPlainText(f"错误: {seo['error']}")
            else:
                info = f"标题标签: {'存在' if seo['has_title'] else '缺失'}\n"
                info += f"描述标签: {'存在' if seo['has_description'] else '缺失'}\n"
                info += f"关键词标签: {'存在' if seo['has_keywords'] else '缺失'}\n"
                info += f"状态码: {seo['status_code']}"
                self.seo_info.setPlainText(info)
        
        # 生成性能建议
        self.generate_suggestions(results)
    
    def update_error(self, error):
        """更新错误信息"""
        show_error_message(self, '错误', f'监控失败: {error}')
    
    def generate_suggestions(self, results):
        """生成性能建议"""
        suggestions = []
        
        # 静态资源建议
        if 'static_assets' in results:
            assets = results['static_assets']
            if 'error' not in assets:
                total_size = assets['total_size']
                if total_size > 10 * 1024 * 1024:  # 超过10MB
                    suggestions.append('静态资源总大小超过10MB，建议进行压缩和优化')
                
                # 检查大型文件
                for ext, data in assets['file_types'].items():
                    if data['size'] > 1 * 1024 * 1024:  # 超过1MB
                        suggestions.append(f'{ext}文件总大小超过1MB，建议进行压缩')
        
        # 页面加载建议
        if 'page_load' in results:
            load = results['page_load']
            if 'error' not in load:
                if load['load_time'] > 3000:  # 超过3秒
                    suggestions.append('页面加载时间超过3秒，建议优化页面结构和资源')
                if load['status_code'] != 200:
                    suggestions.append(f'页面返回状态码 {load["status_code"]}，建议检查服务器配置')
        
        # SEO建议
        if 'seo_metrics' in results:
            seo = results['seo_metrics']
            if 'error' not in seo:
                if not seo['has_title']:
                    suggestions.append('页面缺少标题标签，建议添加')
                if not seo['has_description']:
                    suggestions.append('页面缺少描述标签，建议添加')
                if not seo['has_keywords']:
                    suggestions.append('页面缺少关键词标签，建议添加')
        
        if suggestions:
            self.suggestion_info.setPlainText('\n'.join(suggestions))
        else:
            self.suggestion_info.setPlainText('未发现明显的性能问题')
    
    def save_report(self):
        """保存报告"""
        if not self.monitor_results:
            show_info_message(self, '提示', '请先运行监控')
            return
        
        try:
            # 生成报告文件
            report_path = self.project_root / 'performance_report.json'
            report = {
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
                'results': self.monitor_results
            }
            
            if write_json(report_path, report):
                show_info_message(self, '成功', f'性能报告已保存到 {report_path}')
            else:
                show_error_message(self, '错误', '保存报告失败')
        except Exception as e:
            show_error_message(self, '错误', f'保存报告失败: {e}')