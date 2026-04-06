#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
导入相关的函数
包含从Markdown、JSON和HTML导入文章的功能
"""

import re
import shutil
from datetime import datetime
from pathlib import Path
from cli_utils import get_project_paths, load_search_json, save_search_json, parse_id_input
from error_handling import handle_error, ImportExportError


# 从Markdown文件导入文章
@handle_error
def import_from_markdown():
    project_root, posts_dir, search_json_path = get_project_paths()
    import_export_dir = project_root / "import_export"
    import_dir = import_export_dir / "import"
    markdown_dir = import_dir / "markdown"
    
    print("="*50)
    print("从Markdown文件导入文章")
    print("="*50)
    print()
    
    # 确保导入目录存在
    markdown_dir.mkdir(parents=True, exist_ok=True)
    print(f"[INFO] 导入目录: {markdown_dir}")
    
    # 查找Markdown文件
    md_files = list(markdown_dir.glob('*.md'))
    
    if not md_files:
        print("[INFO] 导入目录中没有Markdown文件")
        print(f"  导入目录: {markdown_dir}")
        return
    
    print(f"发现 {len(md_files)} 个Markdown文件")
    print()
    
    for i, md_file in enumerate(md_files, 1):
        print(f"  {i}. {md_file.name}")
    print()
    
    # 选择文件
    choice = input("请选择要导入的文件编号 (直接回车取消): " ).strip()
    if not choice:
        print("[INFO] 已取消")
        return
    
    try:
        idx = int(choice) - 1
        if 0 <= idx < len(md_files):
            selected_file = md_files[idx]
        else:
            raise ImportExportError("无效的编号")
    except ValueError:
        raise ImportExportError("请输入有效的数字")
    
    print()
    print(f"选择文件: {selected_file.name}")
    print()
    
    # 读取Markdown文件
    with open(selected_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 解析YAML Front Matter
    front_matter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    
    title = ""
    category = "随笔"
    tags = []
    date = datetime.now().strftime('%Y-%m-%d')
    body_content = content
    
    if front_matter_match:
        front_matter = front_matter_match.group(1)
        body_content = content[front_matter_match.end():].strip()
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
    
    if not title:
        # 从文件名提取标题
        title = selected_file.stem.replace('_', ' ')
        # 移除数字前缀
        title = re.sub(r'^\d+_', '', title)
    
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
    
    # 创建文章文件
    post_id = str(next_id)
    post_file_name = f"post-{post_id}.html"
    post_file_path = posts_dir / post_file_name
    
    # 解析Markdown内容为HTML
    def markdown_to_html(markdown):
        """将Markdown转换为HTML"""
        # 处理标题
        markdown = re.sub(r'^# (.*)$', r'<h1>\1</h1>', markdown, flags=re.MULTILINE)
        markdown = re.sub(r'^## (.*)$', r'<h2>\1</h2>', markdown, flags=re.MULTILINE)
        markdown = re.sub(r'^### (.*)$', r'<h3>\1</h3>', markdown, flags=re.MULTILINE)
        markdown = re.sub(r'^#### (.*)$', r'<h4>\1</h4>', markdown, flags=re.MULTILINE)
        
        # 处理列表
        markdown = re.sub(r'^- (.*)$', r'<li>\1</li>', markdown, flags=re.MULTILINE)
        markdown = re.sub(r'(<li>.*</li>)', r'<ul>\1</ul>', markdown, flags=re.DOTALL)
        
        # 处理代码块
        markdown = re.sub(r'```(\w*)\n(.*?)```', r'<pre><code>\2</code></pre>', markdown, flags=re.DOTALL)
        
        # 处理粗体和斜体
        markdown = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', markdown)
        markdown = re.sub(r'\*(.*?)\*', r'<em>\1</em>', markdown)
        
        # 处理链接
        markdown = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', markdown)
        
        # 处理段落
        markdown = re.sub(r'(^[^<].*$)', r'<p>\1</p>', markdown, flags=re.MULTILINE)
        
        return markdown
    
    # 生成HTML内容
    html_body = markdown_to_html(body_content) if body_content else "<p>文章内容...</p>"
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
            {html_body}
        </div>
    </div>
    <script src="../../js/header-js/music-player.js"></script>
</body>
</html>
    """
    
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



# 从HTML文件导入文章
@handle_error
def import_from_html():
    project_root, posts_dir, search_json_path = get_project_paths()
    import_export_dir = project_root / "import_export"
    import_dir = import_export_dir / "import"
    html_dir = import_dir / "html"
    
    print("="*50)
    print("从HTML文件导入文章")
    print("="*50)
    print()
    
    # 确保导入目录存在
    html_dir.mkdir(parents=True, exist_ok=True)
    print(f"[INFO] 导入目录: {html_dir}")
    
    # 查找HTML文件
    html_files = list(html_dir.glob('*.html'))
    
    if not html_files:
        print("[INFO] 导入目录中没有HTML文件")
        print(f"  导入目录: {html_dir}")
        return
    
    print(f"发现 {len(html_files)} 个HTML文件")
    print()
    
    for i, html_file in enumerate(html_files, 1):
        print(f"  {i}. {html_file.name}")
    print()
    
    confirm = input("确认导入? (1=确认, 0=取消): " ).strip()
    if confirm != '1':
        print("[INFO] 已取消")
        return
    
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
    
    success_count = 0
    failed_count = 0
    
    print()
    print("开始导入...")
    print("-"*50)
    
    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 提取标题
            title_match = re.search(r'<h1[^>]*>(.*?)</h1>', content)
            title = title_match.group(1) if title_match else f'文章{next_id}'
            
            # 提取日期
            date_match = re.search(r'<span[^>]*class="post-date"[^>]*>(.*?)</span>', content)
            date = date_match.group(1) if date_match else datetime.now().strftime('%Y-%m-%d')
            
            # 提取分类
            category_match = re.search(r'<span[^>]*class="post-category"[^>]*>(.*?)</span>', content)
            category = category_match.group(1) if category_match else '随笔'
            
            # 提取标签
            tags = []
            tags_match = re.findall(r'<span[^>]*class="post-tag"[^>]*>(.*?)</span>', content)
            if tags_match:
                tags = tags_match
            
            # 创建文章文件
            post_id = str(next_id)
            post_file_name = f"post-{post_id}.html"
            post_file_path = posts_dir / post_file_name
            
            # 复制HTML内容
            with open(post_file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
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
            
            print(f"[SUCCESS] 导入: 文章 {title}")
            success_count += 1
            next_id += 1
            
        except Exception as e:
            print(f"[ERROR] 导入失败 {html_file.name}: {e}")
            failed_count += 1
    
    # 保存更新后的search.json
    if success_count > 0:
        save_search_json(search_json_path, search_data)
    
    print()
    print("="*50)
    print("导入完成!")
    print(f"  成功: {success_count} 个文件")
    print(f"  失败: {failed_count} 个文件")
    print("="*50)



# 将export文件夹下的文件转移到import对应文件位置
@handle_error
def transfer_export_to_import():
    project_root, _, _ = get_project_paths()
    import_export_dir = project_root / "import_export"
    export_dir = import_export_dir / "export"
    import_dir = import_export_dir / "import"
    
    print("="*50)
    print("将export文件夹下的文件转移到import对应文件位置")
    print("="*50)
    print()
    
    # 检查export目录是否存在
    if not export_dir.exists():
        print("[INFO] export目录不存在")
        return
    
    # 检查格式目录
    formats = ["markdown", "html"]
    available_formats = []
    
    for fmt in formats:
        fmt_dir = export_dir / fmt
        if fmt_dir.exists() and any(fmt_dir.iterdir()):
            available_formats.append(fmt)
    
    if not available_formats:
        print("[INFO] export目录中没有可转移的文件")
        return
    
    # 选择格式
    print("可用的格式：")
    for i, fmt in enumerate(available_formats, 1):
        print(f"  {i}. {fmt}")
    print()
    
    fmt_choice = input("请选择要转移的格式编号 (直接回车取消): " ).strip()
    if not fmt_choice:
        print("[INFO] 已取消")
        return
    
    try:
        fmt_idx = int(fmt_choice) - 1
        if 0 <= fmt_idx < len(available_formats):
            selected_format = available_formats[fmt_idx]
        else:
            raise ImportExportError("无效的编号")
    except ValueError:
        raise ImportExportError("请输入有效的数字")
    
    # 扫描该格式下的文件
    export_fmt_dir = export_dir / selected_format
    import_fmt_dir = import_dir / selected_format
    
    # 确保import格式目录存在
    import_fmt_dir.mkdir(parents=True, exist_ok=True)
    print(f"[INFO] 导入目录: {import_fmt_dir}")
    
    # 查找文件
    if selected_format == "markdown":
        files = list(export_fmt_dir.glob('**/*.md'))
    elif selected_format == "html":
        files = list(export_fmt_dir.glob('**/*.html'))
    else:
        files = []
    
    if not files:
        print(f"[INFO] {selected_format} 目录中没有可转移的文件")
        return
    
    # 显示文件列表
    print(f"\n发现 {len(files)} 个 {selected_format} 文件：")
    for i, file in enumerate(files, 1):
        print(f"  {i}. {file.relative_to(export_fmt_dir)}")
    print()
    
    # 选择转移方式
    print("请选择转移方式：")
    print("  1. 转移单篇文件")
    print("  2. 转移多篇文件")
    print()
    
    transfer_choice = input("请输入选项 (1/2，直接回车取消): " ).strip()
    if not transfer_choice:
        print("[INFO] 已取消")
        return
    
    selected_indices = []
    
    if transfer_choice == '1':
        # 转移单篇文件
        file_choice = input("请选择要转移的文件编号: " ).strip()
        if not file_choice:
            print("[INFO] 已取消")
            return
        
        try:
            idx = int(file_choice) - 1
            if 0 <= idx < len(files):
                selected_indices.append(idx)
            else:
                raise ImportExportError("无效的编号")
        except ValueError:
            raise ImportExportError("请输入有效的数字")
            
    elif transfer_choice == '2':
        # 转移多篇文件
        file_choice = input("请选择要转移的文件编号 (使用列表格式，例如: [1,3,5]): " ).strip()
        if not file_choice:
            print("[INFO] 已取消")
            return
        
        # 解析ID输入
        id_strings = parse_id_input(file_choice)
        if not id_strings:
            raise ImportExportError("未选择有效的文件")
        
        try:
            for id_str in id_strings:
                idx = int(id_str) - 1
                if 0 <= idx < len(files):
                    selected_indices.append(idx)
                else:
                    raise ImportExportError(f"无效的编号: {id_str}")
        except ValueError:
            raise ImportExportError("请输入有效的数字")
            
    else:
        raise ImportExportError("无效的选项")
    
    # 复制文件
    success_count = 0
    failed_count = 0
    
    for idx in selected_indices:
        selected_file = files[idx]
        dest_file = import_fmt_dir / selected_file.name
        
        try:
            shutil.copy2(selected_file, dest_file)
            print(f"[SUCCESS] 转移: {selected_file.relative_to(export_fmt_dir)}")
            success_count += 1
        except Exception as e:
            print(f"[ERROR] 转移失败 {selected_file.relative_to(export_fmt_dir)}: {e}")
            failed_count += 1
    
    print()
    print("="*50)
    print("转移完成!")
    print(f"  成功: {success_count} 个文件")
    print(f"  失败: {failed_count} 个文件")
    print("="*50)