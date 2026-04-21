#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Vue-Blog UI 工具主应用类
实现主界面和核心功能
"""

import sys
from pathlib import Path
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QLabel, QListWidget, QStackedWidget, QStatusBar,
    QMenuBar, QMenu, QAction
)
from PyQt5.QtGui import QIcon, QFont
from PyQt5.QtCore import Qt, QSize

# 导入功能模块
from modules.post_management import PostManagementPanel
from modules.site_maintenance import SiteMaintenancePanel
from modules.category_management import CategoryManagementPanel
from modules.tag_management import TagManagementPanel
from modules.stats_analysis import StatsAnalysisPanel
from modules.config_management import ConfigManagementPanel
from modules.log_management import LogManagementPanel
from modules.help_center import HelpCenterPanel
from modules.version_management import VersionManagementPanel
from modules.project_management import ProjectManagementPanel
from modules.tool_management import ToolManagementPanel
from modules.link_management import LinkManagementPanel
from modules.media_management import MediaManagementPanel
from modules.seo_optimization import SEOOptimizationPanel
from modules.performance_monitor import PerformanceMonitorPanel

# 导入工具函数
from utils.common import get_project_root

class VueBlogUITool(QMainWindow):
    """Vue-Blog UI工具主类"""
    
    def __init__(self):
        super().__init__()
        self.project_root = get_project_root()
        self.init_ui()
    
    def init_ui(self):
        """初始化用户界面"""
        # 设置窗口标题和大小
        self.setWindowTitle('Vue-Blog 管理工具')
        self.setGeometry(100, 100, 1000, 700)
        
        # 创建主布局
        central_widget = QWidget()
        main_layout = QHBoxLayout(central_widget)
        
        # 创建左侧导航栏
        self.navigation = QListWidget()
        self.navigation.setFixedWidth(180)
        self.navigation.setStyleSheet("""
            QListWidget {
                background-color: #f5f5f5;
                border-right: 1px solid #ddd;
            }
            QListWidget::item {
                padding: 12px;
                border-bottom: 1px solid #eee;
            }
            QListWidget::item:selected {
                background-color: #e3f2fd;
                color: #1976d2;
            }
        """)
        
        # 创建右侧内容区域
        self.content_area = QStackedWidget()
        
        # 添加到主布局
        main_layout.addWidget(self.navigation)
        main_layout.addWidget(self.content_area)
        
        # 设置中央部件
        self.setCentralWidget(central_widget)
        
        # 创建状态栏
        self.status_bar = QStatusBar()
        self.setStatusBar(self.status_bar)
        self.status_bar.showMessage('就绪')
        
        # 创建菜单栏
        self.create_menu_bar()
        
        # 初始化功能模块
        self.init_modules()
        
        # 连接信号
        self.navigation.currentRowChanged.connect(self.switch_module)
    
    def create_menu_bar(self):
        """创建菜单栏"""
        menu_bar = self.menuBar()
        
        # 文件菜单
        file_menu = menu_bar.addMenu('文件')
        exit_action = QAction('退出', self)
        exit_action.triggered.connect(self.close)
        file_menu.addAction(exit_action)
        
        # 工具菜单
        tool_menu = menu_bar.addMenu('工具')
        settings_action = QAction('设置', self)
        tool_menu.addAction(settings_action)
        
        # 帮助菜单
        help_menu = menu_bar.addMenu('帮助')
        about_action = QAction('关于', self)
        help_menu.addAction(about_action)
    
    def init_modules(self):
        """初始化功能模块"""
        # 模块列表
        modules = [
            ('文章管理', PostManagementPanel),
            ('站点维护', SiteMaintenancePanel),
            ('分类管理', CategoryManagementPanel),
            ('标签管理', TagManagementPanel),
            ('项目管理', ProjectManagementPanel),
            ('工具管理', ToolManagementPanel),
            ('链接管理', LinkManagementPanel),
            ('媒体管理', MediaManagementPanel),
            ('SEO优化', SEOOptimizationPanel),
            ('性能监控', PerformanceMonitorPanel),
            ('数据统计', StatsAnalysisPanel),
            ('配置管理', ConfigManagementPanel),
            ('日志管理', LogManagementPanel),
            ('帮助中心', HelpCenterPanel),
            ('版本管理', VersionManagementPanel)
        ]
        
        self.module_widgets = []
        
        for name, PanelClass in modules:
            # 添加到导航栏
            self.navigation.addItem(name)
            
            # 创建面板实例
            panel = PanelClass(self.project_root)
            self.content_area.addWidget(panel)
            self.module_widgets.append(panel)
    
    def switch_module(self, index):
        """切换功能模块"""
        if 0 <= index < len(self.module_widgets):
            self.content_area.setCurrentIndex(index)
            module_name = self.navigation.item(index).text()
            self.status_bar.showMessage(f'当前模块: {module_name}')

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = VueBlogUITool()
    window.show()
    sys.exit(app.exec_())