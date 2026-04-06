#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文章工具相关的函数
包含文章统计、备份、扫描等功能
"""

import re
import shutil
from datetime import datetime
from pathlib import Path
from typing import List, Dict
from cli_utils import get_project_paths, load_search_json, save_search_json, get_all_posts, display_posts
from error_handling import handle_error, PostOperationError


# 文章统计
@handle_error
def post_statistics():
    project_root, posts_dir, search_json_path = get_project_paths()
    
    print("="*50)
    print("文章统计")
    print("="*50)
    print()
    
    search_data = load_search_json(search_json_path)
    posts = get_all_posts(posts_dir, search_data)
    
    print(f"文章总数: {len(posts)}")
    
    # 按分类统计
    category_count = {}
    for post in posts:
        category = post.category
        category_count[category] = category_count.get(category, 0) + 1
    
    print("\n分类统计:")
    if category_count:
        for category, count in category_count.items():
            print(f"  {category}: {count} 篇")
    else:
        print("  无分类数据")
    
    # 按年份统计
    year_count = {}
    for post in posts:
        if post.date:
            try:
                year = post.date.split('-')[0]
                year_count[year] = year_count.get(year, 0) + 1
            except Exception:
                pass  # 跳过日期格式错误的文章
    
    print("\n年份统计:")
    if year_count:
        for year, count in sorted(year_count.items()):
            print(f"  {year}: {count} 篇")
    else:
        print("  无年份数据")
    
    print()



# 扫描文章并更新 search.json
@handle_error
def scan_and_update_search_json():
    project_root, posts_dir, search_json_path = get_project_paths()
    
    print("="*50)
    print("扫描文章并更新 search.json")
    print("="*50)
    print()
    
    # 扫描文章文件
    post_files = list(posts_dir.glob('post-*.html'))
    if not post_files:
        print("[INFO] 没有找到文章文件")
        return
    
    print(f"发现 {len(post_files)} 个文章文件")
    print()
    
    # 解析文章信息
    new_search_data = []
    success_count = 0
    failed_count = 0
    
    for post_file in post_files:
        try:
            # 提取ID
            post_id = post_file.stem.replace('post-', '')
            if not post_id.isdigit():
                print(f"[WARNING] 无效的文章ID: {post_file.name}")
                failed_count += 1
                continue
            
            # 读取文件内容
            with open(post_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 提取标题
            title_match = re.search(r'<h1[^>]*>(.*?)</h1>', content)
            title = title_match.group(1) if title_match else f'文章{post_id}'
            
            # 提取日期
            date_match = re.search(r'<span[^>]*class="post-date"[^>]*>(.*?)</span>', content)
            date = date_match.group(1) if date_match else ''
            
            # 提取分类
            category_match = re.search(r'<span[^>]*class="post-category"[^>]*>(.*?)</span>', content)
            category = category_match.group(1) if category_match else '随笔'
            
            # 提取标签
            tags = []
            tags_match = re.findall(r'<span[^>]*class="post-tag"[^>]*>(.*?)</span>', content)
            if tags_match:
                tags = tags_match
            
            # 构建路径
            relative_path = f'./html/posts/{post_file.name}'
            
            # 添加到数据
            new_search_data.append({
                'id': post_id,
                'title': title,
                'category': category,
                'tags': tags,
                'path': relative_path,
                'date': date
            })
            
            success_count += 1
            
        except Exception as e:
            print(f"[ERROR] 解析文件失败 {post_file.name}: {e}")
            failed_count += 1
    
    # 保存更新后的search.json
    if success_count > 0:
        save_search_json(search_json_path, new_search_data)
    
    print()
    print("="*50)
    print("扫描完成!")
    print(f"  成功: {success_count} 个文件")
    print(f"  失败: {failed_count} 个文件")
    print("="*50)

# 创建文章模板HTML
@handle_error
def create_post_template():
    from path_utils import get_template_path
    project_root, posts_dir, search_json_path = get_project_paths()
    
    print("="*50)
    print("创建文章模板HTML")
    print("="*50)
    print()
    
    # 加载现有数据
    search_data = load_search_json(search_json_path)
    
    # 获取现有最大ID
    existing_ids = []
    for item in search_data:
        if item.get('path', '').startswith('./html/posts/'):
            try:
                existing_ids.append(int(item.get('id', '0')))
            except ValueError:
                pass  # 跳过无效的ID
    
    next_id = max(existing_ids) + 1 if existing_ids else 0
    
    # 使用默认值，不需要用户输入
    date_str = datetime.now().strftime('%Y-%m-%d')
    title = f"新文章 {date_str}"
    category = "未分类"
    tags = ""
    description = title
    
    # 生成文件名
    filename = f"post-{next_id}.html"
    file_path = posts_dir / filename
    
    # 读取模板文件
    template_path = get_template_path()
    print(f"[INFO] 使用模板文件: {template_path}")
    
    with open(template_path, 'r', encoding='utf-8') as f:
        html_template = f.read()
    
    # 替换模板变量
    html_content = html_template.replace('{title}', title)
    html_content = html_content.replace('{description}', description)
    html_content = html_content.replace('{tags}', tags)
    html_content = html_content.replace('{date_str}', date_str)
    html_content = html_content.replace('{category}', category)
    html_content = html_content.replace('{year}', str(datetime.now().year))
    
    # 创建文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print()
    print("[SUCCESS] 文章模板创建成功")
    print(f"  文件名: {filename}")
    print(f"  保存位置: {file_path}")
    print()
    
    # 更新search.json
    print("正在更新 search.json...")
    scan_and_update_search_json()