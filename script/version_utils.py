#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
版本控制相关的函数
包含版本信息显示和版本检查功能
"""

from config_utils import load_config, save_config


# 获取当前版本
def get_current_version():
    """获取当前版本"""
    config = load_config()
    return config.get("app", {}).get("version", "1.0.0")


# 显示版本信息
def show_version():
    """显示版本信息"""
    config = load_config()
    version = config.get("app", {}).get("version", "1.0.0")
    name = config.get("app", {}).get("name", "博客命令行工具")
    author = config.get("app", {}).get("author", "Cnkrru")
    
    print("="*50)
    print(f"{name}")
    print("="*50)
    print(f"版本: {version}")
    print(f"作者: {author}")
    print()
    print("功能列表:")
    print("  - 文章管理: 删除、编辑、统计等")
    print("  - 内容导入导出: Markdown、HTML 格式")
    print("  - 媒体配置更新: 音乐和视频配置")
    print("  - 站点维护: 草稿管理")
    print("  - 日志管理: 查看和清理日志")
    print("  - 配置管理: 自定义设置")
    print("  - 帮助系统: 详细的使用说明")
    print()
    print("使用 --help 查看详细帮助")
    print("="*50)





# 更新版本号
def update_version():
    """更新版本号"""
    current_version = get_current_version()
    
    print("="*50)
    print("更新版本号")
    print("="*50)
    print(f"当前版本: {current_version}")
    print()
    
    new_version = input("请输入新版本号 (直接回车取消): " ).strip()
    if not new_version:
        print("[INFO] 已取消")
        return
    
    # 验证版本号格式
    if not new_version.replace('.', '').isdigit():
        print("[ERROR] 版本号格式错误，应为数字和点的组合，如 1.0.1")
        return
    
    # 更新配置
    config = load_config()
    config["app"]["version"] = new_version
    
    if save_config(config):
        print(f"[SUCCESS] 版本号已更新为: {new_version}")
    
    print()


# 版本管理主函数
def manage_version():
    """版本管理主函数"""
    while True:
        print("="*50)
        print("版本管理")
        print("="*50)
        print()
        print("请选择操作：")
        print("  1. 显示版本信息")
        print("  2. 更新版本号")
        print("  0. 返回")
        print()
        
        choice = input("请输入选项 (0/1/2): " ).strip()
        
        if choice == '0':
            break
        elif choice == '1':
            show_version()
        elif choice == '2':
            update_version()
        else:
            print("[ERROR] 无效的选项")
        
        print()
        input("按回车键继续...")
        print()
