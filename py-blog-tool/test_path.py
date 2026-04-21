#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试路径配置
"""

import sys
from pathlib import Path

# 添加当前目录到路径
sys.path.insert(0, str(Path(__file__).parent / 'ui_tool'))

from utils.common import get_project_root, get_search_json, get_post_files

print("测试路径配置...")
print("=" * 50)

# 测试get_project_root函数
project_root = get_project_root()
print(f"项目根目录: {project_root}")
print(f"项目根目录是否存在: {project_root.exists()}")

# 测试get_search_json函数
search_json = get_search_json()
print(f"\n搜索JSON文件: {search_json}")
print(f"搜索JSON文件是否存在: {search_json.exists()}")

# 测试get_post_files函数
post_files = get_post_files()
print(f"\n文章文件数量: {len(post_files)}")
if post_files:
    print("前5个文章文件:")
    for i, post_file in enumerate(post_files[:5]):
        print(f"  {i+1}. {post_file.name}")

# 测试其他路径
print("\n其他路径测试:")
print(f"Vue博客目录: {project_root}")
print(f"文章目录: {project_root / 'src' / 'pages' / 'post'}")
print(f"配置目录: {project_root / 'public' / 'config'}")
print(f"媒体目录: {project_root / 'src' / 'assets' / 'imgs'}")

print("=" * 50)
print("路径配置测试完成！")