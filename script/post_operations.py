#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文章操作相关的函数
包含文章删除、编辑等操作
"""

import re
from pathlib import Path
from typing import List
from cli_utils import get_project_paths, load_search_json, save_search_json, get_all_posts, display_posts, parse_id_input, validate_date_format
from error_handling import handle_error, PostOperationError
from progress_utils import show_progress


# 删除单篇文章
@handle_error
def delete_post():
    project_root, posts_dir, search_json_path = get_project_paths()
    
    print("="*50)
    print("删除文章")
    print("="*50)
    print()
    
    search_data = load_search_json(search_json_path)
    posts = get_all_posts(posts_dir, search_data)
    
    if not posts:
        print("[INFO] 无文章可以删除")
        return
    
    display_posts(posts)
    
    post_id = input("请输入要删除的文章ID (直接回车取消): " ).strip()
    if not post_id:
        print("[INFO] 已取消")
        return
    
    # 查找文章
    target_post = None
    for post in posts:
        if post.id == post_id:
            target_post = post
            break
    
    if not target_post:
        raise PostOperationError(f"未找到ID为 {post_id} 的文章")
    
    print()
    print(f"确定要删除以下文章吗？")
    print(f"  标题: {target_post.title}")
    print(f"  分类: {target_post.category}")
    print(f"  日期: {target_post.date}")
    print(f"  路径: {target_post.file_path}")
    print()
    
    confirm = input("确认删除? (1=确认, 0=取消): " ).strip()
    if confirm != '1':
        print("[INFO] 已取消")
        return
    
    # 删除文件
    target_post.file_path.unlink()
    print(f"[SUCCESS] 已删除文件: {target_post.file_path}")
    
    # 从search.json中移除
    new_search_data = [item for item in search_data if not (item.get('path', '').startswith('./html/posts/') and item.get('id') == post_id)]
    save_search_json(search_json_path, new_search_data)
    
    print("[SUCCESS] 文章删除成功")

# 批量删除文章
@handle_error
def batch_delete_posts():
    project_root, posts_dir, search_json_path = get_project_paths()
    
    print("="*50)
    print("批量删除文章")
    print("="*50)
    print()
    
    search_data = load_search_json(search_json_path)
    posts = get_all_posts(posts_dir, search_data)
    
    if not posts:
        print("[INFO] 无文章可以删除")
        return
    
    display_posts(posts)
    
    post_ids_input = input("请输入要删除的文章ID，用逗号分隔 (例如: 1,3,5 或 [1,3,5]，直接回车取消): " ).strip()
    if not post_ids_input:
        print("[INFO] 已取消")
        return
    
    # 解析输入
    post_ids = parse_id_input(post_ids_input)
    if not post_ids:
        raise PostOperationError("输入格式错误或未输入有效的文章ID")
    
    # 查找文章（使用集合提高查找速度）
    post_id_set = set(post_ids)
    target_posts = [post for post in posts if post.id in post_id_set]
    
    if not target_posts:
        raise PostOperationError("未找到指定的文章")
    
    print()
    print(f"确定要删除以下 {len(target_posts)} 篇文章吗？")
    for post in target_posts:
        print(f"  [{post.id}] {post.title} ({post.category})")
    print()
    
    confirm = input("确认删除? (1=确认, 0=取消): " ).strip()
    if confirm != '1':
        print("[INFO] 已取消")
        return
    
    success_count = 0
    failed_count = 0
    
    # 从search.json中移除
    new_search_data = [item for item in search_data if not (item.get('path', '').startswith('./html/posts/') and item.get('id') in post_ids)]
    
    # 删除文件
    for post in show_progress(target_posts, desc="删除文章"):
        try:
            post.file_path.unlink()
            # 进度条已经显示，不需要额外打印
            success_count += 1
        except Exception as e:
            print(f"[ERROR] 删除文件失败 {post.file_path}: {e}")
            failed_count += 1
    
    # 保存更新后的search.json
    save_search_json(search_json_path, new_search_data)
    
    print()
    print("="*50)
    print("批量删除完成!")
    print(f"  成功: {success_count} 个文件")
    print(f"  失败: {failed_count} 个文件")
    print("="*50)

# 编辑文章元数据
@handle_error
def edit_post_metadata():
    project_root, posts_dir, search_json_path = get_project_paths()
    
    print("="*50)
    print("编辑文章元数据")
    print("="*50)
    print()
    
    search_data = load_search_json(search_json_path)
    posts = get_all_posts(posts_dir, search_data)
    
    if not posts:
        print("[INFO] 无文章可以编辑")
        return
    
    display_posts(posts)
    
    post_id = input("请输入要编辑的文章ID (直接回车取消): " ).strip()
    if not post_id:
        print("[INFO] 已取消")
        return
    
    # 查找文章
    target_post = None
    target_item = None
    for post in posts:
        if post.id == post_id:
            target_post = post
            break
    
    if not target_post:
        raise PostOperationError(f"未找到ID为 {post_id} 的文章")
    
    # 查找search.json中的对应条目
    for item in search_data:
        if item.get('id') == post_id and item.get('path', '').startswith('./html/posts/'):
            target_item = item
            break
    
    if not target_item:
        raise PostOperationError("未在search.json中找到对应条目")
    
    print()
    print(f"当前信息:")
    print(f"  标题: {target_item.get('title', '')}")
    print(f"  分类: {target_item.get('category', '')}")
    print(f"  标签: {', '.join(target_item.get('tags', []))}")
    print(f"  日期: {target_item.get('date', '')}")
    print()
    
    # 编辑信息
    new_title = input(f"新标题 (回车保持不变): " ).strip()
    new_category = input(f"新分类 (回车保持不变): " ).strip()
    new_tags_input = input(f"新标签 (逗号分隔，回车保持不变): " ).strip()
    new_date = input(f"新日期 (YYYY-MM-DD，回车保持不变): " ).strip()
    
    # 更新信息
    if new_title:
        target_item['title'] = new_title
    if new_category:
        target_item['category'] = new_category
    if new_tags_input:
        target_item['tags'] = [tag.strip() for tag in new_tags_input.split(',')]
    if new_date:
        # 验证日期格式
        if validate_date_format(new_date):
            target_item['date'] = new_date
        else:
            print("[ERROR] 日期格式错误，保持原日期")
    
    # 保存更新
    save_search_json(search_json_path, search_data)
    
    print()
    print("[SUCCESS] 文章元数据更新成功")


# 批量编辑文章元数据
@handle_error
def batch_edit_post_metadata():
    project_root, posts_dir, search_json_path = get_project_paths()
    
    print("="*50)
    print("批量编辑文章元数据")
    print("="*50)
    print()
    
    search_data = load_search_json(search_json_path)
    posts = get_all_posts(posts_dir, search_data)
    
    if not posts:
        print("[INFO] 无文章可以编辑")
        return
    
    display_posts(posts)
    
    post_ids_input = input("请输入要编辑的文章ID，用逗号分隔 (例如: 1,3,5 或 [1,3,5]，直接回车取消): " ).strip()
    if not post_ids_input:
        print("[INFO] 已取消")
        return
    
    # 解析输入
    post_ids = parse_id_input(post_ids_input)
    if not post_ids:
        raise PostOperationError("输入格式错误或未输入有效的文章ID")
    
    # 查找文章（使用集合提高查找速度）
    post_id_set = set(post_ids)
    target_posts = []
    target_items = []
    
    # 先构建ID到条目的映射，提高查找速度
    id_to_item = {}
    for item in search_data:
        if item.get('path', '').startswith('./html/posts/'):
            id_to_item[item.get('id')] = item
    
    for post in posts:
        if post.id in post_id_set:
            target_posts.append(post)
            # 从映射中快速查找对应的条目
            if post.id in id_to_item:
                target_items.append(id_to_item[post.id])
    
    if not target_posts:
        raise PostOperationError("未找到指定的文章")
    
    print()
    print(f"已选择 {len(target_posts)} 篇文章：")
    for post in target_posts:
        print(f"  [{post.id}] {post.title} ({post.category})")
    print()
    
    # 编辑信息
    print("请输入要更新的元数据（回车保持不变）：")
    new_title = input("新标题: " ).strip()
    new_category = input("新分类: " ).strip()
    new_tags_input = input("新标签 (逗号分隔): " ).strip()
    new_date = input("新日期 (YYYY-MM-DD): " ).strip()
    
    # 验证日期格式
    if new_date and not validate_date_format(new_date):
        print("[ERROR] 日期格式错误，保持原日期")
        new_date = ""
    
    # 更新信息
    updated_count = 0
    for item in show_progress(target_items, desc="编辑文章元数据"):
        if new_title:
            item['title'] = new_title
        if new_category:
            item['category'] = new_category
        if new_tags_input:
            item['tags'] = [tag.strip() for tag in new_tags_input.split(',')]
        if new_date:
            item['date'] = new_date
        updated_count += 1
    
    # 保存更新
    save_search_json(search_json_path, search_data)
    
    print()
    print("="*50)
    print("批量编辑完成!")
    print(f"  成功更新: {updated_count} 篇文章")
    print("="*50)


# 预览文章内容
@handle_error
def preview_post():
    project_root, posts_dir, search_json_path = get_project_paths()
    
    print("="*50)
    print("预览文章内容")
    print("="*50)
    print()
    
    search_data = load_search_json(search_json_path)
    posts = get_all_posts(posts_dir, search_data)
    
    if not posts:
        print("[INFO] 无文章可以预览")
        return
    
    display_posts(posts)
    
    post_id = input("请输入要预览的文章ID (直接回车取消): " ).strip()
    if not post_id:
        print("[INFO] 已取消")
        return
    
    # 查找文章
    target_post = None
    target_item = None
    for post in posts:
        if post.id == post_id:
            target_post = post
            break
    
    if not target_post:
        raise PostOperationError(f"未找到ID为 {post_id} 的文章")
    
    # 查找search.json中的对应条目
    for item in search_data:
        if item.get('id') == post_id and item.get('path', '').startswith('./html/posts/'):
            target_item = item
            break
    
    if not target_item:
        raise PostOperationError("未在search.json中找到对应条目")
    
    print()
    print("="*60)
    print(f"文章预览: {target_item.get('title', '')}")
    print("="*60)
    print(f"分类: {target_item.get('category', '')}")
    print(f"标签: {', '.join(target_item.get('tags', []))}")
    print(f"日期: {target_item.get('date', '')}")
    print(f"路径: {target_post.file_path}")
    print("-"*60)
    print()
    
    # 读取文章内容
    with open(target_post.file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取正文内容
    # 尝试匹配 post-content 或 text-style 标签
    content_match = re.search(r'<div class="post-content">(.*?)</div>', content, re.DOTALL)
    if not content_match:
        # 如果没有 post-content 标签，尝试匹配 text-style 标签
        content_match = re.search(r'<div class="text-style">(.*?)</div>', content, re.DOTALL)
    
    if content_match:
        post_content = content_match.group(1).strip()
        # 移除HTML标签
        post_content = re.sub(r'<[^>]+>', '', post_content)
        print(post_content)
    else:
        print("[INFO] 未找到文章内容")
    
    print()
    print("="*60)


# 搜索文章
@handle_error
def search_posts():
    project_root, posts_dir, search_json_path = get_project_paths()
    
    print("="*50)
    print("搜索文章")
    print("="*50)
    print()
    
    search_data = load_search_json(search_json_path)
    posts = get_all_posts(posts_dir, search_data)
    
    if not posts:
        print("[INFO] 无文章可以搜索")
        return
    
    print("请选择搜索方式：")
    print("  1. 按标题搜索")
    print("  2. 按分类搜索")
    print("  3. 按标签搜索")
    print("  4. 按日期搜索")
    print()
    
    search_choice = input("请输入选项 (1/2/3/4，直接回车取消): " ).strip()
    if not search_choice:
        print("[INFO] 已取消")
        return
    
    search_term = input("请输入搜索关键词: " ).strip()
    if not search_term:
        print("[INFO] 已取消")
        return
    
    # 执行搜索
    results = []
    
    # 先构建ID到条目的映射，提高查找速度
    id_to_item = {}
    for item in search_data:
        if item.get('path', '').startswith('./html/posts/'):
            id_to_item[item.get('id')] = item
    
    # 搜索逻辑
    for post in posts:
        # 从映射中快速查找对应的条目
        if post.id in id_to_item:
            item = id_to_item[post.id]
            if search_choice == '1':
                # 按标题搜索
                if search_term.lower() in item.get('title', '').lower():
                    results.append((post, item))
            elif search_choice == '2':
                # 按分类搜索
                if search_term.lower() in item.get('category', '').lower():
                    results.append((post, item))
            elif search_choice == '3':
                # 按标签搜索
                tags = item.get('tags', [])
                for tag in tags:
                    if search_term.lower() in tag.lower():
                        results.append((post, item))
                        break
            elif search_choice == '4':
                # 按日期搜索
                if search_term in item.get('date', ''):
                    results.append((post, item))
    
    # 显示搜索结果
    print()
    if results:
        print(f"找到 {len(results)} 个匹配的文章：")
        print("-"*60)
        for i, (post, item) in enumerate(results, 1):
            print(f"  {i}. [{post.id}] {item.get('title', '')} ({item.get('category', '')}) - {item.get('date', '')}")
        print("-"*60)
        
        # 选择查看详情
        view_choice = input("请输入要查看详情的文章编号 (直接回车返回): " ).strip()
        if view_choice:
            try:
                idx = int(view_choice) - 1
                if 0 <= idx < len(results):
                    post, item = results[idx]
                    print()
                    print("="*60)
                    print(f"文章详情: {item.get('title', '')}")
                    print("="*60)
                    print(f"分类: {item.get('category', '')}")
                    print(f"标签: {', '.join(item.get('tags', []))}")
                    print(f"日期: {item.get('date', '')}")
                    print(f"路径: {post.file_path}")
                    print("-"*60)
                    print()
                    
                    # 读取文章内容
                    with open(post.file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # 提取正文内容
                    content_match = re.search(r'<div class="post-content">(.*?)</div>', content, re.DOTALL)
                    if content_match:
                        post_content = content_match.group(1).strip()
                        # 移除HTML标签
                        post_content = re.sub(r'<[^>]+>', '', post_content)
                        print(post_content)
                    else:
                        print("[INFO] 未找到文章内容")
                    
                    print()
                    print("="*60)
                    input("按回车键继续...")
                else:
                    print("[ERROR] 无效的编号")
            except ValueError:
                print("[ERROR] 请输入有效的数字")
    else:
        print("[INFO] 未找到匹配的文章")


# 创建文章
@handle_error
def create_post():
    project_root, posts_dir, search_json_path = get_project_paths()
    
    print("="*50)
    print("创建文章")
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
    
    # 获取用户输入
    title = input("请输入文章标题: " ).strip()
    if not title:
        print("[INFO] 已取消")
        return
    
    category = input("请输入文章分类: " ).strip() or "随笔"
    tags_input = input("请输入文章标签 (逗号分隔): " ).strip()
    tags = [tag.strip() for tag in tags_input.split(',')] if tags_input else []
    date = input("请输入文章日期 (YYYY-MM-DD，回车使用当前日期): " ).strip()
    
    if not date:
        from datetime import datetime
        date = datetime.now().strftime('%Y-%m-%d')
    elif not validate_date_format(date):
        print("[ERROR] 日期格式错误，使用当前日期")
        from datetime import datetime
        date = datetime.now().strftime('%Y-%m-%d')
    
    # 生成文件名
    post_id = str(next_id)
    post_file_name = f"post-{post_id}.html"
    post_file_path = posts_dir / post_file_name
    
    # 生成HTML内容
    tags_html = ''.join([f'<span class="post-tag">{tag}</span>' for tag in tags])
    
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
            <!-- 文章内容 -->
        </div>
    </div>
    <script src="../../js/header-js/music-player.js"></script>
</body>
</html>
    """
    
    # 创建文件
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
    
    print("[SUCCESS] 文章创建成功")