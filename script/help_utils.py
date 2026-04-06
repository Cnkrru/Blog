#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
帮助系统相关的函数
包含帮助文档的显示和管理功能
"""

from config_utils import load_config


# 主帮助信息
def show_main_help():
    """显示主帮助信息"""
    print("="*80)
    print("博客命令行工具 - 帮助文档")
    print("="*80)
    print()
    print("命令行参数:")
    print("  -h, --help        显示此帮助信息")
    print("  --version         显示版本信息")
    print("  --config          打开配置管理")
    print("  --posts           打开文章管理")
    print("  --site            打开站点维护")
    print("  --import-export   打开内容导入导出")
    print("  --categories      打开分类管理")
    print("  --tags            打开标签管理")
    print("  --logs            打开日志管理")
    print("  --media           打开媒体配置更新")
    print("  --stats           打开数据统计和分析")
    print()
    print("主菜单选项:")
    print("  1. 文章管理    - 管理博客文章，包括创建、删除、编辑、预览等")
    print("  2. 站点维护    - 维护站点，包括草稿管理、站点统计、自动清理")
    print("  3. 内容导入导出 - 导入导出文章为 Markdown、HTML 格式")
    print("  4. 分类管理    - 管理文章分类")
    print("  5. 标签管理    - 管理文章标签")
    print("  6. 数据统计和分析 - 分析文章数据，生成统计报告")
    print("  7. 配置管理    - 管理工具配置，包括导入导出和验证")
    print("  8. 媒体配置更新 - 更新音乐和视频配置")
    print("  9. 日志管理    - 查看和清理日志")
    print("  10. 帮助中心   - 查看帮助文档")
    print("  11. 版本管理   - 查看版本信息")
    print()
    print("使用说明:")
    print("  1. 输入对应数字选择功能")
    print("  2. 直接回车返回上一级菜单")
    print("  3. 在主菜单直接回车退出工具")
    print()
    print("版本信息:")
    config = load_config()
    version = config.get("app", {}).get("version", "1.0.0")
    print(f"  当前版本: {version}")
    print()
    print("="*80)


# 文章管理帮助
def show_post_help():
    """显示文章管理帮助"""
    print("="*60)
    print("文章管理 - 帮助")
    print("="*60)
    print()
    print("功能说明:")
    print("  1. 创建文章    - 创建新的博客文章")
    print("  2. 删除文章    - 删除单篇或批量删除文章")
    print("  3. 编辑文章元数据 - 编辑单篇文章的标题、分类、标签、日期")
    print("  4. 批量编辑文章元数据 - 批量编辑多篇文章的元数据")
    print("  5. 预览文章    - 查看文章内容")
    print("  6. 搜索文章    - 按标题、分类、标签、日期搜索文章")
    print("  7. 文章统计    - 显示文章数量、分类统计等信息")
    print("  8. 扫描文章并更新 search.json - 扫描文章目录，更新 search.json 文件")
    print()
    print("使用提示:")
    print("  - 创建文章时会自动生成HTML文件并更新search.json")
    print("  - 删除文章时会从文件系统和 search.json 中移除")
    print("  - 编辑元数据只修改 search.json 中的信息")
    print("  - 批量操作支持逗号分隔的ID列表或 [1,2,3] 格式")
    print("  - 搜索时支持按标题、分类、标签、日期进行搜索")
    print()
    print("="*60)


# 内容导入导出帮助
def show_import_export_help():
    """显示内容导入导出帮助"""
    print("="*60)
    print("内容导入导出 - 帮助")
    print("="*60)
    print()
    print("功能说明:")
    print("  1. 导出文章为 Markdown - 将文章导出为 Markdown 格式")
    print("  2. 导出文章为 HTML    - 将文章导出为 HTML 格式")
    print("  3. 从 Markdown 导入文章 - 从 Markdown 文件导入文章")
    print("  4. 从 HTML 导入文章    - 从 HTML 文件导入文章")
    print("  5. 转移文件 - 将 export 文件夹下的文件转移到 import 对应位置")
    print()
    print("使用提示:")
    print("  - 导出文件保存在 import_export/export 目录下")
    print("  - 导入文件从 import_export/import 目录读取")
    print("  - 导入时会自动生成文章ID和HTML文件")
    print("  - Markdown导入支持YAML Front Matter格式")
    print()
    print("="*60)





# 站点维护帮助
def show_site_maintenance_help():
    """显示站点维护帮助"""
    print("="*60)
    print("站点维护 - 帮助")
    print("="*60)
    print()
    print("功能说明:")
    print("  1. 创建Markdown文章模板 - 在 drafts 目录创建 Markdown 模板")
    print("  2. 草稿管理 - 管理草稿文件，包括重命名、删除、预览、发布等")
    print("  3. 将草稿转化为HTML模板 - 将 Markdown 草稿转化为 HTML 文章")
    print("  4. 清空草稿文件夹 - 清空 drafts 目录下的文件")
    print("  5. 站点统计 - 显示站点统计信息，包括文章数量、分类分布、最新文章等")
    print("  6. 自动清理 - 清理临时文件和空目录")
    print()
    print("使用提示:")
    print("  - 草稿目录: drafts/")
    print("  - 转化草稿时会自动提取标题、分类、标签等信息")
    print("  - 生成的 HTML 文件会保存到 html/posts/ 目录")
    print("  - 站点统计会显示详细的站点数据")
    print("  - 自动清理会清理7天前的临时文件和空目录")
    print()
    print("="*60)


# 日志管理帮助
def show_log_help():
    """显示日志管理帮助"""
    print("="*60)
    print("日志管理 - 帮助")
    print("="*60)
    print()
    print("功能说明:")
    print("  1. 查看日志 - 查看最近的日志记录")
    print("  2. 清理过期日志 - 删除过期的日志文件")
    print()
    print("使用提示:")
    print("  - 日志目录: logs/")
    print("  - 日志文件按日期命名")
    print("  - 默认保留最近7天的日志")
    print()
    print("="*60)


# 配置管理帮助
def show_config_help():
    """显示配置管理帮助"""
    print("="*60)
    print("配置管理 - 帮助")
    print("="*60)
    print()
    print("功能说明:")
    print("  1. 查看当前配置 - 显示所有配置项")
    print("  2. 编辑配置 - 修改配置项的值")
    print("  3. 重置配置为默认值 - 将配置恢复到初始状态")
    print("  4. 导入配置 - 从文件导入配置")
    print("  5. 导出配置 - 将配置导出到文件")
    print("  6. 验证配置 - 验证配置的有效性")
    print()
    print("使用提示:")
    print("  - 配置文件: config.json")
    print("  - 编辑配置时使用 key=value 格式")
    print("  - 布尔值可以使用 true/false、yes/no 或 1/0")
    print("  - 导入配置时会从当前目录选择JSON文件")
    print("  - 导出配置时会生成带时间戳的配置文件")
    print()
    print("="*60)


# 备份管理帮助



# 命令行参数帮助
def parse_command_line_args(args):
    """解析命令行参数"""
    for arg in args:
        if arg in ('-h', '--help'):
            show_main_help()
            return True
        elif arg == '--version':
            config = load_config()
            version = config.get("app", {}).get("version", "1.0.0")
            print(f"博客命令行工具 v{version}")
            return True

        elif arg == '--config':
            from config_utils import manage_config
            manage_config()
            return True
        elif arg == '--posts':
            from post_management import scan_and_update_search_json
            from main import handle_post_management
            # 先扫描更新search.json
            scan_and_update_search_json()
            # 进入文章管理
            handle_post_management()
            return True
        elif arg == '--site':
            from main import handle_site_maintenance
            handle_site_maintenance()
            return True
        elif arg == '--import-export':
            from main import handle_content_import_export
            handle_content_import_export()
            return True
        elif arg == '--categories':
            from category_management import manage_categories
            manage_categories()
            return True
        elif arg == '--tags':
            from tag_management import manage_tags
            manage_tags()
            return True
        elif arg == '--logs':
            from main import handle_log_management
            handle_log_management()
            return True

        elif arg == '--stats':
            from stats_analysis import manage_stats
            manage_stats()
            return True
    return False


# 帮助管理主函数
def manage_help():
    """帮助管理主函数"""
    while True:
        print("="*50)
        print("帮助中心")
        print("="*50)
        print()
        print("请选择帮助主题：")
        print("  1. 主菜单帮助")
        print("  2. 文章管理帮助")
        print("  3. 内容导入导出帮助")
        print("  4. 站点维护帮助")
        print("  5. 日志管理帮助")
        print("  6. 配置管理帮助")
        print("  0. 返回")
        print()
        
        choice = input("请输入选项 (0/1/2/3/4/5/6): " ).strip()
        
        if choice == '0':
            break
        elif choice == '1':
            show_main_help()
        elif choice == '2':
            show_post_help()
        elif choice == '3':
            show_import_export_help()
        elif choice == '4':
            show_site_maintenance_help()
        elif choice == '5':
            show_log_help()
        elif choice == '6':
            show_config_help()
        else:
            print("[ERROR] 无效的选项")
        
        print()
        input("按回车键继续...")
        print()
