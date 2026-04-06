#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文章标签管理功能
包含文章标签的创建、编辑、删除和管理功能
"""

from common import get_project_paths, load_search_json, save_search_json
from color_utils import print_success, print_error, print_info, print_warning, print_title, print_separator


def get_all_tags():
    """
    获取所有文章标签
    
    Returns:
        标签列表
    """
    project_root, posts_dir, search_json_path = get_project_paths()
    search_data = load_search_json(search_json_path)
    
    tags = set()
    for item in search_data:
        if item.get('path', '').startswith('./html/posts/'):
            item_tags = item.get('tags', [])
            for tag in item_tags:
                tags.add(tag)
    
    return sorted(tags)


def create_tag():
    """
    创建新标签
    """
    print("="*50)
    print("创建标签")
    print("="*50)
    print()
    
    tag_name = input("请输入标签名称: " ).strip()
    if not tag_name:
        print("[INFO] 已取消")
        return
    
    # 检查标签是否已存在
    existing_tags = get_all_tags()
    if tag_name in existing_tags:
        print("[ERROR] 标签已存在")
        return
    
    print()
    print(f"[SUCCESS] 标签 '{tag_name}' 创建成功")


def edit_tag():
    """
    编辑标签
    """
    print("="*50)
    print("编辑标签")
    print("="*50)
    print()
    
    # 获取所有标签
    tags = get_all_tags()
    if not tags:
        print("[INFO] 暂无标签")
        return
    
    # 显示标签列表
    print("现有标签：")
    for i, tag in enumerate(tags, 1):
        print(f"  {i}. {tag}")
    print()
    
    # 选择要编辑的标签
    choice = input("请输入要编辑的标签编号: " ).strip()
    if not choice:
        print("[INFO] 已取消")
        return
    
    try:
        idx = int(choice) - 1
        if 0 <= idx < len(tags):
            old_tag = tags[idx]
        else:
            print("[ERROR] 无效的编号")
            return
    except ValueError:
        print("[ERROR] 请输入有效的数字")
        return
    
    # 输入新标签名称
    new_tag = input(f"请输入新标签名称 (当前: {old_tag}): " ).strip()
    if not new_tag:
        print("[INFO] 已取消")
        return
    
    # 检查新标签是否已存在
    if new_tag in tags:
        print("[ERROR] 标签已存在")
        return
    
    # 更新所有使用该标签的文章
    project_root, posts_dir, search_json_path = get_project_paths()
    search_data = load_search_json(search_json_path)
    
    updated_count = 0
    for item in search_data:
        if item.get('path', '').startswith('./html/posts/'):
            item_tags = item.get('tags', [])
            if old_tag in item_tags:
                item_tags = [new_tag if tag == old_tag else tag for tag in item_tags]
                item['tags'] = item_tags
                updated_count += 1
    
    # 保存更新
    save_search_json(search_json_path, search_data)
    
    print()
    print(f"[SUCCESS] 标签 '{old_tag}' 已更新为 '{new_tag}'")
    print(f"[INFO] 已更新 {updated_count} 篇文章")


def delete_tag():
    """
    删除标签
    """
    print("="*50)
    print("删除标签")
    print("="*50)
    print()
    
    # 获取所有标签
    tags = get_all_tags()
    if not tags:
        print("[INFO] 暂无标签")
        return
    
    # 显示标签列表
    print("现有标签：")
    for i, tag in enumerate(tags, 1):
        print(f"  {i}. {tag}")
    print()
    
    # 选择要删除的标签
    choice = input("请输入要删除的标签编号: " ).strip()
    if not choice:
        print("[INFO] 已取消")
        return
    
    try:
        idx = int(choice) - 1
        if 0 <= idx < len(tags):
            tag_to_delete = tags[idx]
        else:
            print("[ERROR] 无效的编号")
            return
    except ValueError:
        print("[ERROR] 请输入有效的数字")
        return
    
    # 确认删除
    confirm = input(f"确认删除标签 '{tag_to_delete}'? (1=确认, 0=取消): " ).strip()
    if confirm != '1':
        print("[INFO] 已取消")
        return
    
    # 更新所有使用该标签的文章
    project_root, posts_dir, search_json_path = get_project_paths()
    search_data = load_search_json(search_json_path)
    
    updated_count = 0
    for item in search_data:
        if item.get('path', '').startswith('./html/posts/'):
            item_tags = item.get('tags', [])
            if tag_to_delete in item_tags:
                item_tags = [tag for tag in item_tags if tag != tag_to_delete]
                item['tags'] = item_tags
                updated_count += 1
    
    # 保存更新
    save_search_json(search_json_path, search_data)
    
    print()
    print(f"[SUCCESS] 标签 '{tag_to_delete}' 已删除")
    print(f"[INFO] 已从 {updated_count} 篇文章中移除该标签")


def list_tags():
    """
    列出所有标签
    """
    print("="*50)
    print("标签列表")
    print("="*50)
    print()
    
    # 获取所有标签
    tags = get_all_tags()
    if not tags:
        print("[INFO] 暂无标签")
        return
    
    # 统计每个标签的文章数量
    project_root, posts_dir, search_json_path = get_project_paths()
    search_data = load_search_json(search_json_path)
    
    tag_counts = {}
    for item in search_data:
        if item.get('path', '').startswith('./html/posts/'):
            item_tags = item.get('tags', [])
            for tag in item_tags:
                if tag in tag_counts:
                    tag_counts[tag] += 1
                else:
                    tag_counts[tag] = 1
    
    # 显示标签列表
    print("标签名称        文章数量")
    print("-"*20)
    for tag in tags:
        count = tag_counts.get(tag, 0)
        print(f"{tag:<15} {count:>8}")
    print("-"*20)
    print(f"总计: {len(tags)} 个标签")


def manage_tags():
    """
    标签管理主函数
    """
    while True:
        print("="*50)
        print("标签管理")
        print("="*50)
        print()
        print("请选择操作：")
        print("  1. 创建标签")
        print("  2. 编辑标签")
        print("  3. 删除标签")
        print("  4. 查看标签列表")
        print("  0. 返回")
        print()
        
        choice = input("请输入选项 (0/1/2/3/4): " ).strip()
        
        if choice == '0':
            break
        elif choice == '1':
            create_tag()
        elif choice == '2':
            edit_tag()
        elif choice == '3':
            delete_tag()
        elif choice == '4':
            list_tags()
        else:
            print("[ERROR] 无效的选项")
        
        print()
        input("按回车键继续...")
        print()