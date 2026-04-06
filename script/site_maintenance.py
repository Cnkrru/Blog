#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
站点维护功能
包含站点维护相关的功能，如清空草稿文件夹等
"""

import shutil
from pathlib import Path
from cli_utils import get_project_paths, load_search_json
from error_handling import handle_error


# 清空草稿文件夹
@handle_error
def clear_draft_folder():
    from path_utils import get_drafts_path
    draft_dir = get_drafts_path()
    
    print("="*50)
    print("清空草稿文件夹")
    print("="*50)
    print()
    
    # 检查草稿文件夹
    if not draft_dir.exists():
        print("[INFO] 草稿文件夹不存在")
        return
    
    # 查找草稿文件
    draft_files = list(draft_dir.iterdir())
    file_count = len(draft_files)
    
    if file_count == 0:
        print("[INFO] 草稿文件夹为空")
        return
    
    print(f"草稿文件夹中有 {file_count} 个文件")
    print()
    
    # 显示文件列表
    for i, file in enumerate(draft_files, 1):
        print(f"  {i}. {file.name}")
    print()
    
    confirm = input("确认清空? (1=确认, 0=取消): " ).strip()
    if confirm != '1':
        print("[INFO] 已取消")
        return
    
    # 清空文件夹
    for file in draft_files:
        if file.is_file():
            file.unlink()
        elif file.is_dir():
            shutil.rmtree(file)
    print("[SUCCESS] 草稿文件夹已清空")


# 将草稿转化为HTML模板并导入post文件夹
@handle_error
def draft_to_post():
    from path_utils import get_drafts_path, get_template_path
    from cli_utils import save_search_json
    project_root, posts_dir, search_json_path = get_project_paths()
    draft_dir = get_drafts_path()
    template_path = get_template_path()
    
    print("="*50)
    print("将草稿转化为HTML模板")
    print("="*50)
    print()
    
    # 检查草稿文件夹
    if not draft_dir.exists():
        print("[INFO] 草稿文件夹不存在")
        return
    
    # 检查模板文件
    if not template_path.exists():
        raise Exception(f"模板文件不存在: {template_path}")
    
    # 查找草稿文件
    draft_files = list(draft_dir.glob('*.md'))
    if not draft_files:
        print("[INFO] 草稿文件夹中没有Markdown文件")
        return
    
    print(f"发现 {len(draft_files)} 个Markdown草稿文件")
    print()
    
    # 显示草稿文件列表
    for i, draft_file in enumerate(draft_files, 1):
        print(f"  {i}. {draft_file.name}")
    print()
    
    # 选择要转化的文件
    choice = input("请选择要转化的文件编号 (直接回车取消): " ).strip()
    if not choice:
        print("[INFO] 已取消")
        return
    
    try:
        idx = int(choice) - 1
        if 0 <= idx < len(draft_files):
            selected_file = draft_files[idx]
        else:
            raise Exception("无效的编号")
    except ValueError:
        raise Exception("请输入有效的数字")
    
    print()
    print(f"选择文件: {selected_file.name}")
    print()
    
    # 读取模板文件
    with open(template_path, 'r', encoding='utf-8') as f:
        html_template = f.read()
    
    # 读取Markdown文件内容
    with open(selected_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # 提取标题（从文件名或内容）
    title = selected_file.stem.replace('_', ' ')
    
    # 提取YAML Front Matter
    import re
    front_matter_match = re.match(r'^---\n(.*?)\n---\n', md_content, re.DOTALL)
    
    category = "未分类"
    tags = []
    date = ""
    
    if front_matter_match:
        front_matter = front_matter_match.group(1)
        for line in front_matter.split('\n'):
            line = line.strip()
            if line.startswith('title:'):
                title = line[6:].strip()
            elif line.startswith('category:'):
                category = line[9:].strip()
            elif line.startswith('tags:'):
                tags_str = line[5:].strip()
                tags = [tag.strip() for tag in tags_str.split(',')]
            elif line.startswith('date:'):
                date = line[5:].strip()
    
    # 如果没有日期，使用当前日期
    if not date:
        from datetime import datetime
        date = datetime.now().strftime('%Y-%m-%d')
    
    # 加载现有数据
    search_data = load_search_json(search_json_path)
    
    # 获取现有最大ID
    existing_ids = [int(item.get('id', '0')) for item in search_data if item.get('path', '').startswith('./html/posts/')]
    next_id = max(existing_ids) + 1 if existing_ids else 0
    
    # 生成文件名
    post_id = str(next_id)
    post_file_name = f"post-{post_id}.html"
    post_file_path = posts_dir / post_file_name
    
    # 替换模板变量
    html_content = html_template.replace('{title}', title)
    html_content = html_content.replace('{description}', title)
    html_content = html_content.replace('{tags}', ''.join([f'<span class="post-tag">{tag}</span>' for tag in tags]))
    html_content = html_content.replace('{date_str}', date)
    html_content = html_content.replace('{category}', category)
    
    # 创建文章文件
    with open(post_file_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"[SUCCESS] 创建文章文件: {post_file_path}")
    
    # 添加到search.json
    new_item = {
        'id': post_id,
        'title': title,
        'category': category,
        'tags': tags,
        'path': f'./html/posts/{post_file_name}',
        'date': date
    }
    search_data.append(new_item)
    save_search_json(search_json_path, search_data)
    
    print("[SUCCESS] 文章导入成功")
    print("[INFO] 已更新 search.json")


# 在草稿文件夹创建Markdown文章模板
@handle_error
def create_markdown_template():
    from path_utils import get_drafts_path
    draft_dir = get_drafts_path()
    
    print("="*50)
    print("创建Markdown文章模板")
    print("="*50)
    print()
    
    # 生成文件名
    from datetime import datetime
    date_str = datetime.now().strftime('%Y-%m-%d')
    base_name = f"{date_str}_new_post"
    counter = 1
    
    while True:
        if counter == 1:
            file_name = f"{base_name}.md"
        else:
            file_name = f"{base_name}_{counter}.md"
        
        file_path = draft_dir / file_name
        if not file_path.exists():
            break
        counter += 1
    
    # 生成Markdown内容
    md_content = f"""---
title: 新文章 {date_str}
category: 未分类
tags: 
date: {date_str}
---

# 新文章

## 副标题

内容...
"""
    
    # 创建文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
    print(f"[SUCCESS] 创建Markdown模板: {file_path}")
    print("[INFO] 模板已保存到草稿文件夹")


# 管理草稿文件
@handle_error
def manage_drafts():
    from path_utils import get_drafts_path
    draft_dir = get_drafts_path()
    
    print("="*50)
    print("草稿管理")
    print("="*50)
    print()
    
    # 检查草稿文件夹
    if not draft_dir.exists():
        print("[INFO] 草稿文件夹不存在")
        return
    
    # 查找草稿文件
    draft_files = list(draft_dir.glob('*.md'))
    if not draft_files:
        print("[INFO] 草稿文件夹中没有Markdown文件")
        return
    
    print(f"发现 {len(draft_files)} 个Markdown草稿文件")
    print()
    
    # 显示草稿文件列表
    for i, draft_file in enumerate(draft_files, 1):
        print(f"  {i}. {draft_file.name}")
    print()
    
    print("请选择操作：")
    print("  1. 重命名草稿")
    print("  2. 删除草稿")
    print("  3. 预览草稿")
    print("  4. 发布草稿")
    print("  0. 返回")
    print()
    
    choice = input("请输入选项 (0/1/2/3/4): " ).strip()
    
    if choice == '0':
        return
    elif choice == '1':
        # 重命名草稿
        rename_choice = input("请输入要重命名的草稿编号: " ).strip()
        try:
            idx = int(rename_choice) - 1
            if 0 <= idx < len(draft_files):
                selected_file = draft_files[idx]
                new_name = input(f"请输入新文件名 (当前: {selected_file.name}): " ).strip()
                if new_name:
                    if not new_name.endswith('.md'):
                        new_name += '.md'
                    new_path = draft_dir / new_name
                    if new_path.exists():
                        raise Exception("文件名已存在")
                    else:
                        selected_file.rename(new_path)
                        print(f"[SUCCESS] 已重命名为: {new_name}")
                else:
                    print("[INFO] 已取消")
            else:
                raise Exception("无效的编号")
        except ValueError:
            raise Exception("请输入有效的数字")
    elif choice == '2':
        # 删除草稿
        delete_choice = input("请输入要删除的草稿编号: " ).strip()
        try:
            idx = int(delete_choice) - 1
            if 0 <= idx < len(draft_files):
                selected_file = draft_files[idx]
                confirm = input(f"确认删除 {selected_file.name}? (1=确认, 0=取消): " ).strip()
                if confirm == '1':
                    selected_file.unlink()
                    print("[SUCCESS] 草稿已删除")
                else:
                    print("[INFO] 已取消")
            else:
                raise Exception("无效的编号")
        except ValueError:
            raise Exception("请输入有效的数字")
    elif choice == '3':
        # 预览草稿
        preview_choice = input("请输入要预览的草稿编号: " ).strip()
        try:
            idx = int(preview_choice) - 1
            if 0 <= idx < len(draft_files):
                selected_file = draft_files[idx]
                print()
                print("="*60)
                print(f"草稿预览: {selected_file.name}")
                print("="*60)
                print()
                
                # 读取草稿内容
                with open(selected_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 解析YAML Front Matter
                import re
                front_matter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
                
                if front_matter_match:
                    front_matter = front_matter_match.group(1)
                    body_content = content[front_matter_match.end():].strip()
                    
                    # 显示Front Matter
                    print("=== 文章信息 ===")
                    print(front_matter)
                    print("\n=== 文章内容 ===")
                    print(body_content)
                else:
                    print(content)
                
                print()
                print("="*60)
                input("按回车键继续...")
            else:
                raise Exception("无效的编号")
        except ValueError:
            raise Exception("请输入有效的数字")
    elif choice == '4':
        # 发布草稿
        publish_choice = input("请输入要发布的草稿编号: " ).strip()
        try:
            idx = int(publish_choice) - 1
            if 0 <= idx < len(draft_files):
                selected_file = draft_files[idx]
                publish_draft(selected_file)
            else:
                raise Exception("无效的编号")
        except ValueError:
            raise Exception("请输入有效的数字")
    else:
        raise Exception("无效的选项")


# 发布草稿为正式文章
@handle_error
def publish_draft(draft_file):
    """
    发布草稿为正式文章
    
    Args:
        draft_file: 草稿文件路径
    """
    from path_utils import get_template_path
    from cli_utils import save_search_json
    project_root, posts_dir, search_json_path = get_project_paths()
    template_path = get_template_path()
    
    print()
    print("="*50)
    print("发布草稿")
    print("="*50)
    print()
    
    print(f"正在发布草稿: {draft_file.name}")
    print()
    
    # 检查模板文件
    if not template_path.exists():
        raise Exception(f"模板文件不存在: {template_path}")
    
    # 读取模板文件
    with open(template_path, 'r', encoding='utf-8') as f:
        html_template = f.read()
    
    # 读取Markdown文件内容
    with open(draft_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # 提取标题（从文件名或内容）
    title = draft_file.stem.replace('_', ' ')
    
    # 提取YAML Front Matter
    import re
    front_matter_match = re.match(r'^---\n(.*?)\n---\n', md_content, re.DOTALL)
    
    category = "未分类"
    tags = []
    date = ""
    
    if front_matter_match:
        front_matter = front_matter_match.group(1)
        for line in front_matter.split('\n'):
            line = line.strip()
            if line.startswith('title:'):
                title = line[6:].strip()
            elif line.startswith('category:'):
                category = line[9:].strip()
            elif line.startswith('tags:'):
                tags_str = line[5:].strip()
                tags = [tag.strip() for tag in tags_str.split(',')]
            elif line.startswith('date:'):
                date = line[5:].strip()
    
    # 如果没有日期，使用当前日期
    if not date:
        from datetime import datetime
        date = datetime.now().strftime('%Y-%m-%d')
    
    # 加载现有数据
    search_data = load_search_json(search_json_path)
    
    # 获取现有最大ID
    existing_ids = [int(item.get('id', '0')) for item in search_data if item.get('path', '').startswith('./html/posts/')]
    next_id = max(existing_ids) + 1 if existing_ids else 0
    
    # 生成文件名
    post_id = str(next_id)
    post_file_name = f"post-{post_id}.html"
    post_file_path = posts_dir / post_file_name
    
    # 替换模板变量
    html_content = html_template.replace('{title}', title)
    html_content = html_content.replace('{description}', title)
    html_content = html_content.replace('{tags}', ''.join([f'<span class="post-tag">{tag}</span>' for tag in tags]))
    html_content = html_content.replace('{date_str}', date)
    html_content = html_content.replace('{category}', category)
    
    # 创建文章文件
    with open(post_file_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"[SUCCESS] 创建文章文件: {post_file_path}")
    
    # 添加到search.json
    new_item = {
        'id': post_id,
        'title': title,
        'category': category,
        'tags': tags,
        'path': f'./html/posts/{post_file_name}',
        'date': date
    }
    search_data.append(new_item)
    save_search_json(search_json_path, search_data)
    
    print("[SUCCESS] 文章发布成功")
    print("[INFO] 已更新 search.json")


# 站点统计功能
@handle_error
def site_statistics():
    """
    显示站点统计信息
    """
    from path_utils import get_drafts_path
    project_root, posts_dir, search_json_path = get_project_paths()
    draft_dir = get_drafts_path()
    
    print("="*50)
    print("站点统计")
    print("="*50)
    print()
    
    # 加载search.json数据
    search_data = load_search_json(search_json_path)
    
    # 统计文章数量
    total_posts = len([item for item in search_data if item.get('path', '').startswith('./html/posts/')])
    
    # 统计分类数量
    categories = set()
    for item in search_data:
        if item.get('path', '').startswith('./html/posts/'):
            categories.add(item.get('category', '未分类'))
    total_categories = len(categories)
    
    # 统计标签数量
    tags = set()
    for item in search_data:
        if item.get('path', '').startswith('./html/posts/'):
            item_tags = item.get('tags', [])
            for tag in item_tags:
                tags.add(tag)
    total_tags = len(tags)
    
    # 统计草稿数量
    draft_files = list(draft_dir.glob('*.md')) if draft_dir.exists() else []
    total_drafts = len(draft_files)
    
    # 显示统计信息
    print(f"文章数量: {total_posts}")
    print(f"分类数量: {total_categories}")
    print(f"标签数量: {total_tags}")
    print(f"草稿数量: {total_drafts}")
    print()
    
    # 显示分类文章数量
    print("=== 分类文章数量 ===")
    category_counts = {}
    for item in search_data:
        if item.get('path', '').startswith('./html/posts/'):
            category = item.get('category', '未分类')
            category_counts[category] = category_counts.get(category, 0) + 1
    
    for category, count in category_counts.items():
        print(f"  {category}: {count} 篇")
    print()
    
    # 显示最新文章
    print("=== 最新文章 ===")
    post_items = [item for item in search_data if item.get('path', '').startswith('./html/posts/')]
    post_items.sort(key=lambda x: x.get('date', ''), reverse=True)
    
    for i, item in enumerate(post_items[:5], 1):
        print(f"  {i}. {item.get('title', '无标题')} ({item.get('date', '无日期')})")
    print()
    
    input("按回车键继续...")


# 自动清理功能
@handle_error
def auto_cleanup():
    """
    自动清理功能，清理临时文件和过期数据
    """
    import os
    from datetime import datetime, timedelta
    from path_utils import get_drafts_path
    project_root, posts_dir, search_json_path = get_project_paths()
    draft_dir = get_drafts_path()
    
    print("="*50)
    print("自动清理")
    print("="*50)
    print()
    
    cleanup_count = 0
    
    # 清理过期的临时文件
    print("正在清理临时文件...")
    temp_dir = project_root / 'temp'
    if temp_dir.exists():
        for file in temp_dir.iterdir():
            if file.is_file():
                # 检查文件修改时间
                mtime = datetime.fromtimestamp(file.stat().st_mtime)
                if datetime.now() - mtime > timedelta(days=7):
                    file.unlink()
                    cleanup_count += 1
                    print(f"  已清理: {file.name}")
    
    # 清理空目录
    print("\n正在清理空目录...")
    for root, dirs, files in os.walk(project_root, topdown=False):
        for dir in dirs:
            dir_path = os.path.join(root, dir)
            if not os.listdir(dir_path):
                os.rmdir(dir_path)
                cleanup_count += 1
                print(f"  已清理空目录: {dir_path}")
    
    if cleanup_count == 0:
        print("\n[INFO] 没有需要清理的文件")
    else:
        print(f"\n[SUCCESS] 共清理了 {cleanup_count} 个文件/目录")
    print()
    input("按回车键继续...")