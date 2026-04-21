#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
通用工具函数
"""

import os
from pathlib import Path
import json
import yaml
from datetime import datetime


def get_project_root():
    """获取项目根目录"""
    current_path = Path(__file__).parent.parent.parent.parent  # 现在工具位于 py-blog-tool 目录下
    vue_blog_path = current_path / 'vue-blog'
    if vue_blog_path.exists():
        return vue_blog_path
    
    # 备用方案：向上查找
    current_path = Path(__file__).parent.parent
    while current_path:
        vue_blog_path = current_path / 'vue-blog'
        if vue_blog_path.exists():
            return vue_blog_path
        if current_path.parent == current_path:
            break
        current_path = current_path.parent
    
    # 找不到项目根目录，返回当前目录
    return Path('.')


def read_json(file_path):
    """读取JSON文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"读取JSON文件失败: {e}")
        return {}


def write_json(file_path, data):
    """写入JSON文件"""
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"写入JSON文件失败: {e}")
        return False


def read_yaml(file_path):
    """读取YAML文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    except Exception as e:
        print(f"读取YAML文件失败: {e}")
        return {}


def write_yaml(file_path, data):
    """写入YAML文件"""
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, allow_unicode=True)
        return True
    except Exception as e:
        print(f"写入YAML文件失败: {e}")
        return False


def format_datetime(dt):
    """格式化日期时间"""
    if isinstance(dt, str):
        dt = datetime.fromisoformat(dt)
    return dt.strftime('%Y-%m-%d %H:%M:%S')


def ensure_directory(directory):
    """确保目录存在"""
    directory = Path(directory)
    if not directory.exists():
        directory.mkdir(parents=True, exist_ok=True)
    return directory


def get_files_by_extension(directory, extension):
    """获取目录下指定扩展名的文件"""
    directory = Path(directory)
    if not directory.exists():
        return []
    return list(directory.glob(f'*{extension}'))


def get_post_files():
    """获取所有文章文件"""
    project_root = get_project_root()
    post_dir = project_root / 'src' / 'pages' / 'post'
    return get_files_by_extension(post_dir, '.md')


def get_search_json():
    """获取搜索JSON文件路径"""
    project_root = get_project_root()
    return project_root / 'public' / 'config' / 'search.json'