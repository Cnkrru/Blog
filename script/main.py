#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
博客命令行工具主调度脚本
整合所有功能模块，提供统一的用户界面
"""

import sys
from pathlib import Path

# 尝试导入readline库，用于命令历史和自动补全
try:
    import readline
    has_readline = True
    # 设置命令历史文件
    history_file = Path.home() / '.blog_cli_history'
    if history_file.exists():
        readline.read_history_file(str(history_file))
    # 设置历史记录长度
    readline.set_history_length(1000)
    
    # 自动补全函数
    def completer(text, state):
        """命令自动补全函数"""
        options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
        if text:
            options = [option for option in options if option.startswith(text)]
        if state < len(options):
            return options[state]
        else:
            return None
    
    # 设置自动补全函数
    readline.set_completer(completer)
    readline.parse_and_bind('tab: complete')
except ImportError:
    has_readline = False

from cli_utils import print_welcome
from post_management import delete_post, batch_delete_posts, edit_post_metadata, batch_edit_post_metadata, preview_post, search_posts, post_statistics, scan_and_update_search_json, create_post_template, create_post
from content_import_export import export_to_markdown, export_to_html, import_from_markdown, import_from_html, transfer_export_to_import

from site_maintenance import clear_draft_folder, draft_to_post, create_markdown_template, manage_drafts, site_statistics, auto_cleanup
from log_utils import logger, log_function
from config_utils import manage_config
from help_utils import manage_help, parse_command_line_args
from version_utils import manage_version, show_version
from category_management import manage_categories
from tag_management import manage_tags

from file_monitor import initialize_file_monitor, stop_file_monitor, start_file_monitor_thread
from stats_analysis import manage_stats
from color_utils import print_success, print_error, print_info, print_warning, print_title, print_separator


# 处理文章管理菜单
def handle_post_management():
    print()
    print_separator(60)
    print_title("文章管理")
    print_separator(60)
    print()
    print_info("请选择操作：")
    print("  1. 搜索文章")
    print("  2. 预览文章内容")
    print("  3. 编辑文章元数据")
    print("  4. 文章统计")
    print("  5. 批量编辑文章元数据")
    print("  6. 删除文章")
    print("  7. 创建文章")
    print("  8. 扫描文章并更新 search.json")
    print()
    
    sub_choice = input("请输入选项 (1/2/3/4/5/6/7/8，直接回车返回): " ).strip()
    if not sub_choice:
        return
    
    if sub_choice == '1':
        search_posts()
    elif sub_choice == '2':
        preview_post()
    elif sub_choice == '3':
        edit_post_metadata()
    elif sub_choice == '4':
        post_statistics()
    elif sub_choice == '5':
        batch_edit_post_metadata()
    elif sub_choice == '6':
        # 删除文章子菜单
        print()
        print_separator(60)
        print_title("删除文章")
        print_separator(60)
        print_info("请选择删除方式：")
        print("  1. 删除单篇文章")
        print("  2. 批量删除文章")
        print()
        delete_choice = input("请输入选项 (1/2，直接回车返回): " ).strip()
        if not delete_choice:
            return
        if delete_choice == '1':
            delete_post()
        elif delete_choice == '2':
            batch_delete_posts()
        else:
            print_error("[ERROR] 无效的选项")
    elif sub_choice == '7':
        create_post()
    elif sub_choice == '8':
        scan_and_update_search_json()
    else:
        print_error("[ERROR] 无效的选项")

# 处理内容导入导出菜单
def handle_content_import_export():
    print()
    print_separator(60)
    print_title("内容导入导出")
    print_separator(60)
    print()
    print_info("请选择操作：")
    print("  1. 导出文章为Markdown")
    print("  2. 导出文章为HTML")
    print("  3. 从Markdown导入文章")
    print("  4. 从HTML导入文章")
    print("  5. 将export文件夹下的文件转移到import对应文件位置")
    print()
    
    sub_choice = input("请输入选项 (1/2/3/4/5，直接回车返回): " ).strip()
    if not sub_choice:
        return
    
    if sub_choice == '1':
        export_to_markdown()
    elif sub_choice == '2':
        export_to_html()
    elif sub_choice == '3':
        import_from_markdown()
    elif sub_choice == '4':
        import_from_html()
    elif sub_choice == '5':
        transfer_export_to_import()
    else:
        print_error("[ERROR] 无效的选项")

# 处理站点维护菜单
def handle_site_maintenance():
    print()
    print_separator(60)
    print_title("站点维护")
    print_separator(60)
    print()
    print_info("请选择操作：")
    print("  1. 创建Markdown文章模板")
    print("  2. 草稿管理")
    print("  3. 将草稿转化为HTML模板")
    print("  4. 清空草稿文件夹")
    print("  5. 站点统计")
    print("  6. 自动清理")
    print()
    
    sub_choice = input("请输入选项 (1/2/3/4/5/6，直接回车返回): " ).strip()
    if not sub_choice:
        return
    
    if sub_choice == '1':
        create_markdown_template()
    elif sub_choice == '2':
        manage_drafts()
    elif sub_choice == '3':
        draft_to_post()
    elif sub_choice == '4':
        clear_draft_folder()
    elif sub_choice == '5':
        site_statistics()
    elif sub_choice == '6':
        auto_cleanup()
    else:
        print_error("[ERROR] 无效的选项")


# 处理日志管理菜单
def handle_log_management():
    from log_utils import logger
    print()
    print_separator(60)
    print_title("日志管理")
    print_separator(60)
    print()
    print_info("请选择操作：")
    print("  1. 查看日志")
    print("  2. 清理过期日志")
    print()
    
    sub_choice = input("请输入选项 (1/2，直接回车返回): " ).strip()
    if not sub_choice:
        return
    
    if sub_choice == '1':
        logger.view_logs()
    elif sub_choice == '2':
        logger.clean_logs()
    else:
        print_error("[ERROR] 无效的选项")

# 主函数
def main():
    # 启动文件系统监控
    try:
        start_file_monitor_thread()
    except Exception as e:
        print_error(f"[ERROR] 启动文件系统监控失败: {e}")
    
    # 解析命令行参数
    if len(sys.argv) > 1:
        if parse_command_line_args(sys.argv[1:]):
            stop_file_monitor()
            # 保存命令历史
            if has_readline:
                history_file = Path.home() / '.blog_cli_history'
                readline.write_history_file(str(history_file))
            return
    
    print_welcome()
    
    while True:
        print_info("请选择操作模式：")
        print("  1. 文章管理")
        print("  2. 站点维护")
        print("  3. 内容导入导出")
        print("  4. 分类管理")
        print("  5. 标签管理")
        print("  6. 数据统计和分析")
        print("  7. 配置管理")
        print("  8. 日志管理")
        print("  9. 帮助中心")
        print("  10. 版本管理")
        print()
        
        choice = input("请输入选项 (1/2/3/4/5/6/7/8/9/10，直接回车退出): " ).strip()
        if not choice:
            print_info("[INFO] 已退出")
            stop_file_monitor()
            # 保存命令历史
            if has_readline:
                history_file = Path.home() / '.blog_cli_history'
                readline.write_history_file(str(history_file))
            return
        
        if choice == '1':
            handle_post_management()
        elif choice == '2':
            handle_site_maintenance()
        elif choice == '3':
            handle_content_import_export()
        elif choice == '4':
            manage_categories()
        elif choice == '5':
            manage_tags()
        elif choice == '6':
            manage_stats()
        elif choice == '7':
            manage_config()
        elif choice == '8':
            handle_log_management()
        elif choice == '9':
            manage_help()
        elif choice == '10':
            manage_version()
        else:
            print_error("[ERROR] 无效的选项，请输入 1、2、3、4、5、6、7、8、9 或 10")


if __name__ == "__main__":
    main()