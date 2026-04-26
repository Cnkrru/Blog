"""Changelog management panel - Editor style like announcement"""

import customtkinter as ctk
from tkinter import messagebox

from app.services.changelog_service import ChangelogService
from app.models.changelog import Changelog


class ChangelogPanel(ctk.CTkFrame):
    """Panel for managing changelog as raw markdown"""
    
    def __init__(self, parent):
        super().__init__(parent)
        
        self.service = ChangelogService()
        self.content_cache = ''
        
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)
        
        self._create_widgets()
        self._load_changelog()
    
    def _create_widgets(self):
        """Create panel widgets"""
        self.header_frame = ctk.CTkFrame(self)
        self.header_frame.grid(row=0, column=0, sticky='ew', padx=10, pady=(10, 5))
        self.header_frame.grid_columnconfigure(0, weight=1)
        
        self.title_label = ctk.CTkLabel(
            self.header_frame,
            text='日志管理',
            font=ctk.CTkFont(size=24, weight='bold')
        )
        self.title_label.grid(row=0, column=0, padx=10, pady=10, sticky='w')
        
        self.save_btn = ctk.CTkButton(
            self.header_frame,
            text='保存日志',
            command=self._save_changelog,
            width=120
        )
        self.save_btn.grid(row=0, column=1, padx=10, pady=10, sticky='e')
        
        self.editor_frame = ctk.CTkFrame(self)
        self.editor_frame.grid(row=1, column=0, sticky='nsew', padx=10, pady=5)
        self.editor_frame.grid_columnconfigure(0, weight=1)
        self.editor_frame.grid_rowconfigure(1, weight=1)
        
        ctk.CTkLabel(
            self.editor_frame,
            text='日志内容 (支持 Markdown)',
            font=ctk.CTkFont(size=14, weight='bold')
        ).grid(row=0, column=0, sticky='w', padx=10, pady=(10, 5))
        
        self.content_text = ctk.CTkTextbox(self.editor_frame, width=900, height=500)
        self.content_text.grid(row=1, column=0, sticky='nsew', padx=10, pady=5)
    
    def _load_changelog(self):
        """Load changelog asynchronously"""
        self.after(10, self._do_load)
    
    def _do_load(self):
        """Actually load changelog"""
        changelog = self.service.get_changelog()
        content = self.service.content_cache.get('changelog')
        
        if content:
            self.content_text.delete('1.0', 'end')
            self.content_text.insert('1.0', content)
            self.content_cache = content
    
    def refresh(self):
        """Refresh changelog"""
        self.after(10, self._do_load)
    
    def _save_changelog(self):
        """Save changelog"""
        content = self.content_text.get('1.0', 'end-1c').strip()
        
        if not content:
            messagebox.showwarning('警告', '日志内容不能为空')
            return
        
        changelog = Changelog.from_markdown(content)
        
        if self.service.save_changelog(changelog):
            messagebox.showinfo('成功', '日志保存成功')
            self.content_cache = content
        else:
            messagebox.showerror('错误', '日志保存失败')
