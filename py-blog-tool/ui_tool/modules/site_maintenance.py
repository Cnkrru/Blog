#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
站点维护模块
"""

from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QTableWidget,
    QTableWidgetItem, QLabel, QTextEdit, QFormLayout, QLineEdit
)
from PyQt5.QtCore import Qt
from pathlib import Path
import os
import shutil

from utils.common import get_project_root, ensure_directory
from utils.ui_utils import (
    setup_table_widget, add_table_row, clear_table,
    show_info_message, show_error_message, show_question_message
)

class SiteMaintenancePanel(QWidget):
    """站点维护面板"""
    
    def __init__(self, project_root):
        super().__init__()
        self.project_root = project_root
        self.draft_dir = project_root / 'drafts'
        self.init_ui()
    
    def init_ui(self):
        """初始化界面"""
        layout = QVBoxLayout(self)
        
        # 功能按钮
        button_layout = QHBoxLayout()
        
        create_template_button = QPushButton('创建Markdown模板')
        create_template_button.clicked.connect(self.create_markdown_template)
        
        manage_drafts_button = QPushButton('草稿管理')
        manage_drafts_button.clicked.connect(self.manage_drafts)
        
        draft_to_post_button = QPushButton('草稿转文章')
        draft_to_post_button.clicked.connect(self.draft_to_post)
        
        clear_drafts_button = QPushButton('清空草稿')
        clear_drafts_button.clicked.connect(self.clear_draft_folder)
        
        site_stats_button = QPushButton('站点统计')
        site_stats_button.clicked.connect(self.show_site_statistics)
        
        cleanup_button = QPushButton('自动清理')
        cleanup_button.clicked.connect(self.auto_cleanup)
        
        backup_button = QPushButton('自动备份')
        backup_button.clicked.connect(self.auto_backup)
        
        deploy_button = QPushButton('部署站点')
        deploy_button.clicked.connect(self.deploy_site)
        
        health_check_button = QPushButton('站点健康检查')
        health_check_button.clicked.connect(self.site_health_check)
        
        button_layout.addWidget(create_template_button)
        button_layout.addWidget(manage_drafts_button)
        button_layout.addWidget(draft_to_post_button)
        button_layout.addWidget(clear_drafts_button)
        button_layout.addWidget(site_stats_button)
        button_layout.addWidget(cleanup_button)
        button_layout.addWidget(backup_button)
        button_layout.addWidget(deploy_button)
        button_layout.addWidget(health_check_button)
        
        # 状态信息
        self.status_label = QLabel('就绪')
        self.status_label.setStyleSheet("font-weight: bold;")
        
        # 添加到布局
        layout.addLayout(button_layout)
        layout.addWidget(self.status_label)
    
    def create_markdown_template(self):
        """创建Markdown模板"""
        try:
            # 确保草稿目录存在
            ensure_directory(self.draft_dir)
            
            # 创建模板内容
            template_content = '''---
title: 新文章
category: 未分类
tags: [标签1, 标签2]
date: {date}
description: 文章描述
keywords: 关键词
author: 作者名称
image: /assets/imgs/default.jpg
seoTitle: 新文章 - Vue Blog
---

# 标题

内容...
'''.format(date=datetime.now().strftime('%Y-%m-%d'))
            
            # 生成文件名
            import datetime
            timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
            template_file = self.draft_dir / f'template_{timestamp}.md'
            
            # 写入文件
            with open(template_file, 'w', encoding='utf-8') as f:
                f.write(template_content)
            
            show_info_message(self, '成功', f'模板已创建: {template_file.name}')
            self.status_label.setText(f'模板已创建: {template_file.name}')
            
        except Exception as e:
            show_error_message(self, '错误', f'创建模板失败: {e}')
            self.status_label.setText(f'创建模板失败: {e}')
    
    def manage_drafts(self):
        """草稿管理"""
        try:
            # 确保草稿目录存在
            ensure_directory(self.draft_dir)
            
            # 获取草稿文件
            drafts = list(self.draft_dir.glob('*.md'))
            
            if not drafts:
                show_info_message(self, '提示', '草稿目录为空')
                return
            
            # 创建草稿管理窗口
            draft_widget = QWidget()
            draft_layout = QVBoxLayout(draft_widget)
            
            # 草稿列表
            draft_table = QTableWidget()
            headers = ['文件名', '修改时间', '大小']
            setup_table_widget(draft_table, headers)
            
            for draft in drafts:
                mtime = draft.stat().st_mtime
                size = draft.stat().st_size
                mtime_str = datetime.fromtimestamp(mtime).strftime('%Y-%m-%d %H:%M:%S')
                add_table_row(draft_table, [draft.name, mtime_str, f'{size} bytes'])
            
            # 按钮
            button_layout = QHBoxLayout()
            open_button = QPushButton('打开')
            delete_button = QPushButton('删除')
            
            def open_draft():
                row = draft_table.currentRow()
                if row == -1:
                    show_info_message(draft_widget, '提示', '请选择一个草稿')
                    return
                
                draft_name = draft_table.item(row, 0).text()
                draft_file = self.draft_dir / draft_name
                
                try:
                    # 读取草稿内容
                    with open(draft_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # 创建编辑窗口
                    edit_widget = QWidget()
                    edit_layout = QVBoxLayout(edit_widget)
                    
                    text_edit = QTextEdit(content)
                    edit_layout.addWidget(text_edit)
                    
                    save_button = QPushButton('保存')
                    
                    def save_draft():
                        try:
                            with open(draft_file, 'w', encoding='utf-8') as f:
                                f.write(text_edit.toPlainText())
                            show_info_message(edit_widget, '成功', '草稿已保存')
                            edit_widget.close()
                        except Exception as e:
                            show_error_message(edit_widget, '错误', f'保存失败: {e}')
                    
                    save_button.clicked.connect(save_draft)
                    edit_layout.addWidget(save_button)
                    
                    edit_widget.setWindowTitle(f'编辑草稿: {draft_name}')
                    edit_widget.resize(600, 500)
                    edit_widget.show()
                    
                except Exception as e:
                    show_error_message(draft_widget, '错误', f'打开草稿失败: {e}')
            
            def delete_draft():
                row = draft_table.currentRow()
                if row == -1:
                    show_info_message(draft_widget, '提示', '请选择一个草稿')
                    return
                
                draft_name = draft_table.item(row, 0).text()
                draft_file = self.draft_dir / draft_name
                
                if show_question_message(draft_widget, '确认删除', f'确定要删除草稿 "{draft_name}" 吗？'):
                    try:
                        draft_file.unlink()
                        show_info_message(draft_widget, '成功', '草稿已删除')
                        # 刷新列表
                        draft_table.removeRow(row)
                    except Exception as e:
                        show_error_message(draft_widget, '错误', f'删除失败: {e}')
            
            open_button.clicked.connect(open_draft)
            delete_button.clicked.connect(delete_draft)
            
            button_layout.addWidget(open_button)
            button_layout.addWidget(delete_button)
            
            draft_layout.addWidget(draft_table)
            draft_layout.addLayout(button_layout)
            
            draft_widget.setWindowTitle('草稿管理')
            draft_widget.resize(600, 400)
            draft_widget.show()
            
        except Exception as e:
            show_error_message(self, '错误', f'草稿管理失败: {e}')
            self.status_label.setText(f'草稿管理失败: {e}')
    
    def draft_to_post(self):
        """草稿转文章"""
        try:
            # 确保草稿目录存在
            ensure_directory(self.draft_dir)
            
            # 获取草稿文件
            drafts = list(self.draft_dir.glob('*.md'))
            
            if not drafts:
                show_info_message(self, '提示', '草稿目录为空')
                return
            
            # 创建选择窗口
            draft_widget = QWidget()
            draft_layout = QVBoxLayout(draft_widget)
            
            # 草稿列表
            draft_table = QTableWidget()
            headers = ['文件名']
            setup_table_widget(draft_table, headers)
            
            for draft in drafts:
                add_table_row(draft_table, [draft.name])
            
            # 按钮
            button_layout = QHBoxLayout()
            convert_button = QPushButton('转换')
            cancel_button = QPushButton('取消')
            
            def convert_draft():
                row = draft_table.currentRow()
                if row == -1:
                    show_info_message(draft_widget, '提示', '请选择一个草稿')
                    return
                
                draft_name = draft_table.item(row, 0).text()
                draft_file = self.draft_dir / draft_name
                
                try:
                    # 读取草稿内容
                    with open(draft_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # 提取标题
                    import re
                    title_match = re.search(r'title: (.*)', content)
                    title = title_match.group(1) if title_match else '未命名文章'
                    
                    # 生成新的文章文件
                    post_dir = self.project_root / 'src' / 'pages' / 'post'
                    ensure_directory(post_dir)
                    
                    # 生成新ID
                    import json
                    search_json = self.project_root / 'public' / 'config' / 'search.json'
                    if search_json.exists():
                        with open(search_json, 'r', encoding='utf-8') as f:
                            posts = json.load(f)
                        max_id = max(int(p['id']) for p in posts if p['id'].isdigit()) if posts else -1
                    else:
                        posts = []
                        max_id = -1
                    
                    new_id = str(max_id + 1)
                    post_file = post_dir / f'post-{new_id}.md'
                    
                    # 写入文件
                    with open(post_file, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    # 更新 search.json
                    new_post = {
                        'id': new_id,
                        'title': title,
                        'category': '未分类',
                        'tags': [],
                        'path': f'./html/posts/post-{new_id}.html',
                        'date': datetime.now().strftime('%Y-%m-%d'),
                        'description': '文章描述',
                        'keywords': title,
                        'author': '作者名称',
                        'image': '/assets/imgs/default.jpg',
                        'seoTitle': f'{title} - Vue Blog'
                    }
                    
                    # 提取元数据
                    category_match = re.search(r'category: (.*)', content)
                    if category_match:
                        new_post['category'] = category_match.group(1)
                    
                    tags_match = re.search(r'tags: \[(.*)\]', content)
                    if tags_match:
                        tags = [tag.strip() for tag in tags_match.group(1).split(',') if tag.strip()]
                        new_post['tags'] = tags
                    
                    description_match = re.search(r'description: (.*)', content)
                    if description_match:
                        new_post['description'] = description_match.group(1)
                    
                    date_match = re.search(r'date: (.*)', content)
                    if date_match:
                        new_post['date'] = date_match.group(1)
                    
                    posts.append(new_post)
                    
                    with open(search_json, 'w', encoding='utf-8') as f:
                        json.dump(posts, f, ensure_ascii=False, indent=2)
                    
                    show_info_message(draft_widget, '成功', f'草稿已转换为文章: post-{new_id}.md')
                    draft_widget.close()
                    
                except Exception as e:
                    show_error_message(draft_widget, '错误', f'转换失败: {e}')
            
            convert_button.clicked.connect(convert_draft)
            cancel_button.clicked.connect(draft_widget.close)
            
            button_layout.addWidget(convert_button)
            button_layout.addWidget(cancel_button)
            
            draft_layout.addWidget(draft_table)
            draft_layout.addLayout(button_layout)
            
            draft_widget.setWindowTitle('草稿转文章')
            draft_widget.resize(400, 300)
            draft_widget.show()
            
        except Exception as e:
            show_error_message(self, '错误', f'草稿转文章失败: {e}')
            self.status_label.setText(f'草稿转文章失败: {e}')
    
    def clear_draft_folder(self):
        """清空草稿文件夹"""
        if show_question_message(self, '确认清空', '确定要清空所有草稿吗？'):
            try:
                if self.draft_dir.exists():
                    for file in self.draft_dir.iterdir():
                        if file.is_file():
                            file.unlink()
                show_info_message(self, '成功', '草稿文件夹已清空')
                self.status_label.setText('草稿文件夹已清空')
                
            except Exception as e:
                show_error_message(self, '错误', f'清空草稿失败: {e}')
                self.status_label.setText(f'清空草稿失败: {e}')
    
    def show_site_statistics(self):
        """显示站点统计"""
        try:
            # 计算统计信息
            stats = {
                '文章数量': 0,
                '分类数量': 0,
                '标签数量': 0,
                '草稿数量': 0
            }
            
            # 统计文章
            search_json = self.project_root / 'public' / 'config' / 'search.json'
            if search_json.exists():
                import json
                with open(search_json, 'r', encoding='utf-8') as f:
                    posts = json.load(f)
                stats['文章数量'] = len(posts)
                
                # 统计分类和标签
                categories = set()
                tags = set()
                for post in posts:
                    if post.get('category'):
                        categories.add(post['category'])
                    if post.get('tags'):
                        tags.update(post['tags'])
                stats['分类数量'] = len(categories)
                stats['标签数量'] = len(tags)
            
            # 统计草稿
            if self.draft_dir.exists():
                drafts = list(self.draft_dir.glob('*.md'))
                stats['草稿数量'] = len(drafts)
            
            # 创建统计窗口
            stats_widget = QWidget()
            stats_layout = QVBoxLayout(stats_widget)
            
            for key, value in stats.items():
                label = QLabel(f'{key}: {value}')
                label.setStyleSheet("font-size: 14px;")
                stats_layout.addWidget(label)
            
            stats_widget.setWindowTitle('站点统计')
            stats_widget.resize(300, 200)
            stats_widget.show()
            
            self.status_label.setText('显示站点统计')
            
        except Exception as e:
            show_error_message(self, '错误', f'统计失败: {e}')
            self.status_label.setText(f'统计失败: {e}')
    
    def auto_cleanup(self):
        """自动清理"""
        if show_question_message(self, '确认清理', '确定要执行自动清理吗？'):
            try:
                # 清理临时文件
                temp_dirs = [
                    self.project_root / 'node_modules' / '.cache',
                    self.project_root / 'dist'
                ]
                
                cleaned = []
                for temp_dir in temp_dirs:
                    if temp_dir.exists() and temp_dir.is_dir():
                        shutil.rmtree(temp_dir)
                        cleaned.append(str(temp_dir.relative_to(self.project_root)))
                
                if cleaned:
                    show_info_message(self, '成功', f'已清理: {', '.join(cleaned)}')
                else:
                    show_info_message(self, '提示', '没有需要清理的文件')
                
                self.status_label.setText('自动清理完成')
                
            except Exception as e:
                show_error_message(self, '错误', f'清理失败: {e}')
                self.status_label.setText(f'清理失败: {e}')
    
    def auto_backup(self):
        """自动备份"""
        if show_question_message(self, '确认备份', '确定要执行自动备份吗？'):
            try:
                # 创建备份目录
                backup_dir = self.project_root / 'backups'
                ensure_directory(backup_dir)
                
                # 生成备份文件名
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                backup_file = backup_dir / f'backup_{timestamp}.zip'
                
                # 备份的文件和目录
                backup_items = [
                    'src',
                    'public',
                    'package.json',
                    'vite.config.js',
                    'index.html'
                ]
                
                # 创建压缩文件
                import zipfile
                with zipfile.ZipFile(backup_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
                    for item in backup_items:
                        item_path = self.project_root / item
                        if item_path.exists():
                            if item_path.is_dir():
                                for root, dirs, files in os.walk(item_path):
                                    for file in files:
                                        file_path = Path(root) / file
                                        arcname = str(file_path.relative_to(self.project_root))
                                        zipf.write(file_path, arcname)
                            else:
                                arcname = str(item_path.relative_to(self.project_root))
                                zipf.write(item_path, arcname)
                
                show_info_message(self, '成功', f'备份已创建: {backup_file.name}')
                self.status_label.setText(f'备份已创建: {backup_file.name}')
                
            except Exception as e:
                show_error_message(self, '错误', f'备份失败: {e}')
                self.status_label.setText(f'备份失败: {e}')
    
    def deploy_site(self):
        """部署站点"""
        if show_question_message(self, '确认部署', '确定要部署站点吗？'):
            try:
                # 构建站点
                import subprocess
                self.status_label.setText('正在构建站点...')
                
                build_result = subprocess.run(
                    ['npm', 'run', 'build'],
                    cwd=self.project_root,
                    capture_output=True,
                    text=True
                )
                
                if build_result.returncode == 0:
                    show_info_message(self, '成功', '站点构建成功')
                    self.status_label.setText('站点构建成功')
                else:
                    show_error_message(self, '错误', f'构建失败: {build_result.stderr}')
                    self.status_label.setText('构建失败')
                    return
                
                # 这里可以添加部署到GitHub Pages或其他平台的逻辑
                show_info_message(self, '提示', '构建完成，可手动部署到服务器')
                
            except Exception as e:
                show_error_message(self, '错误', f'部署失败: {e}')
                self.status_label.setText(f'部署失败: {e}')
    
    def site_health_check(self):
        """站点健康检查"""
        try:
            # 检查文件和目录
            check_items = [
                ('src目录', self.project_root / 'src'),
                ('public目录', self.project_root / 'public'),
                ('package.json', self.project_root / 'package.json'),
                ('vite.config.js', self.project_root / 'vite.config.js'),
                ('index.html', self.project_root / 'index.html'),
                ('搜索索引', self.project_root / 'public' / 'config' / 'search.json')
            ]
            
            # 检查结果
            results = []
            for name, path in check_items:
                if path.exists():
                    if path.is_dir():
                        results.append(f'{name}: ✅ 存在 ({len(list(path.iterdir()))} 个项目)')
                    else:
                        results.append(f'{name}: ✅ 存在 ({path.stat().st_size} 字节)')
                else:
                    results.append(f'{name}: ❌ 不存在')
            
            # 显示检查结果
            check_widget = QWidget()
            check_layout = QVBoxLayout(check_widget)
            
            for result in results:
                label = QLabel(result)
                check_layout.addWidget(label)
            
            # 按钮
            ok_button = QPushButton('确定')
            ok_button.clicked.connect(check_widget.close)
            check_layout.addWidget(ok_button)
            
            check_widget.setWindowTitle('站点健康检查')
            check_widget.resize(400, 300)
            check_widget.show()
            
            self.status_label.setText('站点健康检查完成')
            
        except Exception as e:
            show_error_message(self, '错误', f'健康检查失败: {e}')
            self.status_label.setText(f'健康检查失败: {e}')

# 导入datetime模块
from datetime import datetime