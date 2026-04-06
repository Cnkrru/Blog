#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
配置管理相关的函数
包含配置文件的读取、写入和管理功能
"""

import json
from pathlib import Path
from cli_utils import get_project_paths
from error_handling import handle_error


# 默认配置
DEFAULT_CONFIG = {
    "app": {
        "name": "博客命令行工具",
        "version": "1.0.0",
        "author": "Cnkrru"
    },
    "paths": {
        "posts_dir": "html/posts",
        "drafts_dir": "drafts",
        "templates_dir": "templates",
        "import_export_dir": "import_export"
    },
    "logging": {
        "level": "info",
        "log_dir": "logs",
        "max_log_files": 7
    },
    "export": {
        "markdown_format": "{id:03d}_{title}",
        "html_format": "{id:03d}_{title}",
        "json_format": "posts_export"
    },
    "ui": {
        "color_enabled": True,
        "separator_char": "=",
        "separator_length": 50
    },
    "editor": {
        "default_editor": "notepad.exe",
        "edit_on_create": False
    },
    "search": {
        "case_sensitive": False,
        "max_results": 10
    },
    "security": {
        "confirm_delete": True
    }
}


# 配置文件路径
def get_config_path():
    """获取配置文件路径"""
    project_root, _, _ = get_project_paths()
    return project_root / "config.json"


# 加载配置
@handle_error
def load_config():
    """加载配置文件"""
    config_path = get_config_path()
    
    if config_path.exists():
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        return config
    else:
        # 如果配置文件不存在，返回默认配置
        return DEFAULT_CONFIG


# 保存配置
@handle_error
def save_config(config):
    """保存配置文件"""
    config_path = get_config_path()
    
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)
    print("[SUCCESS] 配置保存成功")
    return True


# 重置配置
@handle_error
def reset_config():
    """重置配置为默认值"""
    config_path = get_config_path()
    
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(DEFAULT_CONFIG, f, ensure_ascii=False, indent=2)
    print("[SUCCESS] 配置已重置为默认值")
    return True


# 查看当前配置
@handle_error
def view_config():
    """查看当前配置"""
    config = load_config()
    
    print("="*50)
    print("当前配置")
    print("="*50)
    print()
    
    def print_section(title, data, indent=0):
        """打印配置节"""
        prefix = "  " * indent
        print(f"{prefix}{title}:")
        for key, value in data.items():
            if isinstance(value, dict):
                print_section(key, value, indent + 1)
            else:
                print(f"{prefix}  {key}: {value}")
    
    for section, data in config.items():
        print_section(section, data)
    
    print()


# 编辑配置
@handle_error
def edit_config():
    """编辑配置"""
    config = load_config()
    
    print("="*50)
    print("编辑配置")
    print("="*50)
    print()
    
    print("请选择要编辑的配置节：")
    print("  1. 应用配置 (app)")
    print("  2. 路径配置 (paths)")
    print("  3. 日志配置 (logging)")
    print("  4. 导出配置 (export)")
    print("  5. UI配置 (ui)")
    print("  6. 编辑器配置 (editor)")
    print("  7. 搜索配置 (search)")
    print("  8. 安全配置 (security)")
    print()
    
    section_choice = input("请输入选项 (1/2/3/4/5/6/7/8，直接回车返回): " ).strip()
    if not section_choice:
        return
    
    section_map = {
        '1': 'app',
        '2': 'paths',
        '3': 'logging',
        '4': 'export',
        '5': 'ui',
        '6': 'editor',
        '7': 'search',
        '8': 'security'
    }
    
    section = section_map.get(section_choice)
    if not section:
        raise Exception("无效的选项")
    
    print()
    print(f"当前 {section} 配置：")
    for key, value in config[section].items():
        print(f"  {key}: {value}")
    print()
    
    print("请输入要修改的键值对（格式：key=value，直接回车结束）：")
    
    while True:
        input_line = input("  ").strip()
        if not input_line:
            break
        
        if '=' not in input_line:
            raise Exception("格式错误，请使用 key=value 格式")
        
        key, value = input_line.split('=', 1)
        key = key.strip()
        value = value.strip()
        
        if key not in config[section]:
            raise Exception(f"键 '{key}' 不存在")
        
        # 类型转换
        original_value = config[section][key]
        if isinstance(original_value, bool):
            value = value.lower() in ('true', 'yes', '1')
        elif isinstance(original_value, int):
            try:
                value = int(value)
            except ValueError:
                raise Exception(f"无效的整数值: {value}")
        
        config[section][key] = value
        print(f"[SUCCESS] 已更新: {key} = {value}")
    
    # 保存配置
    save_config(config)


# 配置管理主函数
@handle_error
def manage_config():
    """配置管理主函数"""
    while True:
        print("="*50)
        print("配置管理")
        print("="*50)
        print()
        print("请选择操作：")
        print("  1. 查看当前配置")
        print("  2. 编辑配置")
        print("  3. 重置配置为默认值")
        print("  4. 导入配置")
        print("  5. 导出配置")
        print("  6. 验证配置")
        print("  0. 返回")
        print()
        
        choice = input("请输入选项 (0/1/2/3/4/5/6): " ).strip()
        
        if choice == '0':
            break
        elif choice == '1':
            view_config()
        elif choice == '2':
            edit_config()
        elif choice == '3':
            reset_config()
        elif choice == '4':
            import_config()
        elif choice == '5':
            export_config()
        elif choice == '6':
            validate_config()
        else:
            raise Exception("无效的选项")
        
        print()
        input("按回车键继续...")
        print()


# 导入配置
@handle_error
def import_config():
    """导入配置"""
    from pathlib import Path
    
    print("="*50)
    print("导入配置")
    print("="*50)
    print()
    
    # 选择导入文件
    import_dir = Path.cwd()
    config_files = list(import_dir.glob('*.json'))
    
    if not config_files:
        print("[INFO] 当前目录没有JSON文件")
        return
    
    print("请选择要导入的配置文件：")
    for i, file in enumerate(config_files, 1):
        print(f"  {i}. {file.name}")
    print()
    
    choice = input("请输入选项 (直接回车取消): " ).strip()
    if not choice:
        print("[INFO] 已取消")
        return
    
    try:
        idx = int(choice) - 1
        if 0 <= idx < len(config_files):
            selected_file = config_files[idx]
        else:
            raise Exception("无效的编号")
    except ValueError:
        raise Exception("请输入有效的数字")
    
    print()
    print(f"选择文件: {selected_file.name}")
    print()
    
    # 读取配置文件
    with open(selected_file, 'r', encoding='utf-8') as f:
        imported_config = json.load(f)
    
    # 验证配置结构
    if not isinstance(imported_config, dict):
        raise Exception("无效的配置文件格式")
    
    # 保存配置
    save_config(imported_config)
    print("[SUCCESS] 配置导入成功")


# 导出配置
@handle_error
def export_config():
    """导出配置"""
    from pathlib import Path
    from datetime import datetime
    
    print("="*50)
    print("导出配置")
    print("="*50)
    print()
    
    # 加载当前配置
    config = load_config()
    
    # 生成文件名
    date_str = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    export_file_name = f"config_export_{date_str}.json"
    export_file_path = Path.cwd() / export_file_name
    
    # 保存配置到文件
    with open(export_file_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)
    
    print(f"[SUCCESS] 配置已导出到: {export_file_path}")


# 验证配置
@handle_error
def validate_config():
    """验证配置"""
    config = load_config()
    
    print("="*50)
    print("验证配置")
    print("="*50)
    print()
    
    valid = True
    
    # 验证必要的配置节
    required_sections = ['app', 'paths', 'logging', 'export', 'ui', 'editor', 'search', 'security']
    for section in required_sections:
        if section not in config:
            print(f"[ERROR] 缺少配置节: {section}")
            valid = False
        else:
            print(f"[SUCCESS] 配置节 '{section}' 存在")
    
    # 验证路径配置
    if 'paths' in config:
        paths = config['paths']
        required_paths = ['posts_dir', 'drafts_dir', 'templates_dir', 'import_export_dir']
        for path_key in required_paths:
            if path_key not in paths:
                print(f"[ERROR] 缺少路径配置: {path_key}")
                valid = False
            else:
                print(f"[SUCCESS] 路径配置 '{path_key}' 存在")
    
    # 验证日志配置
    if 'logging' in config:
        logging = config['logging']
        if 'level' not in logging:
            print("[ERROR] 缺少日志级别配置")
            valid = False
        else:
            print(f"[SUCCESS] 日志级别配置: {logging['level']}")
    
    # 验证UI配置
    if 'ui' in config:
        ui = config['ui']
        if 'color_enabled' not in ui:
            print("[ERROR] 缺少颜色启用配置")
            valid = False
        else:
            print(f"[SUCCESS] 颜色启用配置: {ui['color_enabled']}")
    
    print()
    if valid:
        print("[SUCCESS] 配置验证通过")
    else:
        print("[ERROR] 配置验证失败")
