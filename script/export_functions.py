#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
导出相关的函数
包含文章导出为Markdown、JSON、HTML、PDF和EPUB的功能
"""

import re
import json
from datetime import datetime
from pathlib import Path
from cli_utils import get_project_paths, load_search_json, create_timestamped_dir, generate_safe_filename, format_tags_html, display_operation_result
from error_handling import handle_error, ImportExportError
from progress_utils import show_progress


# 导出文章为Markdown
@handle_error
def export_to_markdown():
    project_root, posts_dir, search_json_path = get_project_paths()
    import_export_dir = project_root / "import_export"
    export_dir = import_export_dir / "export"
    markdown_dir = export_dir / "markdown"
    
    print("="*50)
    print("导出文章为Markdown")
    print("="*50)
    print()
    
    search_data = load_search_json(search_json_path)
    
    # 过滤出文章条目
    post_items = [item for item in search_data if item.get('path', '').startswith('./html/posts/')]
    
    if not post_items:
        print("[INFO] 暂无文章可导出")
        return
    
    # 创建导出目录
    md_export_dir = create_timestamped_dir(markdown_dir, "markdown")
    if not md_export_dir:
        raise ImportExportError("创建导出目录失败")
    
    print(f"导出目录: {md_export_dir}")
    print(f"文章数量: {len(post_items)}")
    print()
    
    success_count = 0
    failed_count = 0
    
    for item in show_progress(post_items, desc="导出Markdown"):
        try:
            post_id = item.get('id', '')
            title = item.get('title', f'文章{post_id}')
            
            # 构建文件名
            md_file_name = generate_safe_filename(title, post_id, ".md")
            md_file_path = md_export_dir / md_file_name
            
            # 构建Markdown内容
            category = item.get('category', '随笔')
            tags = item.get('tags', [])
            date = item.get('date', '')
            
            md_content = f"""
---
title: {title}
category: {category}
tags: {', '.join(tags)}
date: {date}
---

# {title}

文章内容...
"""
            
            with open(md_file_path, 'w', encoding='utf-8') as f:
                f.write(md_content)
            # 进度条已经显示，不需要额外打印
            success_count += 1
        except Exception as e:
            print(f"[ERROR] 导出失败: {e}")
            failed_count += 1
    
    display_operation_result("导出", success_count, failed_count, md_export_dir)



# 导出文章为HTML
@handle_error
def export_to_html():
    project_root, posts_dir, search_json_path = get_project_paths()
    import_export_dir = project_root / "import_export"
    export_dir = import_export_dir / "export"
    html_dir = export_dir / "html"
    
    print("="*50)
    print("导出文章为HTML")
    print("="*50)
    print()
    
    search_data = load_search_json(search_json_path)
    
    # 过滤出文章条目
    post_items = [item for item in search_data if item.get('path', '').startswith('./html/posts/')]
    
    if not post_items:
        print("[INFO] 暂无文章可导出")
        return
    
    # 创建导出目录
    html_export_dir = create_timestamped_dir(html_dir, "html")
    if not html_export_dir:
        raise ImportExportError("创建导出目录失败")
    
    print(f"导出目录: {html_export_dir}")
    print(f"文章数量: {len(post_items)}")
    print()
    
    success_count = 0
    failed_count = 0
    
    for item in show_progress(post_items, desc="导出HTML"):
        try:
            post_id = item.get('id', '')
            title = item.get('title', f'文章{post_id}')
            
            # 构建文件名
            html_file_name = generate_safe_filename(title, post_id, ".html")
            html_file_path = html_export_dir / html_file_name
            
            # 构建HTML内容
            category = item.get('category', '随笔')
            tags = item.get('tags', [])
            date = item.get('date', '')
            tags_html = format_tags_html(tags)
            
            html_content = f"""
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link rel="stylesheet" href="../../css/blog-post.css">
    <link rel="stylesheet" href="../../css/music-player.css">
</head>
<body>
    <div class="post-container">
        <h1 class="post-title">{title}</h1>
        <div class="post-meta">
            <span class="post-date">{date}</span>
            <span class="post-category">{category}</span>
            {tags_html}
        </div>
        <div class="post-content">
            文章内容...
        </div>
    </div>
    <script src="../../js/header-js/music-player.js"></script>
</body>
</html>
        """
            
            with open(html_file_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            # 进度条已经显示，不需要额外打印
            success_count += 1
        except Exception as e:
            print(f"[ERROR] 导出失败: {e}")
            failed_count += 1
    
    display_operation_result("导出", success_count, failed_count, html_export_dir)


