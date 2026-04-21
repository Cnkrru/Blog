#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文章管理模块
"""

from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QTableWidget,
    QTableWidgetItem, QLineEdit, QLabel, QMessageBox, QTabWidget,
    QTextEdit, QFormLayout, QComboBox, QDateEdit, QGraphicsView,
    QGraphicsScene, QGraphicsTextItem, QApplication
)
from PyQt5.QtCore import Qt, QDate, QPropertyAnimation, QPointF, QTimer, QEasingCurve
from PyQt5.QtGui import QFont, QColor
from pathlib import Path
import json

from utils.common import get_search_json, read_json, write_json, get_post_files
from utils.ui_utils import (
    setup_table_widget, add_table_row, clear_table, get_selected_row,
    show_info_message, show_error_message, show_question_message
)

class PostManagementPanel(QWidget):
    """文章管理面板"""
    
    def __init__(self, project_root):
        super().__init__()
        self.project_root = project_root
        self.search_json = get_search_json()
        self.init_ui()
    
    def init_ui(self):
        """初始化界面"""
        layout = QVBoxLayout(self)
        
        # 搜索栏
        search_layout = QHBoxLayout()
        search_label = QLabel('搜索:')
        self.search_input = QLineEdit()
        search_button = QPushButton('搜索')
        search_button.clicked.connect(self.search_posts)
        
        search_layout.addWidget(search_label)
        search_layout.addWidget(self.search_input)
        search_layout.addWidget(search_button)
        
        # 文章列表
        self.post_table = QTableWidget()
        headers = ['选择', 'ID', '标题', '分类', '日期', '状态', '标签']
        setup_table_widget(self.post_table, headers)
        
        # 批量操作栏
        batch_layout = QHBoxLayout()
        batch_label = QLabel('批量操作:')
        batch_combo = QComboBox()
        batch_combo.addItems(['批量删除', '批量修改分类', '批量修改状态'])
        batch_button = QPushButton('执行')
        batch_button.clicked.connect(lambda: self.batch_operation(batch_combo.currentText()))
        
        batch_layout.addWidget(batch_label)
        batch_layout.addWidget(batch_combo)
        batch_layout.addWidget(batch_button)
        
        # 按钮栏
        button_layout = QHBoxLayout()
        refresh_button = QPushButton('刷新')
        refresh_button.clicked.connect(self.load_posts)
        
        preview_button = QPushButton('预览')
        preview_button.clicked.connect(self.preview_post)
        
        edit_button = QPushButton('编辑')
        edit_button.clicked.connect(self.edit_post)
        
        delete_button = QPushButton('删除')
        delete_button.clicked.connect(self.delete_post)
        
        create_button = QPushButton('创建')
        create_button.clicked.connect(self.create_post)
        
        update_search_button = QPushButton('更新搜索索引')
        update_search_button.clicked.connect(self.update_search_json)
        
        button_layout.addWidget(refresh_button)
        button_layout.addWidget(preview_button)
        button_layout.addWidget(edit_button)
        button_layout.addWidget(delete_button)
        button_layout.addWidget(create_button)
        button_layout.addWidget(update_search_button)
        
        # 添加到布局
        layout.addLayout(search_layout)
        layout.addLayout(batch_layout)
        layout.addWidget(self.post_table)
        layout.addLayout(button_layout)
        
        # 加载文章列表
        self.load_posts()
    
    def load_posts(self):
        """加载文章列表"""
        try:
            posts = read_json(self.search_json)
            clear_table(self.post_table)
            
            for post in posts:
                tags = ', '.join(post.get('tags', []))
                status = post.get('status', '发布')
                
                # 创建行
                row_position = self.post_table.rowCount()
                self.post_table.insertRow(row_position)
                
                # 添加选择框
                check_box = QTableWidgetItem()
                check_box.setCheckState(Qt.Unchecked)
                self.post_table.setItem(row_position, 0, check_box)
                
                # 添加其他列
                self.post_table.setItem(row_position, 1, QTableWidgetItem(post['id']))
                self.post_table.setItem(row_position, 2, QTableWidgetItem(post['title']))
                self.post_table.setItem(row_position, 3, QTableWidgetItem(post.get('category', '')))
                self.post_table.setItem(row_position, 4, QTableWidgetItem(post.get('date', '')))
                self.post_table.setItem(row_position, 5, QTableWidgetItem(status))
                self.post_table.setItem(row_position, 6, QTableWidgetItem(tags))
            
        except Exception as e:
            show_error_message(self, '错误', f'加载文章失败: {e}')
    
    def search_posts(self):
        """搜索文章"""
        search_text = self.search_input.text().lower()
        if not search_text:
            self.load_posts()
            return
        
        try:
            posts = read_json(self.search_json)
            filtered_posts = [
                post for post in posts 
                if search_text in post['title'].lower() or 
                   search_text in post.get('category', '').lower() or
                   search_text in ' '.join(post.get('tags', [])).lower()
            ]
            
            clear_table(self.post_table)
            for post in filtered_posts:
                tags = ', '.join(post.get('tags', []))
                status = post.get('status', '发布')
                
                # 创建行
                row_position = self.post_table.rowCount()
                self.post_table.insertRow(row_position)
                
                # 添加选择框
                check_box = QTableWidgetItem()
                check_box.setCheckState(Qt.Unchecked)
                self.post_table.setItem(row_position, 0, check_box)
                
                # 添加其他列
                self.post_table.setItem(row_position, 1, QTableWidgetItem(post['id']))
                self.post_table.setItem(row_position, 2, QTableWidgetItem(post['title']))
                self.post_table.setItem(row_position, 3, QTableWidgetItem(post.get('category', '')))
                self.post_table.setItem(row_position, 4, QTableWidgetItem(post.get('date', '')))
                self.post_table.setItem(row_position, 5, QTableWidgetItem(status))
                self.post_table.setItem(row_position, 6, QTableWidgetItem(tags))
            
        except Exception as e:
            show_error_message(self, '错误', f'搜索失败: {e}')
    
    def preview_post(self):
        """预览文章"""
        row = get_selected_row(self.post_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一篇文章')
            return
        
        post_id = self.post_table.item(row, 0).text()
        
        try:
            posts = read_json(self.search_json)
            post = next((p for p in posts if p['id'] == post_id), None)
            
            if post:
                # 创建预览窗口
                preview_widget = QWidget()
                preview_layout = QVBoxLayout(preview_widget)
                
                title_label = QLabel(f"标题: {post['title']}")
                title_label.setStyleSheet("font-size: 16px; font-weight: bold;")
                
                meta_label = QLabel(
                    f"分类: {post.get('category', '无')} | 日期: {post.get('date', '无')} | ID: {post['id']}"
                )
                
                tags_label = QLabel(f"标签: {', '.join(post.get('tags', []))}")
                
                content_label = QLabel("描述:")
                content_text = QTextEdit()
                content_text.setPlainText(post.get('description', '无'))
                content_text.setReadOnly(True)
                
                preview_layout.addWidget(title_label)
                preview_layout.addWidget(meta_label)
                preview_layout.addWidget(tags_label)
                preview_layout.addWidget(content_label)
                preview_layout.addWidget(content_text)
                
                preview_widget.setWindowTitle('文章预览')
                preview_widget.resize(600, 400)
                preview_widget.show()
            else:
                show_error_message(self, '错误', '文章不存在')
                
        except Exception as e:
            show_error_message(self, '错误', f'预览失败: {e}')
    
    def edit_post(self):
        """编辑文章"""
        row = get_selected_row(self.post_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一篇文章')
            return
        
        post_id = self.post_table.item(row, 0).text()
        
        try:
            posts = read_json(self.search_json)
            post = next((p for p in posts if p['id'] == post_id), None)
            
            if post:
                # 创建编辑窗口
                edit_widget = QWidget()
                edit_layout = QFormLayout(edit_widget)
                
                # 标题
                title_edit = QLineEdit(post['title'])
                edit_layout.addRow('标题:', title_edit)
                
                # 分类
                category_edit = QLineEdit(post.get('category', ''))
                edit_layout.addRow('分类:', category_edit)
                
                # 日期
                date_edit = QDateEdit()
                if post.get('date'):
                    date = QDate.fromString(post['date'], 'yyyy-MM-dd')
                    date_edit.setDate(date)
                edit_layout.addRow('日期:', date_edit)
                
                # 标签
                tags_edit = QLineEdit(', '.join(post.get('tags', [])))
                edit_layout.addRow('标签 (逗号分隔):', tags_edit)
                
                # 描述
                desc_edit = QTextEdit(post.get('description', ''))
                edit_layout.addRow('描述:', desc_edit)
                
                # 按钮
                button_layout = QHBoxLayout()
                save_button = QPushButton('保存')
                cancel_button = QPushButton('取消')
                
                def save_changes():
                    post['title'] = title_edit.text()
                    post['category'] = category_edit.text()
                    post['date'] = date_edit.date().toString('yyyy-MM-dd')
                    post['tags'] = [tag.strip() for tag in tags_edit.text().split(',') if tag.strip()]
                    post['description'] = desc_edit.toPlainText()
                    
                    if write_json(self.search_json, posts):
                        show_info_message(self, '成功', '文章已更新')
                        self.load_posts()
                        edit_widget.close()
                    else:
                        show_error_message(self, '错误', '保存失败')
                
                save_button.clicked.connect(save_changes)
                cancel_button.clicked.connect(edit_widget.close)
                
                button_layout.addWidget(save_button)
                button_layout.addWidget(cancel_button)
                edit_layout.addRow(button_layout)
                
                edit_widget.setWindowTitle('编辑文章')
                edit_widget.resize(500, 400)
                edit_widget.show()
            else:
                show_error_message(self, '错误', '文章不存在')
                
        except Exception as e:
            show_error_message(self, '错误', f'编辑失败: {e}')
    
    def delete_post(self):
        """删除文章"""
        row = get_selected_row(self.post_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一篇文章')
            return
        
        post_id = self.post_table.item(row, 0).text()
        post_title = self.post_table.item(row, 1).text()
        
        if show_question_message(self, '确认删除', f'确定要删除文章 "{post_title}" 吗？'):
            try:
                posts = read_json(self.search_json)
                posts = [p for p in posts if p['id'] != post_id]
                
                if write_json(self.search_json, posts):
                    show_info_message(self, '成功', '文章已删除')
                    self.load_posts()
                else:
                    show_error_message(self, '错误', '删除失败')
                    
            except Exception as e:
                show_error_message(self, '错误', f'删除失败: {e}')
    
    def create_post(self):
        """创建文章"""
        # 创建创建窗口
        create_widget = QWidget()
        create_layout = QFormLayout(create_widget)
        
        # 标题
        title_edit = QLineEdit()
        create_layout.addRow('标题:', title_edit)
        
        # 分类
        category_edit = QLineEdit()
        create_layout.addRow('分类:', category_edit)
        
        # 日期
        date_edit = QDateEdit()
        date_edit.setDate(QDate.currentDate())
        create_layout.addRow('日期:', date_edit)
        
        # 标签
        tags_edit = QLineEdit()
        create_layout.addRow('标签 (逗号分隔):', tags_edit)
        
        # 描述
        desc_edit = QTextEdit()
        create_layout.addRow('描述:', desc_edit)
        
        # 按钮
        button_layout = QHBoxLayout()
        save_button = QPushButton('创建')
        cancel_button = QPushButton('取消')
        
        def save_post():
            try:
                posts = read_json(self.search_json)
                
                # 生成新ID
                max_id = max(int(p['id']) for p in posts if p['id'].isdigit()) if posts else -1
                new_id = str(max_id + 1)
                
                # 创建新文章
                new_post = {
                    'id': new_id,
                    'title': title_edit.text(),
                    'category': category_edit.text(),
                    'tags': [tag.strip() for tag in tags_edit.text().split(',') if tag.strip()],
                    'path': f'./html/posts/post-{new_id}.html',
                    'date': date_edit.date().toString('yyyy-MM-dd'),
                    'description': desc_edit.toPlainText(),
                    'keywords': title_edit.text(),
                    'author': '作者名称',
                    'image': '/assets/imgs/default.jpg',
                    'seoTitle': f'{title_edit.text()} - Vue Blog'
                }
                
                posts.append(new_post)
                
                if write_json(self.search_json, posts):
                    show_info_message(self, '成功', '文章已创建')
                    self.load_posts()
                    create_widget.close()
                else:
                    show_error_message(self, '错误', '创建失败')
                    
            except Exception as e:
                show_error_message(self, '错误', f'创建失败: {e}')
        
        save_button.clicked.connect(save_post)
        cancel_button.clicked.connect(create_widget.close)
        
        button_layout.addWidget(save_button)
        button_layout.addWidget(cancel_button)
        create_layout.addRow(button_layout)
        
        create_widget.setWindowTitle('创建文章')
        create_widget.resize(500, 400)
        create_widget.show()
    
    def update_search_json(self):
        """更新搜索索引"""
        if show_question_message(self, '确认更新', '确定要更新搜索索引吗？'):
            try:
                # 这里可以实现扫描文章并更新 search.json 的逻辑
                # 暂时只做简单的刷新
                self.load_posts()
                show_info_message(self, '成功', '搜索索引已更新')
                
            except Exception as e:
                show_error_message(self, '错误', f'更新失败: {e}')
    
    def get_selected_posts(self):
        """获取选中的文章ID列表"""
        selected_ids = []
        for row in range(self.post_table.rowCount()):
            check_box = self.post_table.item(row, 0)
            if check_box.checkState() == Qt.Checked:
                post_id = self.post_table.item(row, 1).text()
                selected_ids.append(post_id)
        return selected_ids
    
    def batch_operation(self, operation):
        """批量操作"""
        selected_ids = self.get_selected_posts()
        if not selected_ids:
            show_info_message(self, '提示', '请选择至少一篇文章')
            return
        
        try:
            posts = read_json(self.search_json)
            
            if operation == '批量删除':
                if show_question_message(self, '确认删除', f'确定要删除 {len(selected_ids)} 篇文章吗？'):
                    posts = [p for p in posts if p['id'] not in selected_ids]
                    if write_json(self.search_json, posts):
                        show_info_message(self, '成功', f'已删除 {len(selected_ids)} 篇文章')
                        self.load_posts()
                    else:
                        show_error_message(self, '错误', '删除失败')
            
            elif operation == '批量修改分类':
                from PyQt5.QtWidgets import QInputDialog
                category, ok = QInputDialog.getText(self, '批量修改分类', '请输入新分类:')
                if ok and category.strip():
                    for post in posts:
                        if post['id'] in selected_ids:
                            post['category'] = category.strip()
                    if write_json(self.search_json, posts):
                        show_info_message(self, '成功', f'已修改 {len(selected_ids)} 篇文章的分类')
                        self.load_posts()
                    else:
                        show_error_message(self, '错误', '修改失败')
            
            elif operation == '批量修改状态':
                from PyQt5.QtWidgets import QInputDialog
                status, ok = QInputDialog.getItem(self, '批量修改状态', '请选择新状态:', ['发布', '草稿', '归档'], 0, False)
                if ok:
                    for post in posts:
                        if post['id'] in selected_ids:
                            post['status'] = status
                    if write_json(self.search_json, posts):
                        show_info_message(self, '成功', f'已修改 {len(selected_ids)} 篇文章的状态')
                        self.load_posts()
                    else:
                        show_error_message(self, '错误', '修改失败')
            
        except Exception as e:
            show_error_message(self, '错误', f'批量操作失败: {e}')
    
    def edit_post(self):
        """编辑文章"""
        row = get_selected_row(self.post_table)
        if row == -1:
            show_info_message(self, '提示', '请选择一篇文章')
            return
        
        post_id = self.post_table.item(row, 1).text()
        
        try:
            posts = read_json(self.search_json)
            post = next((p for p in posts if p['id'] == post_id), None)
            
            if post:
                # 创建编辑窗口
                edit_widget = QWidget()
                edit_layout = QFormLayout(edit_widget)
                
                # 标题
                title_edit = QLineEdit(post['title'])
                edit_layout.addRow('标题:', title_edit)
                
                # 分类
                category_edit = QLineEdit(post.get('category', ''))
                edit_layout.addRow('分类:', category_edit)
                
                # 日期
                date_edit = QDateEdit()
                if post.get('date'):
                    date = QDate.fromString(post['date'], 'yyyy-MM-dd')
                    date_edit.setDate(date)
                edit_layout.addRow('日期:', date_edit)
                
                # 状态
                status_combo = QComboBox()
                status_combo.addItems(['发布', '草稿', '归档'])
                status_combo.setCurrentText(post.get('status', '发布'))
                edit_layout.addRow('状态:', status_combo)
                
                # 标签
                tags_edit = QLineEdit(', '.join(post.get('tags', [])))
                edit_layout.addRow('标签 (逗号分隔):', tags_edit)
                
                # 描述
                desc_edit = QTextEdit(post.get('description', ''))
                edit_layout.addRow('描述:', desc_edit)
                
                # 按钮
                button_layout = QHBoxLayout()
                save_button = QPushButton('保存')
                cancel_button = QPushButton('取消')
                
                def save_changes():
                    post['title'] = title_edit.text()
                    post['category'] = category_edit.text()
                    post['date'] = date_edit.date().toString('yyyy-MM-dd')
                    post['status'] = status_combo.currentText()
                    post['tags'] = [tag.strip() for tag in tags_edit.text().split(',') if tag.strip()]
                    post['description'] = desc_edit.toPlainText()
                    
                    if write_json(self.search_json, posts):
                        show_info_message(self, '成功', '文章已更新')
                        self.load_posts()
                        edit_widget.close()
                    else:
                        show_error_message(self, '错误', '保存失败')
                
                save_button.clicked.connect(save_changes)
                cancel_button.clicked.connect(edit_widget.close)
                
                button_layout.addWidget(save_button)
                button_layout.addWidget(cancel_button)
                edit_layout.addRow(button_layout)
                
                edit_widget.setWindowTitle('编辑文章')
                edit_widget.resize(500, 450)
                edit_widget.show()
            else:
                show_error_message(self, '错误', '文章不存在')
                
        except Exception as e:
            show_error_message(self, '错误', f'编辑失败: {e}')
    
    def create_post(self):
        """创建文章"""
        # 创建创建窗口
        create_widget = QWidget()
        create_layout = QFormLayout(create_widget)
        
        # 标题
        title_edit = QLineEdit()
        create_layout.addRow('标题:', title_edit)
        
        # 分类
        category_edit = QLineEdit()
        create_layout.addRow('分类:', category_edit)
        
        # 日期
        date_edit = QDateEdit()
        date_edit.setDate(QDate.currentDate())
        create_layout.addRow('日期:', date_edit)
        
        # 状态
        status_combo = QComboBox()
        status_combo.addItems(['发布', '草稿', '归档'])
        status_combo.setCurrentText('发布')
        create_layout.addRow('状态:', status_combo)
        
        # 标签
        tags_edit = QLineEdit()
        create_layout.addRow('标签 (逗号分隔):', tags_edit)
        
        # 描述
        desc_edit = QTextEdit()
        create_layout.addRow('描述:', desc_edit)
        
        # 按钮
        button_layout = QHBoxLayout()
        save_button = QPushButton('创建')
        cancel_button = QPushButton('取消')
        
        def save_post():
            try:
                posts = read_json(self.search_json)
                
                # 生成新ID
                max_id = max(int(p['id']) for p in posts if p['id'].isdigit()) if posts else -1
                new_id = str(max_id + 1)
                
                # 创建新文章
                new_post = {
                    'id': new_id,
                    'title': title_edit.text(),
                    'category': category_edit.text(),
                    'status': status_combo.currentText(),
                    'tags': [tag.strip() for tag in tags_edit.text().split(',') if tag.strip()],
                    'path': f'./html/posts/post-{new_id}.html',
                    'date': date_edit.date().toString('yyyy-MM-dd'),
                    'description': desc_edit.toPlainText(),
                    'keywords': title_edit.text(),
                    'author': '作者名称',
                    'image': '/assets/imgs/default.jpg',
                    'seoTitle': f'{title_edit.text()} - Vue Blog'
                }
                
                posts.append(new_post)
                
                if write_json(self.search_json, posts):
                    show_info_message(self, '成功', '文章已创建')
                    self.load_posts()
                    create_widget.close()
                    # 触发彩蛋动画
                    self.trigger_easter_egg()
                else:
                    show_error_message(self, '错误', '创建失败')
                    
            except Exception as e:
                show_error_message(self, '错误', f'创建失败: {e}')
        
        save_button.clicked.connect(save_post)
        cancel_button.clicked.connect(create_widget.close)
        
        button_layout.addWidget(save_button)
        button_layout.addWidget(cancel_button)
        create_layout.addRow(button_layout)
        
        create_widget.setWindowTitle('创建文章')
        create_widget.resize(500, 450)
        create_widget.show()
    
    def trigger_easter_egg(self):
        """触发彩蛋动画"""
        easter_egg = EasterEggAnimation(self)
        easter_egg.show()


class EasterEggAnimation(QWidget):
    """彩蛋动画窗口"""
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.Dialog)
        self.setAttribute(Qt.WA_TranslucentBackground)
        self.setFixedSize(800, 600)
        self.center()
        
        self.char_items = []
        self.init_animation()
    
    def center(self):
        """窗口居中"""
        screen = QApplication.primaryScreen()
        if screen:
            screen_geometry = screen.geometry()
            x = (screen_geometry.width() - self.width()) // 2
            y = (screen_geometry.height() - self.height()) // 2
            self.move(x, y)
    
    def init_animation(self):
        """初始化动画"""
        self.setStyleSheet("background-color: rgba(0, 0, 0, 0.9);")
        
        # 动画文本
        text = "新文章创建成功!"
        colors = [QColor(255, 107, 107), QColor(78, 205, 196), 
                  QColor(69, 183, 209), QColor(150, 206, 180), 
                  QColor(255, 234, 167)]
        
        self.scene = QGraphicsScene(self)
        self.view = QGraphicsView(self.scene, self)
        self.view.setGeometry(0, 0, 800, 600)
        self.view.setStyleSheet("background: transparent; border: none;")
        
        for i, char in enumerate(text):
            text_item = QGraphicsTextItem(char)
            text_item.setFont(QFont("Courier New", 48, QFont.Bold))
            text_item.setDefaultTextColor(colors[i % len(colors)])
            
            x = 400 - (len(text) * 30) + i * 60
            y = 300
            text_item.setPos(x, y)
            
            self.scene.addItem(text_item)
            self.char_items.append({
                'item': text_item,
                'start_y': -100,
                'end_y': y,
                'delay': i * 100
            })
        
        self.run_animation()
    
    def run_animation(self):
        """执行动画"""
        for char_data in self.char_items:
            item = char_data['item']
            start_y = char_data['start_y']
            end_y = char_data['end_y']
            delay = char_data['delay']
            
            anim = QPropertyAnimation(item, b'pos')
            anim.setDuration(1000)
            anim.setStartValue(QPointF(item.pos().x(), start_y))
            anim.setEndValue(QPointF(item.pos().x(), end_y))
            anim.setEasingCurve(QEasingCurve.OutBounce)
            
            if delay > 0:
                QTimer.singleShot(delay, lambda a=anim: a.start())
            else:
                anim.start()
        
        QTimer.singleShot(4000, self.close)