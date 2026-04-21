#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据统计模块
"""

from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QTableWidget,
    QTableWidgetItem, QLabel, QTabWidget
)
from PyQt5.QtCore import Qt
from pathlib import Path
import json
import matplotlib.pyplot as plt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas

from utils.common import get_search_json, read_json
from utils.ui_utils import (
    setup_table_widget, add_table_row, clear_table,
    show_info_message, show_error_message
)

class StatsAnalysisPanel(QWidget):
    """数据统计面板"""
    
    def __init__(self, project_root):
        super().__init__()
        self.project_root = project_root
        self.search_json = get_search_json()
        self.init_ui()
    
    def init_ui(self):
        """初始化界面"""
        layout = QVBoxLayout(self)
        
        # 标签页
        tab_widget = QTabWidget()
        
        # 文章统计标签
        post_stats_tab = QWidget()
        post_stats_layout = QVBoxLayout(post_stats_tab)
        
        # 文章统计表格
        self.post_stats_table = QTableWidget()
        post_stats_headers = ['统计项', '数值']
        setup_table_widget(self.post_stats_table, post_stats_headers)
        
        # 刷新按钮
        refresh_button = QPushButton('刷新统计')
        refresh_button.clicked.connect(self.update_stats)
        
        post_stats_layout.addWidget(self.post_stats_table)
        post_stats_layout.addWidget(refresh_button)
        
        # 图表标签
        chart_tab = QWidget()
        chart_layout = QVBoxLayout(chart_tab)
        
        # 图表容器
        self.chart_container = QWidget()
        chart_container_layout = QVBoxLayout(self.chart_container)
        
        # 图表按钮
        chart_buttons = QHBoxLayout()
        category_chart_button = QPushButton('分类分布')
        category_chart_button.clicked.connect(self.show_category_chart)
        
        tag_chart_button = QPushButton('标签云')
        tag_chart_button.clicked.connect(self.show_tag_chart)
        
        chart_buttons.addWidget(category_chart_button)
        chart_buttons.addWidget(tag_chart_button)
        
        chart_container_layout.addLayout(chart_buttons)
        
        # 图表显示区域
        self.chart_canvas = None
        
        chart_layout.addWidget(self.chart_container)
        
        # 添加标签页
        tab_widget.addTab(post_stats_tab, '文章统计')
        tab_widget.addTab(chart_tab, '图表分析')
        
        # 添加到布局
        layout.addWidget(tab_widget)
        
        # 初始更新统计
        self.update_stats()
    
    def update_stats(self):
        """更新统计信息"""
        try:
            posts = read_json(self.search_json)
            
            # 计算统计信息
            stats = {
                '总文章数': len(posts),
                '总分类数': 0,
                '总标签数': 0,
                '平均每篇文章标签数': 0,
                '最近更新文章': '无'
            }
            
            # 统计分类和标签
            categories = set()
            tags = set()
            total_tags = 0
            
            # 查找最近更新的文章
            latest_post = None
            latest_date = None
            
            for post in posts:
                # 统计分类
                if post.get('category'):
                    categories.add(post['category'])
                
                # 统计标签
                post_tags = post.get('tags', [])
                tags.update(post_tags)
                total_tags += len(post_tags)
                
                # 查找最近更新的文章
                if post.get('date'):
                    post_date = post['date']
                    if not latest_date or post_date > latest_date:
                        latest_date = post_date
                        latest_post = post
            
            # 更新统计信息
            stats['总分类数'] = len(categories)
            stats['总标签数'] = len(tags)
            stats['平均每篇文章标签数'] = round(total_tags / len(posts), 2) if posts else 0
            
            if latest_post:
                stats['最近更新文章'] = f"{latest_post['title']} ({latest_date})"
            
            # 显示统计信息
            clear_table(self.post_stats_table)
            for key, value in stats.items():
                add_table_row(self.post_stats_table, [key, value])
                
        except Exception as e:
            show_error_message(self, '错误', f'统计失败: {e}')
    
    def show_category_chart(self):
        """显示分类分布图表"""
        try:
            posts = read_json(self.search_json)
            
            # 统计分类
            category_count = {}
            for post in posts:
                category = post.get('category', '未分类')
                category_count[category] = category_count.get(category, 0) + 1
            
            # 创建图表
            fig, ax = plt.subplots(figsize=(8, 6))
            categories = list(category_count.keys())
            counts = list(category_count.values())
            
            ax.bar(categories, counts)
            ax.set_title('文章分类分布')
            ax.set_xlabel('分类')
            ax.set_ylabel('文章数量')
            ax.tick_params(axis='x', rotation=45)
            
            # 显示图表
            self.display_chart(fig)
            
        except Exception as e:
            show_error_message(self, '错误', f'生成图表失败: {e}')
    
    def show_tag_chart(self):
        """显示标签云"""
        try:
            posts = read_json(self.search_json)
            
            # 统计标签
            tag_count = {}
            for post in posts:
                tags = post.get('tags', [])
                for tag in tags:
                    tag_count[tag] = tag_count.get(tag, 0) + 1
            
            # 创建图表
            fig, ax = plt.subplots(figsize=(8, 6))
            tags = list(tag_count.keys())
            counts = list(tag_count.values())
            
            # 使用水平条形图
            ax.barh(tags, counts)
            ax.set_title('标签使用频率')
            ax.set_xlabel('使用次数')
            ax.set_ylabel('标签')
            
            # 显示图表
            self.display_chart(fig)
            
        except Exception as e:
            show_error_message(self, '错误', f'生成图表失败: {e}')
    
    def display_chart(self, fig):
        """显示图表"""
        # 清除之前的图表
        if self.chart_canvas:
            self.chart_canvas.deleteLater()
        
        # 创建新的图表画布
        self.chart_canvas = FigureCanvas(fig)
        
        # 添加到容器
        layout = self.chart_container.layout()
        # 移除之前的画布（如果有）
        for i in reversed(range(layout.count())):
            widget = layout.itemAt(i).widget()
            if widget and isinstance(widget, FigureCanvas):
                layout.removeWidget(widget)
                widget.deleteLater()
        
        layout.addWidget(self.chart_canvas)
        self.chart_canvas.draw()