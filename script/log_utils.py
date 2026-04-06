#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
日志工具模块
包含日志记录、日志级别控制、日志查看和清理功能
"""

import os
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional


class Logger:
    """日志记录类"""
    
    def __init__(self):
        """初始化日志记录器"""
        self.project_root = self._get_project_root()
        self.log_dir = self.project_root / "logs"
        self._setup_logger()
    
    def _get_project_root(self) -> Path:
        """获取项目根目录"""
        # 导入 path_utils 以避免循环导入
        from path_utils import get_project_root
        return get_project_root()
    
    def _setup_logger(self):
        """设置日志记录器"""
        # 创建日志目录
        self.log_dir.mkdir(parents=True, exist_ok=True)
        
        # 生成日志文件名
        today = datetime.now().strftime('%Y-%m-%d')
        log_file = self.log_dir / f"blog_cli_{today}.log"
        
        # 配置日志记录器
        self.logger = logging.getLogger('blog_cli')
        self.logger.setLevel(logging.DEBUG)
        
        # 避免重复添加处理器
        if not self.logger.handlers:
            # 文件处理器
            file_handler = logging.FileHandler(log_file, encoding='utf-8')
            file_handler.setLevel(logging.DEBUG)
            
            # 控制台处理器
            console_handler = logging.StreamHandler()
            console_handler.setLevel(logging.INFO)
            
            # 日志格式
            formatter = logging.Formatter(
                '%(asctime)s - %(levelname)s - %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S'
            )
            
            file_handler.setFormatter(formatter)
            console_handler.setFormatter(formatter)
            
            # 添加处理器
            self.logger.addHandler(file_handler)
            self.logger.addHandler(console_handler)
    
    def debug(self, message: str):
        """记录调试级别的日志"""
        self.logger.debug(message)
    
    def info(self, message: str):
        """记录信息级别的日志"""
        self.logger.info(message)
    
    def warning(self, message: str):
        """记录警告级别的日志"""
        self.logger.warning(message)
    
    def error(self, message: str):
        """记录错误级别的日志"""
        self.logger.error(message)
    
    def critical(self, message: str):
        """记录严重错误级别的日志"""
        self.logger.critical(message)
    
    def get_log_files(self) -> list:
        """获取所有日志文件"""
        return list(self.log_dir.glob('*.log'))
    
    def view_logs(self, days: int = 7):
        """查看最近几天的日志"""
        print("="*60)
        print("查看日志")
        print("="*60)
        print()
        
        if not self.log_dir.exists() or not any(self.log_dir.iterdir()):
            print("[INFO] 没有日志文件")
            return
        
        # 获取最近几天的日志文件
        cutoff_date = datetime.now() - timedelta(days=days)
        recent_logs = []
        
        for log_file in self.log_dir.glob('*.log'):
            # 从文件名中提取日期
            try:
                log_date_str = log_file.stem.split('_')[-1]
                log_date = datetime.strptime(log_date_str, '%Y-%m-%d')
                if log_date >= cutoff_date:
                    recent_logs.append((log_date, log_file))
            except Exception:
                pass
        
        if not recent_logs:
            print(f"[INFO] 最近 {days} 天没有日志文件")
            return
        
        # 按日期排序
        recent_logs.sort(reverse=True)
        
        print(f"最近 {days} 天的日志文件:")
        print()
        
        for i, (log_date, log_file) in enumerate(recent_logs, 1):
            print(f"  {i}. {log_file.name} ({log_date.strftime('%Y-%m-%d')})")
        print()
        
        # 选择要查看的日志文件
        choice = input("请选择要查看的日志文件编号 (直接回车取消): " ).strip()
        if not choice:
            print("[INFO] 已取消")
            return
        
        try:
            idx = int(choice) - 1
            if 0 <= idx < len(recent_logs):
                selected_file = recent_logs[idx][1]
            else:
                print("[ERROR] 无效的编号")
                return
        except ValueError:
            print("[ERROR] 请输入有效的数字")
            return
        
        print()
        print(f"查看日志文件: {selected_file.name}")
        print("-"*60)
        
        try:
            with open(selected_file, 'r', encoding='utf-8') as f:
                content = f.read()
                # 显示最后100行
                lines = content.split('\n')
                start_line = max(0, len(lines) - 100)
                for line in lines[start_line:]:
                    if line.strip():
                        print(line)
        except Exception as e:
            print(f"[ERROR] 读取日志文件失败: {e}")
    
    def clean_logs(self, days: int = 30):
        """清理过期的日志文件"""
        print("="*60)
        print("清理日志")
        print("="*60)
        print()
        
        if not self.log_dir.exists() or not any(self.log_dir.iterdir()):
            print("[INFO] 没有日志文件需要清理")
            return
        
        # 计算过期日期
        cutoff_date = datetime.now() - timedelta(days=days)
        expired_logs = []
        
        for log_file in self.log_dir.glob('*.log'):
            # 从文件名中提取日期
            try:
                log_date_str = log_file.stem.split('_')[-1]
                log_date = datetime.strptime(log_date_str, '%Y-%m-%d')
                if log_date < cutoff_date:
                    expired_logs.append(log_file)
            except Exception:
                pass
        
        if not expired_logs:
            print(f"[INFO] 没有超过 {days} 天的日志文件需要清理")
            return
        
        print(f"发现 {len(expired_logs)} 个过期的日志文件:")
        print()
        
        for log_file in expired_logs:
            print(f"  - {log_file.name}")
        print()
        
        confirm = input(f"确认清理这些过期的日志文件? (1=确认, 0=取消): " ).strip()
        if confirm != '1':
            print("[INFO] 已取消")
            return
        
        # 清理过期日志
        deleted_count = 0
        for log_file in expired_logs:
            try:
                log_file.unlink()
                deleted_count += 1
            except Exception as e:
                print(f"[ERROR] 清理日志文件失败 {log_file.name}: {e}")
        
        print()
        print(f"[SUCCESS] 已清理 {deleted_count} 个过期的日志文件")


# 创建全局日志实例
logger = Logger()


# 日志装饰器
def log_function(func):
    """记录函数执行的日志装饰器"""
    def wrapper(*args, **kwargs):
        function_name = func.__name__
        logger.info(f"开始执行函数: {function_name}")
        
        try:
            result = func(*args, **kwargs)
            logger.info(f"函数执行成功: {function_name}")
            return result
        except Exception as e:
            logger.error(f"函数执行失败 {function_name}: {e}")
            raise
    
    return wrapper
