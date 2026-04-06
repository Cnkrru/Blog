#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文件系统监控功能
包含自动检测文件变化并更新相关数据的功能
"""

import os
import time
import threading
from pathlib import Path

from common import get_project_paths, load_search_json, save_search_json
from post_management import scan_and_update_search_json
from color_utils import print_info, print_success, print_error, print_warning

# 尝试导入 watchdog 模块
try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
    WATCHDOG_AVAILABLE = True
except ImportError:
    WATCHDOG_AVAILABLE = False
    print_warning("[WARNING] watchdog 模块未安装，文件系统监控功能将被禁用")


# 只有在 watchdog 可用时才定义 FileChangeHandler 类
if WATCHDOG_AVAILABLE:
    class FileChangeHandler(FileSystemEventHandler):
        """文件变化事件处理器"""
        
        def __init__(self):
            """初始化文件变化事件处理器"""
            self.project_root, self.posts_dir, self.search_json_path = get_project_paths()
            self.drafts_dir = self.project_root / "drafts"
            self.templates_dir = self.project_root / "templates"
        
        def on_created(self, event):
            """文件创建事件"""
            if not event.is_directory:
                self._handle_file_change(event.src_path, "created")
        
        def on_modified(self, event):
            """文件修改事件"""
            if not event.is_directory:
                self._handle_file_change(event.src_path, "modified")
        
        def on_deleted(self, event):
            """文件删除事件"""
            if not event.is_directory:
                self._handle_file_change(event.src_path, "deleted")
        
        def _handle_file_change(self, file_path, event_type):
            """处理文件变化"""
            file_path = Path(file_path)
            
            # 检查文件是否在监控目录中
            if file_path.parent == self.posts_dir:
                # 文章文件变化
                print_info(f"[INFO] 文章文件 {event_type}: {file_path.name}")
                self._update_search_json()
            elif file_path.parent == self.drafts_dir:
                # 草稿文件变化
                print_info(f"[INFO] 草稿文件 {event_type}: {file_path.name}")
            elif file_path.parent == self.templates_dir:
                # 模板文件变化
                print_info(f"[INFO] 模板文件 {event_type}: {file_path.name}")
        
        def _update_search_json(self):
            """更新search.json文件"""
            print_info("[INFO] 正在更新 search.json...")
            try:
                scan_and_update_search_json()
                print_success("[SUCCESS] search.json 更新完成")
            except Exception as e:
                print_error(f"[ERROR] 更新 search.json 失败: {e}")


class FileMonitor:
    """文件系统监控器"""
    
    def __init__(self):
        """初始化文件系统监控器"""
        self.observer = None
        self.event_handler = None
        self.running = False
        self.project_root = None
        self.monitored_dirs = []
    
    def initialize(self):
        """初始化文件系统监控"""
        if not WATCHDOG_AVAILABLE:
            print_warning("[WARNING] watchdog 模块未安装，文件系统监控功能不可用")
            return
        
        self.project_root, self.posts_dir, _ = get_project_paths()
        self.event_handler = FileChangeHandler()
        self.observer = Observer()
        
        # 监控的目录
        self.monitored_dirs = [
            self.posts_dir,
            self.project_root / "drafts",
            self.project_root / "templates"
        ]
        
        # 启动监控
        self.start_monitoring()
    
    def start_monitoring(self):
        """开始监控"""
        if not WATCHDOG_AVAILABLE:
            print_warning("[WARNING] watchdog 模块未安装，文件系统监控功能不可用")
            return
        
        if self.running:
            return
        
        self.running = True
        
        # 为每个目录添加监控
        for directory in self.monitored_dirs:
            if directory.exists():
                self.observer.schedule(self.event_handler, str(directory), recursive=False)
                print_info(f"[INFO] 开始监控目录: {directory}")
            else:
                print_warning(f"[WARNING] 目录不存在，跳过监控: {directory}")
        
        # 启动观察者线程
        self.observer.start()
        print_success("[SUCCESS] 文件系统监控已启动")
    
    def stop_monitoring(self):
        """停止监控"""
        if not WATCHDOG_AVAILABLE:
            return
        
        if not self.running:
            return
        
        self.running = False
        self.observer.stop()
        self.observer.join(timeout=5)
        print_info("[INFO] 文件系统监控已停止")
    
    def is_running(self):
        """检查监控是否正在运行"""
        if not WATCHDOG_AVAILABLE:
            return False
        return self.running


# 创建全局文件系统监控器实例
file_monitor = FileMonitor()


def initialize_file_monitor():
    """初始化文件系统监控"""
    file_monitor.initialize()


def start_file_monitor():
    """启动文件系统监控"""
    file_monitor.start_monitoring()


def stop_file_monitor():
    """停止文件系统监控"""
    file_monitor.stop_monitoring()


def is_file_monitor_running():
    """检查文件系统监控是否正在运行"""
    return file_monitor.is_running()


def start_file_monitor_thread():
    """在后台线程中启动文件系统监控"""
    if not WATCHDOG_AVAILABLE:
        print_warning("[WARNING] watchdog 模块未安装，文件系统监控功能将被禁用")
        return None
    
    monitor_thread = threading.Thread(target=start_file_monitor)
    monitor_thread.daemon = True
    monitor_thread.start()
    return monitor_thread