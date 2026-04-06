#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
颜色工具函数
包含命令行颜色处理相关的函数
"""

import colorama
from colorama import Fore, Back, Style

# 初始化 colorama
colorama.init(autoreset=True)


# 颜色常量
class Colors:
    """颜色常量类"""
    # 文字颜色
    BLACK = Fore.BLACK
    RED = Fore.RED
    GREEN = Fore.GREEN
    YELLOW = Fore.YELLOW
    BLUE = Fore.BLUE
    MAGENTA = Fore.MAGENTA
    CYAN = Fore.CYAN
    WHITE = Fore.WHITE
    
    # 背景颜色
    BGBLACK = Back.BLACK
    BGRED = Back.RED
    BGGREEN = Back.GREEN
    BGYELLOW = Back.YELLOW
    BGBLUE = Back.BLUE
    BGMAGENTA = Back.MAGENTA
    BGCYAN = Back.CYAN
    BGWHITE = Back.WHITE
    
    # 样式
    BRIGHT = Style.BRIGHT
    DIM = Style.DIM
    NORMAL = Style.NORMAL
    RESET = Style.RESET_ALL


# 格式化带颜色的文本
def colorize(text, color=Colors.WHITE, bg_color=Colors.BGBLACK, style=Colors.NORMAL):
    """
    格式化带颜色的文本
    
    Args:
        text: 要格式化的文本
        color: 文字颜色
        bg_color: 背景颜色
        style: 文字样式
    
    Returns:
        格式化后的文本
    """
    return f"{style}{color}{bg_color}{text}{Colors.RESET}"


# 打印带颜色的文本
def print_color(text, color=Colors.WHITE, bg_color=Colors.BGBLACK, style=Colors.NORMAL):
    """
    打印带颜色的文本
    
    Args:
        text: 要打印的文本
        color: 文字颜色
        bg_color: 背景颜色
        style: 文字样式
    """
    print(colorize(text, color, bg_color, style))


# 打印成功信息
def print_success(text):
    """
    打印成功信息
    
    Args:
        text: 要打印的文本
    """
    print_color(text, Colors.GREEN, style=Colors.BRIGHT)


# 打印错误信息
def print_error(text):
    """
    打印错误信息
    
    Args:
        text: 要打印的文本
    """
    print_color(text, Colors.RED, style=Colors.BRIGHT)


# 打印警告信息
def print_warning(text):
    """
    打印警告信息
    
    Args:
        text: 要打印的文本
    """
    print_color(text, Colors.YELLOW, style=Colors.BRIGHT)


# 打印信息
def print_info(text):
    """
    打印信息
    
    Args:
        text: 要打印的文本
    """
    print_color(text, Colors.CYAN, style=Colors.NORMAL)


# 打印标题
def print_title(text):
    """
    打印标题
    
    Args:
        text: 要打印的文本
    """
    print_color(text, Colors.BLUE, style=Colors.BRIGHT)


# 打印分隔线
def print_separator(length=50, char='=', color=Colors.CYAN):
    """
    打印分隔线
    
    Args:
        length: 分隔线长度
        char: 分隔线字符
        color: 分隔线颜色
    """
    print_color(char * length, color)


# 打印菜单选项
def print_menu_option(option, text, color=Colors.WHITE):
    """
    打印菜单选项
    
    Args:
        option: 选项编号
        text: 选项文本
        color: 文字颜色
    """
    print_color(f"  {option}. {text}", color)


# 打印高亮文本
def print_highlight(text, color=Colors.YELLOW, style=Colors.BRIGHT):
    """
    打印高亮文本
    
    Args:
        text: 要打印的文本
        color: 文字颜色
        style: 文字样式
    """
    print_color(text, color, style=style)


# 打印带背景的文本
def print_with_background(text, bg_color=Colors.BGBLUE, text_color=Colors.WHITE):
    """
    打印带背景的文本
    
    Args:
        text: 要打印的文本
        bg_color: 背景颜色
        text_color: 文字颜色
    """
    print_color(text, text_color, bg_color, Colors.BRIGHT)


# 打印进度条
def print_progress_bar(progress, total, length=50):
    """
    打印进度条
    
    Args:
        progress: 当前进度
        total: 总进度
        length: 进度条长度
    """
    percent = (progress / total) * 100
    filled_length = int(length * progress // total)
    bar = '█' * filled_length + '-' * (length - filled_length)
    print(f'\r[{bar}] {percent:.1f}%', end='')
    if progress == total:
        print()


# 打印表格
def print_table(headers, rows, header_color=Colors.BLUE, row_color=Colors.WHITE):
    """
    打印表格
    
    Args:
        headers: 表头列表
        rows: 行数据列表
        header_color: 表头颜色
        row_color: 行颜色
    """
    # 计算每列的最大宽度
    widths = [len(str(header)) for header in headers]
    for row in rows:
        for i, cell in enumerate(row):
            if i < len(widths):
                widths[i] = max(widths[i], len(str(cell)))
    
    # 打印表头
    header_line = ' | '.join([str(header).ljust(width) for header, width in zip(headers, widths)])
    print_color(header_line, header_color, style=Colors.BRIGHT)
    
    # 打印分隔线
    separator_line = '-+-'.join(['-' * width for width in widths])
    print_color(separator_line, header_color)
    
    # 打印行数据
    for row in rows:
        row_line = ' | '.join([str(cell).ljust(width) for cell, width in zip(row, widths)])
        print_color(row_line, row_color)


# 打印边框文本
def print_bordered(text, border_char='=', color=Colors.CYAN):
    """
    打印带边框的文本
    
    Args:
        text: 要打印的文本
        border_char: 边框字符
        color: 边框颜色
    """
    lines = text.split('\n')
    max_length = max(len(line) for line in lines)
    
    print_color(border_char * (max_length + 4), color)
    for line in lines:
        print_color(f"{border_char} {line.ljust(max_length)} {border_char}", color)
    print_color(border_char * (max_length + 4), color)
