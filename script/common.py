#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
通用工具函数
包含项目路径获取、JSON处理、文章信息类等基础功能
"""

import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from color_utils import print_success, print_error, print_info, print_warning, print_title, print_separator


# 获取项目路径
def get_project_paths() -> tuple:
    # 获取项目路径
    from path_utils import get_project_paths as get_paths
    return get_paths()


# 加载 search.json 文件
def load_search_json(search_json_path: Path) -> List[Dict]:
    if not search_json_path.exists():
        return []
    
    try:
        with open(search_json_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print_error(f"[ERROR] 读取 search.json 失败: {e}")
        return []


# 保存数据到 search.json 文件
def save_search_json(search_json_path: Path, data: List[Dict]):
    try:
        with open(search_json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print_success(f"[SUCCESS] search.json 已更新")
    except Exception as e:
        print_error(f"[ERROR] 保存 search.json 失败: {e}")


# 文章信息类
class PostInfo:
    def __init__(self, post_id: str, title: str, category: str, tags: List[str],
                 date: str, path: str, file_path: Path):
        self.id = post_id
        self.title = title
        self.category = category
        self.tags = tags
        self.date = date
        self.path = path
        self.file_path = file_path
    
    # 返回文章信息的字符串表示
    def __str__(self) -> str:
        return f"[{self.id:>3}] {self.title:<30} ({self.category})"


# 获取所有文章信息
def get_all_posts(posts_dir: Path, search_data: List[Dict]) -> List[PostInfo]:
    posts = []
    
    for item in search_data:
        path = item.get('path', '')
        if not path.startswith('./html/posts/'):
            continue
        
        post_id = item.get('id', '')
        file_path = posts_dir / f"post-{post_id}.html"
        
        if file_path.exists():
            posts.append(PostInfo(
                post_id=post_id,
                title=item.get('title', f'文章{post_id}'),
                category=item.get('category', '随笔'),
                tags=item.get('tags', []),
                date=item.get('date', ''),
                path=path,
                file_path=file_path
            ))
    
    # 按ID排序
    posts.sort(key=lambda x: int(x.id))
    return posts

# 显示文章列表
def display_posts(posts: List[PostInfo]):
    from color_utils import Colors, colorize
    print_info(f"共 {len(posts)} 篇文章")
    print_separator(50, '-')
    for post in posts:
        # 为不同分类添加不同颜色
        if post.category == '技术':
            color = Colors.CYAN
        elif post.category == '生活':
            color = Colors.GREEN
        elif post.category == '学习':
            color = Colors.YELLOW
        else:
            color = Colors.WHITE
        print(colorize(str(post), color))
    print_separator(50, '-')


# 打印欢迎图案
def print_welcome():
    from color_utils import Colors, colorize
    
    print()
    print(colorize('='*84, Colors.GREEN))
    print()
    print(colorize(r'  =======    ====   ====    ==== ====    ==========      ==========      ====  ====', Colors.BLUE))
    print(colorize(r' //           ||\\   ||      ||  //      ||       ||     ||       ||      ||    ||', Colors.CYAN))
    print(colorize(r'//            || \\  ||      || //       ||=========     ||=========      ||    ||', Colors.BLUE))
    print(colorize(r'\\            ||  \\ ||      || \\       ||   \\         ||   \\          ||    ||', Colors.CYAN))
    print(colorize(r' \\           ||   \\||      ||  \\      ||    \\        ||    \\         \\    //', Colors.BLUE))
    print(colorize(r'  =======    ====   ====    ==== ====   ====   ====     ====    ====       ======', Colors.CYAN))
    print()
    print(colorize('='*84, Colors.GREEN))
    print()
    print(colorize("博客命令行工具 - 作者: Cnkrru | 日期: 2026-02-17", Colors.YELLOW))
    print()