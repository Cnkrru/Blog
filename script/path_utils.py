import os
import sys
from pathlib import Path

# 缓存字典，避免重复计算路径
_path_cache = {}


def get_project_root() -> Path:
    """
    获取项目根目录
    
    Returns:
        Path: 项目根目录路径
    
    Raises:
        FileNotFoundError: 如果无法找到项目根目录
    """
    # 检查缓存
    if 'project_root' in _path_cache:
        return _path_cache['project_root']
    
    # 检查是否为打包后的可执行文件
    if getattr(sys, 'frozen', False):
        # 打包后的可执行文件
        exe_path = Path(sys.executable).resolve()
        # 向上查找，直到找到包含 html 和 config 文件夹的目录
        current_dir = exe_path.parent
        max_depth = 10  # 最大查找深度，避免无限循环
        depth = 0
        
        while depth < max_depth:
            html_dir = current_dir / "html"
            config_dir = current_dir / "config"
            
            if html_dir.exists() and config_dir.exists():
                _path_cache['project_root'] = current_dir
                return current_dir
            
            # 向上一级
            parent_dir = current_dir.parent
            if parent_dir == current_dir:
                # 到达根目录，仍未找到
                break
            
            current_dir = parent_dir
            depth += 1
        
        # 未找到项目根目录
        raise FileNotFoundError(
            f"无法找到项目根目录。请确保可执行文件位于项目目录或其子目录中。\n"
            f"当前搜索路径: {exe_path.parent}"
        )
    else:
        # 未打包的脚本
        script_dir = Path(__file__).parent.resolve()
        project_root = script_dir.parent
        
        # 验证项目根目录
        html_dir = project_root / "html"
        config_dir = project_root / "config"
        
        if not html_dir.exists() or not config_dir.exists():
            raise FileNotFoundError(
                f"无法验证项目根目录。请确保脚本位于正确的项目结构中。\n"
                f"当前路径: {project_root}\n"
                f"缺少必要的目录: {'html' if not html_dir.exists() else ''} {'config' if not config_dir.exists() else ''}"
            )
        
        _path_cache['project_root'] = project_root
        return project_root


def get_project_paths() -> tuple:
    """
    获取项目路径
    
    Returns:
        tuple: 包含项目根目录、文章目录和search.json路径的元组
    
    Raises:
        FileNotFoundError: 如果无法找到项目根目录或必要的文件/目录
    """
    # 检查缓存
    if 'project_paths' in _path_cache:
        return _path_cache['project_paths']
    
    project_root = get_project_root()
    
    # 构建路径
    html_dir = project_root / "html"
    posts_dir = html_dir / "posts"
    config_dir = project_root / "config"
    search_json_path = config_dir / "search.json"
    
    # 验证必要的目录
    required_dirs = [html_dir, posts_dir, config_dir]
    for dir_path in required_dirs:
        if not dir_path.exists():
            # 尝试创建不存在的目录
            try:
                dir_path.mkdir(parents=True, exist_ok=True)
                print(f"[INFO] 创建缺失的目录: {dir_path}")
            except Exception as e:
                raise FileNotFoundError(
                    f"无法创建必要的目录: {dir_path}\n"
                    f"错误: {e}"
                )
    
    # 验证 search.json 文件
    if not search_json_path.exists():
        # 创建默认的 search.json 文件
        default_content = '[]'
        try:
            with open(search_json_path, 'w', encoding='utf-8') as f:
                f.write(default_content)
            print(f"[INFO] 创建默认的 search.json 文件: {search_json_path}")
        except Exception as e:
            raise FileNotFoundError(
                f"无法创建 search.json 文件: {search_json_path}\n"
                f"错误: {e}"
            )
    
    result = (project_root, posts_dir, search_json_path)
    _path_cache['project_paths'] = result
    return result


def get_template_path() -> Path:
    """
    获取模板文件路径
    
    Returns:
        Path: 模板文件路径
    
    Raises:
        FileNotFoundError: 如果无法找到模板文件
    """
    # 检查缓存
    if 'template_path' in _path_cache:
        return _path_cache['template_path']
    
    project_root = get_project_root()
    template_dir = project_root / "templates"
    post_template_path = template_dir / "post_template.html"
    
    # 验证模板目录
    if not template_dir.exists():
        try:
            template_dir.mkdir(parents=True, exist_ok=True)
            print(f"[INFO] 创建模板目录: {template_dir}")
        except Exception as e:
            raise FileNotFoundError(
                f"无法创建模板目录: {template_dir}\n"
                f"错误: {e}"
            )
    
    # 验证模板文件
    if not post_template_path.exists():
        # 创建默认的模板文件
        default_template = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="{description}">
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <header>
        <h1>{title}</h1>
        <div class="post-meta">
            <span class="post-date">{date_str}</span>
            <span class="post-category">{category}</span>
        </div>
        <div class="post-tags">
            {tags}
        </div>
    </header>
    <main>
        <!-- 文章内容 -->
    </main>
    <footer>
        <p>&copy; {year} 博客</p>
    </footer>
</body>
</html>'''
        
        try:
            with open(post_template_path, 'w', encoding='utf-8') as f:
                f.write(default_template)
            print(f"[INFO] 创建默认的模板文件: {post_template_path}")
        except Exception as e:
            raise FileNotFoundError(
                f"无法创建模板文件: {post_template_path}\n"
                f"错误: {e}"
            )
    
    _path_cache['template_path'] = post_template_path
    return post_template_path


def get_drafts_path() -> Path:
    """
    获取草稿文件夹路径
    
    Returns:
        Path: 草稿文件夹路径
    """
    # 检查缓存
    if 'drafts_path' in _path_cache:
        return _path_cache['drafts_path']
    
    project_root = get_project_root()
    drafts_dir = project_root / "drafts"
    
    # 确保草稿文件夹存在
    if not drafts_dir.exists():
        try:
            drafts_dir.mkdir(parents=True, exist_ok=True)
            print(f"[INFO] 创建草稿文件夹: {drafts_dir}")
        except Exception as e:
            raise FileNotFoundError(
                f"无法创建草稿文件夹: {drafts_dir}\n"
                f"错误: {e}"
            )
    
    _path_cache['drafts_path'] = drafts_dir
    return drafts_dir


def get_import_export_path() -> Path:
    """
    获取导入导出目录路径
    
    Returns:
        Path: 导入导出目录路径
    """
    # 检查缓存
    if 'import_export_path' in _path_cache:
        return _path_cache['import_export_path']
    
    project_root = get_project_root()
    import_export_dir = project_root / "import_export"
    
    # 确保导入导出目录存在
    if not import_export_dir.exists():
        try:
            import_export_dir.mkdir(parents=True, exist_ok=True)
            print(f"[INFO] 创建导入导出目录: {import_export_dir}")
        except Exception as e:
            raise FileNotFoundError(
                f"无法创建导入导出目录: {import_export_dir}\n"
                f"错误: {e}"
            )
    
    _path_cache['import_export_path'] = import_export_dir
    return import_export_dir


def get_logs_path() -> Path:
    """
    获取日志目录路径
    
    Returns:
        Path: 日志目录路径
    """
    # 检查缓存
    if 'logs_path' in _path_cache:
        return _path_cache['logs_path']
    
    project_root = get_project_root()
    logs_dir = project_root / "logs"
    
    # 确保日志目录存在
    if not logs_dir.exists():
        try:
            logs_dir.mkdir(parents=True, exist_ok=True)
            print(f"[INFO] 创建日志目录: {logs_dir}")
        except Exception as e:
            raise FileNotFoundError(
                f"无法创建日志目录: {logs_dir}\n"
                f"错误: {e}"
            )
    
    _path_cache['logs_path'] = logs_dir
    return logs_dir





def clear_path_cache():
    """
    清除路径缓存
    """
    global _path_cache
    _path_cache = {}
