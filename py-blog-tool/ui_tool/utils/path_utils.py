#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
路径工具函数
"""

import os
from pathlib import Path


def get_relative_path(path, base):
    """获取相对路径"""
    try:
        return str(Path(path).relative_to(base))
    except ValueError:
        return str(path)


def get_absolute_path(path):
    """获取绝对路径"""
    return str(Path(path).absolute())


def join_paths(*paths):
    """连接路径"""
    return str(Path(*paths))


def get_file_name(path):
    """获取文件名（不含扩展名）"""
    return Path(path).stem


def get_file_extension(path):
    """获取文件扩展名"""
    return Path(path).suffix


def get_parent_directory(path):
    """获取父目录"""
    return str(Path(path).parent)


def is_file(path):
    """判断是否为文件"""
    return Path(path).is_file()


def is_directory(path):
    """判断是否为目录"""
    return Path(path).is_dir()


def exists(path):
    """判断路径是否存在"""
    return Path(path).exists()


def get_size(path):
    """获取文件大小"""
    if is_file(path):
        return Path(path).stat().st_size
    return 0


def get_modified_time(path):
    """获取文件修改时间"""
    if exists(path):
        return Path(path).stat().st_mtime
    return 0


def get_posts_directory():
    """获取文章目录"""
    project_root = Path(__file__).parent.parent.parent
    return project_root / 'src' / 'pages' / 'post'


def get_projects_directory():
    """获取项目目录"""
    project_root = Path(__file__).parent.parent.parent
    return project_root / 'src' / 'pages' / 'project'


def get_config_directory():
    """获取配置目录"""
    project_root = Path(__file__).parent.parent.parent
    return project_root / 'public' / 'config'