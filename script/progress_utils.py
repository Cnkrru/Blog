#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
进度条工具函数
包含进度条显示相关的函数
"""

from tqdm import tqdm
from typing import Iterable, Callable, Any


# 显示进度条
def show_progress(iterable: Iterable, desc: str = "处理中", unit: str = "item") -> Iterable:
    """
    显示进度条
    
    Args:
        iterable: 可迭代对象
        desc: 进度条描述
        unit: 单位
    
    Returns:
        带有进度条的可迭代对象
    """
    return tqdm(iterable, desc=desc, unit=unit, ncols=80)


# 执行带进度条的操作
def execute_with_progress(items: Iterable, operation: Callable[[Any], None], desc: str = "处理中"):
    """
    执行带进度条的操作
    
    Args:
        items: 要处理的项目列表
        operation: 处理函数
        desc: 进度条描述
    """
    for item in show_progress(items, desc):
        operation(item)


# 执行带进度条的批量操作并返回结果
def execute_with_progress_return(items: Iterable, operation: Callable[[Any], Any], desc: str = "处理中") -> list:
    """
    执行带进度条的批量操作并返回结果
    
    Args:
        items: 要处理的项目列表
        operation: 处理函数
        desc: 进度条描述
    
    Returns:
        处理结果列表
    """
    results = []
    for item in show_progress(items, desc):
        result = operation(item)
        results.append(result)
    return results
