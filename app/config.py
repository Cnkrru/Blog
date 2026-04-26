# Blog Manager - Core Configuration

import os
import sys
import json
from pathlib import Path


def _get_resource_dir() -> Path:
    """Get the directory where bundled resources are located"""
    if getattr(sys, 'frozen', False):
        return Path(sys._MEIPASS)
    return Path(__file__).parent.parent


def _get_user_data_dir() -> Path:
    """Get the user data directory for storing app config"""
    if sys.platform == 'win32':
        return Path(os.environ.get('APPDATA', Path.home() / 'AppData' / 'Roaming')) / 'BlogManager'
    elif sys.platform == 'darwin':
        return Path.home() / 'Library' / 'Application Support' / 'BlogManager'
    else:
        return Path.home() / '.config' / 'BlogManager'


def _load_blog_root() -> Path:
    """Load blog root from user config"""
    user_data_dir = _get_user_data_dir()
    config_file = user_data_dir / 'config.json'
    
    if config_file.exists():
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                blog_root = data.get('blog_root')
                if blog_root and Path(blog_root).exists():
                    return Path(blog_root)
        except Exception:
            pass
    
    return None


def _save_blog_root(blog_root: Path):
    """Save blog root to user config"""
    user_data_dir = _get_user_data_dir()
    user_data_dir.mkdir(parents=True, exist_ok=True)
    
    config_file = user_data_dir / 'config.json'
    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump({'blog_root': str(blog_root)}, f, ensure_ascii=False, indent=2)


def validate_blog_root(blog_path: Path) -> tuple[bool, str]:
    """Validate if the given path is a valid blog root directory
    
    Returns:
        (is_valid, error_message)
    """
    if not blog_path.exists():
        return False, f'目录不存在: {blog_path}'
    
    src_path = blog_path / 'src'
    public_path = blog_path / 'public'
    
    if not src_path.exists():
        return False, '缺少 src 文件夹，请选择包含 src 和 public 的博客根目录'
    
    if not public_path.exists():
        return False, '缺少 public 文件夹，请选择包含 src 和 public 的博客根目录'
    
    pages_path = src_path / 'pages'
    if not pages_path.exists():
        return False, '缺少 src/pages 文件夹，目录结构可能不正确'
    
    config_path = public_path / 'config'
    if not config_path.exists():
        return False, '缺少 public/config 文件夹，目录结构可能不正确'
    
    return True, '验证通过'


def prompt_blog_root() -> Path:
    """Prompt user to select blog root directory with validation"""
    import tkinter as tk
    from tkinter import filedialog, messagebox
    
    root = tk.Tk()
    root.withdraw()
    
    while True:
        blog_root = filedialog.askdirectory(
            title='选择博客根目录',
            initialdir=os.path.expanduser('~'),
            mustexist=True
        )
        
        if not blog_root:
            result = messagebox.askyesno(
                '确认',
                '未选择博客目录，是否退出程序？'
            )
            root.destroy()
            if result:
                sys.exit(0)
            continue
        
        blog_path = Path(blog_root)
        is_valid, message = validate_blog_root(blog_path)
        
        if is_valid:
            _save_blog_root(blog_path)
            root.destroy()
            return blog_path
        else:
            retry = messagebox.askretrycancel(
                '目录验证失败',
                f'{message}\n\n是否重新选择？'
            )
            if not retry:
                root.destroy()
                sys.exit(0)


class BlogConfig:
    """Blog configuration manager"""
    
    def __init__(self):
        self._blog_root = None
        self._initialized = False
    
    @property
    def blog_root(self) -> Path:
        """Get blog root directory"""
        if self._blog_root is None:
            self._blog_root = _load_blog_root()
            if self._blog_root is None:
                self._blog_root = prompt_blog_root()
        return self._blog_root
    
    def change_blog_root(self, new_path: Path) -> bool:
        """Change the blog root directory"""
        is_valid, message = validate_blog_root(new_path)
        if not is_valid:
            return False
        
        self._blog_root = new_path
        _save_blog_root(new_path)
        return True
    
    @property
    def config_dir(self) -> Path:
        return self.blog_root / 'public' / 'config'
    
    @property
    def post_dir(self) -> Path:
        return self.blog_root / 'src' / 'pages' / 'post'
    
    @property
    def project_dir(self) -> Path:
        return self.blog_root / 'src' / 'pages' / 'project'
    
    @property
    def links_file(self) -> Path:
        return self.config_dir / 'links.json'
    
    @property
    def projects_file(self) -> Path:
        return self.config_dir / 'projects.json'
    
    @property
    def routes_file(self) -> Path:
        return self.config_dir / 'routes.json'
    
    @property
    def search_file(self) -> Path:
        return self.config_dir / 'search.json'
    
    @property
    def music_file(self) -> Path:
        return self.config_dir / 'music.json'
    
    @property
    def template_dir(self) -> Path:
        return Path(__file__).parent / 'templates'
    
    @property
    def app_title(self) -> str:
        return 'Blog Manager'
    
    @property
    def app_width(self) -> int:
        return 1200
    
    @property
    def app_height(self) -> int:
        return 800
    
    @property
    def theme(self) -> str:
        return 'dark'
    
    @property
    def color_theme(self) -> str:
        return 'blue'
    
    @property
    def editor_font_size(self) -> int:
        return 14
    
    @property
    def editor_tab_size(self) -> int:
        return 2
    
    @property
    def default_categories(self) -> list:
        return ['前端', '随笔', '后端', '工具', '生活']
    
    @property
    def default_tags(self) -> list:
        return ['前端组件', 'TypeScript', 'Vue', 'CSS', 'JavaScript']


# Global configuration instance
config = BlogConfig()
