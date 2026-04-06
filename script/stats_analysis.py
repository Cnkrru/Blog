#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据统计和分析功能
包含文章数据统计和分析功能，包括文章数量、分类分布、标签使用情况等
"""

import json
from collections import Counter
from pathlib import Path
from datetime import datetime

from common import get_project_paths, load_search_json
from color_utils import print_info, print_success, print_error, print_table


def get_posts_stats():
    """
    获取文章统计数据
    
    Returns:
        dict: 文章统计数据
    """
    project_root, posts_dir, search_json_path = get_project_paths()
    search_data = load_search_json(search_json_path)
    
    # 过滤出文章数据
    posts = [item for item in search_data if item.get('path', '').startswith('./html/posts/')]
    
    # 统计文章数量
    total_posts = len(posts)
    
    # 统计分类分布
    categories = [item.get('category', '未分类') for item in posts]
    category_counts = Counter(categories)
    
    # 统计标签使用情况
    tags = []
    for item in posts:
        item_tags = item.get('tags', [])
        tags.extend(item_tags)
    tag_counts = Counter(tags)
    
    # 统计日期分布（按年份和月份）
    date_distribution = Counter()
    for item in posts:
        date = item.get('date', '')
        if date:
            # 提取年份和月份
            year_month = date[:7]  # 格式：YYYY-MM
            date_distribution[year_month] += 1
    
    # 统计文章长度（如果有内容的话）
    avg_content_length = 0
    for item in posts:
        post_path = project_root / item.get('path', '').lstrip('./')
        if post_path.exists():
            try:
                content = post_path.read_text(encoding='utf-8')
                avg_content_length += len(content)
            except Exception as e:
                print_error(f"[ERROR] 读取文章文件失败: {e}")
    if total_posts > 0:
        avg_content_length = avg_content_length / total_posts
    
    return {
        'total_posts': total_posts,
        'category_counts': category_counts,
        'tag_counts': tag_counts,
        'date_distribution': date_distribution,
        'avg_content_length': avg_content_length
    }


def display_posts_stats():
    """
    显示文章统计数据
    """
    print("="*80)
    print("文章数据统计与分析")
    print("="*80)
    print()
    
    try:
        stats = get_posts_stats()
        
        # 显示总文章数
        print_info(f"总文章数: {stats['total_posts']}")
        print()
        
        # 显示分类分布
        print_info("分类分布:")
        if stats['category_counts']:
            category_data = [[cat, count] for cat, count in stats['category_counts'].items()]
            print_table(['分类', '文章数'], category_data)
        else:
            print_info("  暂无分类数据")
        print()
        
        # 显示标签使用情况
        print_info("标签使用情况:")
        if stats['tag_counts']:
            # 按使用次数排序，取前10个
            top_tags = stats['tag_counts'].most_common(10)
            tag_data = [[tag, count] for tag, count in top_tags]
            print_table(['标签', '使用次数'], tag_data)
        else:
            print_info("  暂无标签数据")
        print()
        
        # 显示日期分布
        print_info("日期分布:")
        if stats['date_distribution']:
            # 按日期排序
            sorted_dates = sorted(stats['date_distribution'].items())
            date_data = [[date, count] for date, count in sorted_dates]
            print_table(['日期', '文章数'], date_data)
        else:
            print_info("  暂无日期数据")
        print()
        
        # 显示平均文章长度
        print_info(f"平均文章长度: {stats['avg_content_length']:.2f} 字符")
        print()
        
        # 显示统计摘要
        print_info("统计摘要:")
        print(f"  - 文章总数: {stats['total_posts']}")
        print(f"  - 分类数量: {len(stats['category_counts'])}")
        print(f"  - 标签数量: {len(stats['tag_counts'])}")
        print(f"  - 发布月份数: {len(stats['date_distribution'])}")
        print()
        
        print_success("[SUCCESS] 数据统计完成")
        
    except Exception as e:
        print_error(f"[ERROR] 统计数据失败: {e}")


def export_stats_to_json():
    """
    导出统计数据到JSON文件
    """
    project_root, _, _ = get_project_paths()
    export_file = project_root / "stats_export.json"
    
    try:
        stats = get_posts_stats()
        
        # 转换Counter对象为普通字典
        export_data = {
            'total_posts': stats['total_posts'],
            'category_counts': dict(stats['category_counts']),
            'tag_counts': dict(stats['tag_counts']),
            'date_distribution': dict(stats['date_distribution']),
            'avg_content_length': stats['avg_content_length'],
            'export_date': datetime.now().isoformat()
        }
        
        # 导出到JSON文件
        with open(export_file, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, ensure_ascii=False, indent=2)
        
        print_success(f"[SUCCESS] 统计数据已导出到: {export_file}")
        
    except Exception as e:
        print_error(f"[ERROR] 导出统计数据失败: {e}")


def analyze_posts_trend():
    """
    分析文章发布趋势
    """
    project_root, _, search_json_path = get_project_paths()
    search_data = load_search_json(search_json_path)
    
    # 过滤出文章数据
    posts = [item for item in search_data if item.get('path', '').startswith('./html/posts/')]
    
    # 按日期排序
    posts.sort(key=lambda x: x.get('date', ''))
    
    print("="*80)
    print("文章发布趋势分析")
    print("="*80)
    print()
    
    if not posts:
        print_info("  暂无文章数据")
        return
    
    # 分析月度发布趋势
    monthly_counts = Counter()
    for post in posts:
        date = post.get('date', '')
        if date:
            year_month = date[:7]  # 格式：YYYY-MM
            monthly_counts[year_month] += 1
    
    # 显示月度发布趋势
    print_info("月度发布趋势:")
    sorted_months = sorted(monthly_counts.items())
    month_data = [[month, count] for month, count in sorted_months]
    print_table(['月份', '文章数'], month_data)
    print()
    
    # 分析分类趋势
    print_info("分类发布趋势:")
    category_trends = {}
    for post in posts:
        category = post.get('category', '未分类')
        date = post.get('date', '')
        if date:
            year_month = date[:7]  # 格式：YYYY-MM
            if category not in category_trends:
                category_trends[category] = Counter()
            category_trends[category][year_month] += 1
    
    for category, trends in category_trends.items():
        print_info(f"  {category}:")
        sorted_trends = sorted(trends.items())
        for month, count in sorted_trends:
            print(f"    {month}: {count} 篇")
    print()
    
    print_success("[SUCCESS] 趋势分析完成")


def manage_stats():
    """
    数据统计和分析管理主函数
    """
    while True:
        print("="*50)
        print("数据统计和分析")
        print("="*50)
        print()
        print("请选择操作：")
        print("  1. 查看文章统计数据")
        print("  2. 分析文章发布趋势")
        print("  3. 导出统计数据到JSON")
        print("  0. 返回")
        print()
        
        choice = input("请输入选项 (0/1/2/3): " ).strip()
        
        if choice == '0':
            break
        elif choice == '1':
            display_posts_stats()
        elif choice == '2':
            analyze_posts_trend()
        elif choice == '3':
            export_stats_to_json()
        else:
            print_error("[ERROR] 无效的选项")
        
        print()
        input("按回车键继续...")
        print()