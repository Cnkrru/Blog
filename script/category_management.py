#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文章分类管理功能
包含文章分类的创建、编辑、删除和管理功能
"""

from common import get_project_paths, load_search_json, save_search_json
from color_utils import print_success, print_error, print_info, print_warning, print_title, print_separator


def get_all_categories():
    """
    获取所有文章分类
    
    Returns:
        分类列表
    """
    project_root, posts_dir, search_json_path = get_project_paths()
    search_data = load_search_json(search_json_path)
    
    categories = set()
    for item in search_data:
        if item.get('path', '').startswith('./html/posts/'):
            category = item.get('category', '未分类')
            categories.add(category)
    
    return sorted(categories)


def create_category():
    """
    创建新分类
    """
    print("="*50)
    print("创建分类")
    print("="*50)
    print()
    
    category_name = input("请输入分类名称: " ).strip()
    if not category_name:
        print("[INFO] 已取消")
        return
    
    # 检查分类是否已存在
    existing_categories = get_all_categories()
    if category_name in existing_categories:
        print("[ERROR] 分类已存在")
        return
    
    print()
    print(f"[SUCCESS] 分类 '{category_name}' 创建成功")


def edit_category():
    """
    编辑分类
    """
    print("="*50)
    print("编辑分类")
    print("="*50)
    print()
    
    # 获取所有分类
    categories = get_all_categories()
    if not categories:
        print("[INFO] 暂无分类")
        return
    
    # 显示分类列表
    print("现有分类：")
    for i, category in enumerate(categories, 1):
        print(f"  {i}. {category}")
    print()
    
    # 选择要编辑的分类
    choice = input("请输入要编辑的分类编号: " ).strip()
    if not choice:
        print("[INFO] 已取消")
        return
    
    try:
        idx = int(choice) - 1
        if 0 <= idx < len(categories):
            old_category = categories[idx]
        else:
            print("[ERROR] 无效的编号")
            return
    except ValueError:
        print("[ERROR] 请输入有效的数字")
        return
    
    # 输入新分类名称
    new_category = input(f"请输入新分类名称 (当前: {old_category}): " ).strip()
    if not new_category:
        print("[INFO] 已取消")
        return
    
    # 检查新分类是否已存在
    if new_category in categories:
        print("[ERROR] 分类已存在")
        return
    
    # 更新所有使用该分类的文章
    project_root, posts_dir, search_json_path = get_project_paths()
    search_data = load_search_json(search_json_path)
    
    updated_count = 0
    for item in search_data:
        if item.get('path', '').startswith('./html/posts/') and item.get('category') == old_category:
            item['category'] = new_category
            updated_count += 1
    
    # 保存更新
    save_search_json(search_json_path, search_data)
    
    print()
    print(f"[SUCCESS] 分类 '{old_category}' 已更新为 '{new_category}'")
    print(f"[INFO] 已更新 {updated_count} 篇文章")


def delete_category():
    """
    删除分类
    """
    print("="*50)
    print("删除分类")
    print("="*50)
    print()
    
    # 获取所有分类
    categories = get_all_categories()
    if not categories:
        print("[INFO] 暂无分类")
        return
    
    # 显示分类列表
    print("现有分类：")
    for i, category in enumerate(categories, 1):
        print(f"  {i}. {category}")
    print()
    
    # 选择要删除的分类
    choice = input("请输入要删除的分类编号: " ).strip()
    if not choice:
        print("[INFO] 已取消")
        return
    
    try:
        idx = int(choice) - 1
        if 0 <= idx < len(categories):
            category_to_delete = categories[idx]
        else:
            print("[ERROR] 无效的编号")
            return
    except ValueError:
        print("[ERROR] 请输入有效的数字")
        return
    
    # 确认删除
    confirm = input(f"确认删除分类 '{category_to_delete}'? (1=确认, 0=取消): " ).strip()
    if confirm != '1':
        print("[INFO] 已取消")
        return
    
    # 更新所有使用该分类的文章
    project_root, posts_dir, search_json_path = get_project_paths()
    search_data = load_search_json(search_json_path)
    
    updated_count = 0
    for item in search_data:
        if item.get('path', '').startswith('./html/posts/') and item.get('category') == category_to_delete:
            item['category'] = "未分类"
            updated_count += 1
    
    # 保存更新
    save_search_json(search_json_path, search_data)
    
    print()
    print(f"[SUCCESS] 分类 '{category_to_delete}' 已删除")
    print(f"[INFO] 已将 {updated_count} 篇文章的分类设为 '未分类'")


def list_categories():
    """
    列出所有分类
    """
    print("="*50)
    print("分类列表")
    print("="*50)
    print()
    
    # 获取所有分类
    categories = get_all_categories()
    if not categories:
        print("[INFO] 暂无分类")
        return
    
    # 统计每个分类的文章数量
    project_root, posts_dir, search_json_path = get_project_paths()
    search_data = load_search_json(search_json_path)
    
    category_counts = {}
    for item in search_data:
        if item.get('path', '').startswith('./html/posts/'):
            category = item.get('category', '未分类')
            if category in category_counts:
                category_counts[category] += 1
            else:
                category_counts[category] = 1
    
    # 显示分类列表
    print("分类名称        文章数量")
    print("-"*20)
    for category in categories:
        count = category_counts.get(category, 0)
        print(f"{category:<15} {count:>8}")
    print("-"*20)
    print(f"总计: {len(categories)} 个分类")


def manage_categories():
    """
    分类管理主函数
    """
    while True:
        print("="*50)
        print("分类管理")
        print("="*50)
        print()
        print("请选择操作：")
        print("  1. 创建分类")
        print("  2. 编辑分类")
        print("  3. 删除分类")
        print("  4. 查看分类列表")
        print("  0. 返回")
        print()
        
        choice = input("请输入选项 (0/1/2/3/4): " ).strip()
        
        if choice == '0':
            break
        elif choice == '1':
            create_category()
        elif choice == '2':
            edit_category()
        elif choice == '3':
            delete_category()
        elif choice == '4':
            list_categories()
        else:
            print("[ERROR] 无效的选项")
        
        print()
        input("按回车键继续...")
        print()