"""Main application window - Optimized with lazy loading and resource cleanup"""

import customtkinter as ctk
import logging
from pathlib import Path
from tkinter import messagebox

from app.config import config
from app.ui.sidebar import SidebarFrame
from app.ui.lazy_panel import LazyPanelProxy
from app.utils.cache import LRUCacheManager

logger = logging.getLogger(__name__)


class MainWindow(ctk.CTk):
    """Main application window"""
    
    def __init__(self):
        super().__init__()
        
        self._setup_window()
        self._create_layout()
        self._bind_events()
    
    def _setup_window(self):
        """Configure window properties"""
        self.title(config.app_title)
        self.geometry(f'{config.app_width}x{config.app_height}')
        
        ctk.set_appearance_mode(config.theme)
        ctk.set_default_color_theme(f'{config.color_theme}')
        
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)
    
    def _create_layout(self):
        """Create main layout"""
        # Sidebar
        self.sidebar = SidebarFrame(self)
        self.sidebar.grid(row=0, column=0, sticky='nsew', padx=(10, 0), pady=10)
        
        # Content frame
        self.content_frame = ctk.CTkFrame(self)
        self.content_frame.grid(row=0, column=1, sticky='nsew', padx=10, pady=10)
        self.content_frame.grid_columnconfigure(0, weight=1)
        self.content_frame.grid_rowconfigure(0, weight=1)
        
        # Lazy initialize panels (only create when shown)
        self.post_panel = self._create_lazy_panel('PostPanel', 'app.ui.post_panel')
        self.link_panel = self._create_lazy_panel('LinkPanel', 'app.ui.link_panel')
        self.project_panel = self._create_lazy_panel('ProjectPanel', 'app.ui.project_panel')
        self.changelog_panel = self._create_lazy_panel('ChangelogPanel', 'app.ui.changelog_panel')
        self.announcement_panel = self._create_lazy_panel('AnnouncementPanel', 'app.ui.announcement_panel')
        
        about_path = config.blog_root / 'src' / 'pages' / 'About' / 'about.md'
        self.about_panel = self._create_lazy_panel(
            'PageEditorPanel', 'app.ui.page_editor_panel',
            page_name='关于页面', file_path=about_path
        )
        
        self.stats_panel = self._create_lazy_panel('StatsPanel', 'app.ui.stats_panel')
        
        # Show default panel (this will trigger lazy loading)
        self.post_panel.grid(row=0, column=0, sticky='nsew')
        
        self.current_panel = self.post_panel
        
        # Set initial sidebar active state
        self.sidebar.select_first()
    
    def _create_lazy_panel(self, class_name: str, module_path: str, **kwargs):
        """Create a lazy-loaded panel proxy"""
        def factory(parent):
            import importlib
            module = importlib.import_module(module_path)
            cls = getattr(module, class_name)
            return cls(parent, **kwargs)
        
        return LazyPanelProxy(self.content_frame, factory)
    
    def _bind_events(self):
        """Bind sidebar events"""
        self.sidebar.on_post_click = self._show_post_panel
        self.sidebar.on_link_click = self._show_link_panel
        self.sidebar.on_project_click = self._show_project_panel
        self.sidebar.on_changelog_click = self._show_changelog_panel
        self.sidebar.on_announcement_click = self._show_announcement_panel
        self.sidebar.on_about_click = self._show_about_panel
        self.sidebar.on_stats_click = self._show_stats_panel
        
        # Bind close event
        self.protocol("WM_DELETE_WINDOW", self._on_closing)
    
    def _cleanup_resources(self):
        """Cleanup all resources before closing"""
        try:
            from app.utils.async_worker import AsyncWorker
            worker = AsyncWorker.get_instance()
            worker.shutdown()
            logger.info('Thread pool shutdown complete')
        except Exception as e:
            logger.error(f'Error shutting down worker: {e}')
        
        try:
            from app.utils.cache import LRUCacheManager
            cache = LRUCacheManager()
            cache.cleanup_expired()
            logger.info('Cache cleanup complete')
        except Exception as e:
            logger.error(f'Error cleaning cache: {e}')
    
    def _on_closing(self):
        """Handle window close event"""
        if messagebox.askyesno("退出确认", "确定要退出 Blog Manager 吗？"):
            logger.info('Closing Blog Manager...')
            self._cleanup_resources()
            self.quit()
            self.destroy()
    
    def _show_post_panel(self):
        self._switch_panel(self.post_panel)
    
    def _show_link_panel(self):
        self._switch_panel(self.link_panel)
    
    def _show_project_panel(self):
        self._switch_panel(self.project_panel)
    
    def _show_changelog_panel(self):
        self._switch_panel(self.changelog_panel)
    
    def _show_announcement_panel(self):
        self._switch_panel(self.announcement_panel)
    
    def _show_about_panel(self):
        self._switch_panel(self.about_panel)
    
    def _show_tag_panel(self):
        self._switch_panel(self.tag_panel)
    
    def _show_stats_panel(self):
        self._switch_panel(self.stats_panel)
    
    def _switch_panel(self, new_panel):
        """Switch between panels"""
        if self.current_panel:
            self.current_panel.grid_forget()
        
        new_panel.grid(row=0, column=0, sticky='nsew')
        self.current_panel = new_panel
        
        if hasattr(new_panel, 'refresh'):
            new_panel.refresh()
