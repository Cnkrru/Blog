#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
通用工具函数
包含各种公共的辅助函数
"""

import re
from datetime import datetime
from pathlib import Path
from typing import List, Optional


# 解析输入的ID列表
def parse_id_input(input_str: str) -> List[str]:
    """
    解析输入的ID列表，支持多种格式
    
    Args:
        input_str: 输入字符串，支持以下格式：
            - 逗号分隔: "1,3,5"
            - 空格分隔: "1 3 5"
            - 列表格式: "[1,3,5]"
            - 混合格式: "1, 3 5"
    
    Returns:
        解析后的ID列表
    """
    try:
        # 移除列表括号
        if input_str.startswith('[') and input_str.endswith(']'):
            input_str = input_str[1:-1]
        
        # 替换空格为逗号
        input_str = input_str.replace(' ', ',')
        
        # 按逗号分割并去重
        ids = set()
        for id_str in input_str.split(','):
            id_str = id_str.strip()
            if id_str:
                ids.add(id_str)
        
        # 转换为列表并返回
        return list(ids)
    except Exception:
        return []


# 创建带时间戳的目录
def create_timestamped_dir(base_dir: Path, prefix: str) -> Optional[Path]:
    """
    创建带时间戳的目录
    
    Args:
        base_dir: 基础目录
        prefix: 目录前缀
    
    Returns:
        创建的目录路径，如果失败返回 None
    """
    try:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        target_dir = base_dir / f"{prefix}_{timestamp}"
        target_dir.mkdir(parents=True, exist_ok=True)
        print(f"[INFO] 创建目录: {target_dir}")
        return target_dir
    except Exception as e:
        print(f"[ERROR] 创建目录失败: {e}")
        return None


# 生成安全的文件名
def generate_safe_filename(title: str, post_id: str, extension: str) -> str:
    """
    生成安全的文件名
    
    Args:
        title: 文章标题
        post_id: 文章ID
        extension: 文件扩展名，如 ".md" 或 ".html"
    
    Returns:
        安全的文件名
    """
    safe_title = re.sub(r'[\\/:*?"<>|]', '_', title)
    try:
        return f"{int(post_id):03d}_{safe_title}{extension}"
    except ValueError:
        return f"{post_id}_{safe_title}{extension}"


# 验证日期格式
def validate_date_format(date_str: str) -> bool:
    """
    验证日期格式是否为 YYYY-MM-DD
    
    Args:
        date_str: 日期字符串
    
    Returns:
        是否为有效的日期格式
    """
    return bool(re.match(r'^\d{4}-\d{2}-\d{2}$', date_str))


# 格式化标签为HTML
def format_tags_html(tags: List[str]) -> str:
    """
    格式化标签为HTML
    
    Args:
        tags: 标签列表
    
    Returns:
        格式化后的HTML字符串
    """
    return ''.join([f'<span class="post-tag">{tag}</span>' for tag in tags])


# 显示操作结果
def display_operation_result(operation: str, success_count: int, failed_count: int, location: Optional[Path] = None):
    """
    显示操作结果
    
    Args:
        operation: 操作名称
        success_count: 成功数量
        failed_count: 失败数量
        location: 操作位置（可选）
    """
    print()
    print("="*50)
    print(f"{operation}完成!")
    print(f"  成功: {success_count} 个文件")
    print(f"  失败: {failed_count} 个文件")
    if location:
        print(f"  位置: {location}")
    print("="*50)


# 确认操作
def confirm_operation(operation: str, items: List) -> bool:
    """
    确认操作
    
    Args:
        operation: 操作名称
        items: 操作对象列表
    
    Returns:
        是否确认操作
    """
    print()
    print(f"确定要{operation}以下 {len(items)} 个项目吗？")
    for item in items:
        print(f"  {item}")
    print()
    
    confirm = input("确认操作? (1=确认, 0=取消): " ).strip()
    return confirm == '1'
