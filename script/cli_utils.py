#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
命令行工具通用模块
整合通用功能，减少模块间依赖
"""

import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from color_utils import print_success, print_error, print_info, print_warning, print_title, print_separator
from error_handling import BlogCLIError, FileOperationError, ConfigError, ImportExportError, PostOperationError


# 获取项目路径
def get_project_paths() -> tuple:
    """获取项目路径
    
    Returns:
        tuple: (project_root, posts_dir, search_json_path)
    """
    project_root = Path(__file__).parent.parent
    posts_dir = project_root / "html" / "posts"
    search_json_path = project_root / "config" / "search.json"
    return project_root, posts_dir, search_json_path


# 缓存字典
_cache = {}

# 加载 search.json 文件
def load_search_json(search_json_path: Path) -> List[Dict]:
    """加载 search.json 文件
    
    Args:
        search_json_path: search.json 文件路径
    
    Returns:
        List[Dict]: 搜索数据列表
    """
    # 检查缓存
    cache_key = str(search_json_path)
    if cache_key in _cache:
        cached_data, mtime = _cache[cache_key]
        # 检查文件是否被修改
        if search_json_path.exists() and search_json_path.stat().st_mtime == mtime:
            return cached_data
    
    if not search_json_path.exists():
        _cache[cache_key] = ([], 0)
        return []
    
    try:
        with open(search_json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        # 更新缓存
        mtime = search_json_path.stat().st_mtime
        _cache[cache_key] = (data, mtime)
        return data
    except Exception as e:
        print_error(f"[ERROR] 读取 search.json 失败: {e}")
        _cache[cache_key] = ([], 0)
        return []


# 保存数据到 search.json 文件
def save_search_json(search_json_path: Path, data: List[Dict]):
    """保存数据到 search.json 文件
    
    Args:
        search_json_path: search.json 文件路径
        data: 要保存的数据
    """
    try:
        with open(search_json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print_success(f"[SUCCESS] search.json 已更新")
        # 清除缓存
        cache_key = str(search_json_path)
        if cache_key in _cache:
            del _cache[cache_key]
    except Exception as e:
        print_error(f"[ERROR] 保存 search.json 失败: {e}")


# 文章信息类
class PostInfo:
    """文章信息类"""
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
    """获取所有文章信息
    
    Args:
        posts_dir: 文章目录路径
        search_data: 搜索数据列表
    
    Returns:
        List[PostInfo]: 文章信息列表
    """
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
    """显示文章列表
    
    Args:
        posts: 文章信息列表
    """
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
    """打印欢迎图案"""
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


# 解析ID输入
def parse_id_input(input_str: str) -> List[str]:
    """解析ID输入
    
    Args:
        input_str: 输入字符串
    
    Returns:
        List[str]: ID列表
    """
    if not input_str:
        return []
    
    # 处理列表格式 [1,2,3]
    if input_str.startswith('[') and input_str.endswith(']'):
        input_str = input_str[1:-1]
    
    # 分割并清理
    ids = [id.strip() for id in input_str.split(',')]
    # 过滤空字符串
    ids = [id for id in ids if id]
    
    return ids


# 验证日期格式
def validate_date_format(date_str: str) -> bool:
    """验证日期格式
    
    Args:
        date_str: 日期字符串
    
    Returns:
        bool: 是否有效
    """
    import re
    # 验证 YYYY-MM-DD 格式
    pattern = r'^\d{4}-\d{2}-\d{2}$'
    return bool(re.match(pattern, date_str))


# 创建时间戳目录
def create_timestamped_dir(base_dir: Path, prefix: str) -> Path:
    """创建时间戳目录
    
    Args:
        base_dir: 基础目录
        prefix: 目录前缀
    
    Returns:
        Path: 创建的目录路径
    """
    from datetime import datetime
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    new_dir = base_dir / f"{prefix}_{timestamp}"
    
    try:
        new_dir.mkdir(parents=True, exist_ok=True)
        return new_dir
    except Exception as e:
        print_error(f"[ERROR] 创建目录失败: {e}")
        return None


# 生成安全文件名
def generate_safe_filename(title: str, post_id: str, extension: str) -> str:
    """生成安全文件名
    
    Args:
        title: 标题
        post_id: 文章ID
        extension: 文件扩展名
    
    Returns:
        str: 安全文件名
    """
    import re
    # 移除特殊字符
    safe_title = re.sub(r'[^a-zA-Z0-9\u4e00-\u9fa5]', '_', title)
    # 限制长度
    safe_title = safe_title[:50]
    # 生成文件名
    return f"{post_id:03d}_{safe_title}{extension}"


# 格式化标签HTML
def format_tags_html(tags: List[str]) -> str:
    """格式化标签HTML
    
    Args:
        tags: 标签列表
    
    Returns:
        str: 标签HTML
    """
    if not tags:
        return ''
    
    return ''.join([f'<span class="post-tag">{tag}</span>' for tag in tags])


# 显示操作结果
def display_operation_result(operation: str, success_count: int, failed_count: int, output_dir: Path):
    """显示操作结果
    
    Args:
        operation: 操作名称
        success_count: 成功数量
        failed_count: 失败数量
        output_dir: 输出目录
    """
    print()
    print("="*50)
    print(f"{operation}完成!")
    print(f"  成功: {success_count} 个文件")
    print(f"  失败: {failed_count} 个文件")
    print(f"  输出位置: {output_dir}")
    print("="*50)