#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SEO优化工具模块
"""

from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QTableWidget,
    QTableWidgetItem, QLineEdit, QLabel, QTextEdit, QFormLayout,
    QComboBox, QGroupBox, QFileDialog
)
from PyQt5.QtCore import Qt
from pathlib import Path
import json
import xml.etree.ElementTree as ET
from datetime import datetime

from utils.common import get_project_root, read_json, write_json, ensure_directory
from utils.ui_utils import (
    setup_table_widget, add_table_row, clear_table, get_selected_row,
    show_info_message, show_error_message, show_question_message
)

class SEOOptimizationPanel(QWidget):
    """SEO优化工具面板"""
    
    def __init__(self, project_root):
        super().__init__()
        self.project_root = project_root
        self.seo_config = project_root / 'public' / 'config' / 'seo.json'
        self.init_ui()
    
    def init_ui(self):
        """初始化界面"""
        layout = QVBoxLayout(self)
        
        # 功能标签页
        tab_layout = QHBoxLayout()
        
        # SEO配置
        seo_config_group = QGroupBox('SEO配置')
        seo_config_layout = QVBoxLayout(seo_config_group)
        
        # 站点信息
        site_info_layout = QFormLayout()
        
        self.site_title = QLineEdit()
        site_info_layout.addRow('站点标题:', self.site_title)
        
        self.site_description = QTextEdit()
        self.site_description.setFixedHeight(80)
        site_info_layout.addRow('站点描述:', self.site_description)
        
        self.site_keywords = QLineEdit()
        site_info_layout.addRow('站点关键词:', self.site_keywords)
        
        self.site_author = QLineEdit()
        site_info_layout.addRow('站点作者:', self.site_author)
        
        # 保存按钮
        save_button = QPushButton('保存SEO配置')
        save_button.clicked.connect(self.save_seo_config)
        
        load_button = QPushButton('加载SEO配置')
        load_button.clicked.connect(self.load_seo_config)
        
        button_layout = QHBoxLayout()
        button_layout.addWidget(load_button)
        button_layout.addWidget(save_button)
        
        seo_config_layout.addLayout(site_info_layout)
        seo_config_layout.addLayout(button_layout)
        
        # 站点地图
        sitemap_group = QGroupBox('站点地图')
        sitemap_layout = QVBoxLayout(sitemap_group)
        
        sitemap_info = QLabel('站点地图用于帮助搜索引擎索引网站内容')
        sitemap_layout.addWidget(sitemap_info)
        
        generate_sitemap_button = QPushButton('生成站点地图')
        generate_sitemap_button.clicked.connect(self.generate_sitemap)
        
        view_sitemap_button = QPushButton('查看站点地图')
        view_sitemap_button.clicked.connect(self.view_sitemap)
        
        sitemap_button_layout = QHBoxLayout()
        sitemap_button_layout.addWidget(generate_sitemap_button)
        sitemap_button_layout.addWidget(view_sitemap_button)
        
        sitemap_layout.addLayout(sitemap_button_layout)
        
        # RSS订阅
        rss_group = QGroupBox('RSS订阅')
        rss_layout = QVBoxLayout(rss_group)
        
        rss_info = QLabel('RSS订阅用于让用户订阅博客更新')
        rss_layout.addWidget(rss_info)
        
        generate_rss_button = QPushButton('生成RSS订阅')
        generate_rss_button.clicked.connect(self.generate_rss)
        
        view_rss_button = QPushButton('查看RSS订阅')
        view_rss_button.clicked.connect(self.view_rss)
        
        rss_button_layout = QHBoxLayout()
        rss_button_layout.addWidget(generate_rss_button)
        rss_button_layout.addWidget(view_rss_button)
        
        rss_layout.addLayout(rss_button_layout)
        
        # 添加到主布局
        tab_layout.addWidget(seo_config_group)
        tab_layout.addWidget(sitemap_group)
        tab_layout.addWidget(rss_group)
        
        layout.addLayout(tab_layout)
        
        # 加载SEO配置
        self.load_seo_config()
    
    def load_seo_config(self):
        """加载SEO配置"""
        try:
            if self.seo_config.exists():
                config = read_json(self.seo_config)
                self.site_title.setText(config.get('title', ''))
                self.site_description.setPlainText(config.get('description', ''))
                self.site_keywords.setText(config.get('keywords', ''))
                self.site_author.setText(config.get('author', ''))
            else:
                # 默认为空
                self.site_title.setText('')
                self.site_description.setPlainText('')
                self.site_keywords.setText('')
                self.site_author.setText('')
        except Exception as e:
            show_error_message(self, '错误', f'加载SEO配置失败: {e}')
    
    def save_seo_config(self):
        """保存SEO配置"""
        try:
            config = {
                'title': self.site_title.text(),
                'description': self.site_description.toPlainText(),
                'keywords': self.site_keywords.text(),
                'author': self.site_author.text(),
                'updated_at': datetime.now().isoformat()
            }
            
            if write_json(self.seo_config, config):
                show_info_message(self, '成功', 'SEO配置已保存')
            else:
                show_error_message(self, '错误', '保存SEO配置失败')
        except Exception as e:
            show_error_message(self, '错误', f'保存SEO配置失败: {e}')
    
    def generate_sitemap(self):
        """生成站点地图"""
        try:
            # 创建根元素
            urlset = ET.Element('urlset', xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')
            
            # 添加首页
            url = ET.SubElement(urlset, 'url')
            ET.SubElement(url, 'loc').text = 'https://yourblog.com/'
            ET.SubElement(url, 'lastmod').text = datetime.now().strftime('%Y-%m-%d')
            ET.SubElement(url, 'changefreq').text = 'daily'
            ET.SubElement(url, 'priority').text = '1.0'
            
            # 添加文章页面
            posts_dir = self.project_root / 'src' / 'assets' / 'data' / 'post'
            if posts_dir.exists():
                for post_file in posts_dir.glob('*.md'):
                    post_id = post_file.stem
                    url = ET.SubElement(urlset, 'url')
                    ET.SubElement(url, 'loc').text = f'https://yourblog.com/post/{post_id}'
                    ET.SubElement(url, 'lastmod').text = post_file.stat().st_mtime
                    ET.SubElement(url, 'changefreq').text = 'monthly'
                    ET.SubElement(url, 'priority').text = '0.8'
            
            # 添加项目页面
            projects_json = self.project_root / 'public' / 'config' / 'projects.json'
            if projects_json.exists():
                projects = read_json(projects_json)
                for project in projects:
                    url = ET.SubElement(urlset, 'url')
                    ET.SubElement(url, 'loc').text = f'https://yourblog.com/project/{project.get("id")}'
                    ET.SubElement(url, 'lastmod').text = datetime.now().strftime('%Y-%m-%d')
                    ET.SubElement(url, 'changefreq').text = 'monthly'
                    ET.SubElement(url, 'priority').text = '0.7'
            
            # 生成XML
            tree = ET.ElementTree(urlset)
            sitemap_path = self.project_root / 'public' / 'sitemap.xml'
            ensure_directory(sitemap_path.parent)
            tree.write(sitemap_path, encoding='utf-8', xml_declaration=True)
            
            show_info_message(self, '成功', f'站点地图已生成到 {sitemap_path}')
        except Exception as e:
            show_error_message(self, '错误', f'生成站点地图失败: {e}')
    
    def view_sitemap(self):
        """查看站点地图"""
        try:
            sitemap_path = self.project_root / 'public' / 'sitemap.xml'
            if sitemap_path.exists():
                with open(sitemap_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 创建查看窗口
                view_widget = QWidget()
                view_layout = QVBoxLayout(view_widget)
                
                text_edit = QTextEdit()
                text_edit.setPlainText(content)
                text_edit.setReadOnly(True)
                
                view_layout.addWidget(text_edit)
                
                view_widget.setWindowTitle('站点地图')
                view_widget.resize(800, 600)
                view_widget.show()
            else:
                show_info_message(self, '提示', '站点地图不存在，请先生成')
        except Exception as e:
            show_error_message(self, '错误', f'查看站点地图失败: {e}')
    
    def generate_rss(self):
        """生成RSS订阅"""
        try:
            # 创建根元素
            rss = ET.Element('rss', version='2.0')
            channel = ET.SubElement(rss, 'channel')
            
            # 频道信息
            ET.SubElement(channel, 'title').text = self.site_title.text() or 'My Blog'
            ET.SubElement(channel, 'description').text = self.site_description.toPlainText() or 'Personal blog'
            ET.SubElement(channel, 'link').text = 'https://yourblog.com/'
            ET.SubElement(channel, 'language').text = 'zh-CN'
            ET.SubElement(channel, 'lastBuildDate').text = datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')
            
            # 添加文章
            posts_dir = self.project_root / 'src' / 'assets' / 'data' / 'post'
            if posts_dir.exists():
                for post_file in posts_dir.glob('*.md'):
                    # 读取文章内容
                    with open(post_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # 解析文章元数据
                    title = post_file.stem
                    description = content[:100] + '...' if len(content) > 100 else content
                    
                    item = ET.SubElement(channel, 'item')
                    ET.SubElement(item, 'title').text = title
                    ET.SubElement(item, 'description').text = description
                    ET.SubElement(item, 'link').text = f'https://yourblog.com/post/{post_file.stem}'
                    ET.SubElement(item, 'pubDate').text = post_file.stat().st_mtime
                    ET.SubElement(item, 'guid').text = f'https://yourblog.com/post/{post_file.stem}'
            
            # 生成XML
            tree = ET.ElementTree(rss)
            rss_path = self.project_root / 'public' / 'rss.xml'
            ensure_directory(rss_path.parent)
            tree.write(rss_path, encoding='utf-8', xml_declaration=True)
            
            show_info_message(self, '成功', f'RSS订阅已生成到 {rss_path}')
        except Exception as e:
            show_error_message(self, '错误', f'生成RSS订阅失败: {e}')
    
    def view_rss(self):
        """查看RSS订阅"""
        try:
            rss_path = self.project_root / 'public' / 'rss.xml'
            if rss_path.exists():
                with open(rss_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 创建查看窗口
                view_widget = QWidget()
                view_layout = QVBoxLayout(view_widget)
                
                text_edit = QTextEdit()
                text_edit.setPlainText(content)
                text_edit.setReadOnly(True)
                
                view_layout.addWidget(text_edit)
                
                view_widget.setWindowTitle('RSS订阅')
                view_widget.resize(800, 600)
                view_widget.show()
            else:
                show_info_message(self, '提示', 'RSS订阅不存在，请先生成')
        except Exception as e:
            show_error_message(self, '错误', f'查看RSS订阅失败: {e}')