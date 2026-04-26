"""Announcement management panel"""

import customtkinter as ctk
from tkinter import messagebox
from datetime import datetime

from app.services.announcement_service import AnnouncementService
from app.models.announcement import Announcement


class AnnouncementPanel(ctk.CTkFrame):
    """Panel for managing announcements"""
    
    def __init__(self, parent):
        super().__init__(parent)
        
        self.service = AnnouncementService()
        self.announcement = None
        
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)
        
        self._create_widgets()
        self._load_announcement()
    
    def _create_widgets(self):
        """Create panel widgets"""
        self.header_frame = ctk.CTkFrame(self)
        self.header_frame.grid(row=0, column=0, sticky='ew', padx=10, pady=(10, 5))
        self.header_frame.grid_columnconfigure(0, weight=1)
        
        self.title_label = ctk.CTkLabel(
            self.header_frame,
            text='公告管理',
            font=ctk.CTkFont(size=24, weight='bold')
        )
        self.title_label.grid(row=0, column=0, padx=10, pady=10, sticky='w')
        
        self.save_btn = ctk.CTkButton(
            self.header_frame,
            text='保存公告',
            command=self._save_announcement,
            width=120
        )
        self.save_btn.grid(row=0, column=1, padx=10, pady=10, sticky='e')
        
        self.editor_frame = ctk.CTkFrame(self)
        self.editor_frame.grid(row=1, column=0, sticky='nsew', padx=10, pady=5)
        self.editor_frame.grid_columnconfigure(0, weight=1)
        self.editor_frame.grid_rowconfigure(1, weight=1)
        
        ctk.CTkLabel(
            self.editor_frame,
            text='公告内容 (支持 Markdown)',
            font=ctk.CTkFont(size=14, weight='bold')
        ).grid(row=0, column=0, sticky='w', padx=10, pady=(10, 5))
        
        self.content_text = ctk.CTkTextbox(self.editor_frame, width=900, height=500)
        self.content_text.grid(row=1, column=0, sticky='nsew', padx=10, pady=5)
    
    def _load_announcement(self):
        """Load announcement asynchronously"""
        self.after(10, self._do_load)
    
    def _do_load(self):
        """Actually load announcement"""
        self.announcement = self.service.get_announcement()
        self.content_text.delete('1.0', 'end')
        self.content_text.insert('1.0', self.announcement.content)
    
    def refresh(self):
        """Refresh announcement"""
        self.after(10, self._do_load)
    
    def _save_announcement(self):
        """Save announcement"""
        content = self.content_text.get('1.0', 'end-1c').strip()
        
        if not content:
            messagebox.showwarning('警告', '公告内容不能为空')
            return
        
        if self.service.update_content(content):
            messagebox.showinfo('成功', '公告保存成功')
        else:
            messagebox.showerror('错误', '公告保存失败')
