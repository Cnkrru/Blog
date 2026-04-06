#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
错误处理模块
提供统一的错误处理机制
"""

from color_utils import print_error, print_info


class BlogCLIError(Exception):
    """博客命令行工具异常基类"""
    pass


class FileOperationError(BlogCLIError):
    """文件操作异常"""
    pass


class ConfigError(BlogCLIError):
    """配置异常"""
    pass


class ImportExportError(BlogCLIError):
    """导入导出异常"""
    pass


class PostOperationError(BlogCLIError):
    """文章操作异常"""
    pass


def handle_error(func):
    """错误处理装饰器"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except BlogCLIError as e:
            print_error(f"[ERROR] {str(e)}")
        except Exception as e:
            print_error(f"[ERROR] 操作失败: {str(e)}")
    return wrapper


def handle_error_with_return(func):
    """带返回值的错误处理装饰器"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except BlogCLIError as e:
            print_error(f"[ERROR] {str(e)}")
            return None
        except Exception as e:
            print_error(f"[ERROR] 操作失败: {str(e)}")
            return None
    return wrapper