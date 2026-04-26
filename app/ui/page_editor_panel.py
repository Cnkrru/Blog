"""Generic page editor panel for about, terminal, etc."""

import customtkinter as ctk
from tkinter import messagebox
from pathlib import Path


class PageEditorPanel(ctk.CTkFrame):
    """Panel for editing single markdown pages"""
    
    def __init__(self, parent, page_name: str, file_path: Path):
        super().__init__(parent)
        
        self.page_name = page_name
        self.file_path = file_path
        self.content_cache = ''
        
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)
        
        self._create_widgets()
        self._load_page()
    
    def _create_widgets(self):
        """Create panel widgets"""
        self.header_frame = ctk.CTkFrame(self)
        self.header_frame.grid(row=0, column=0, sticky='ew', padx=10, pady=(10, 5))
        self.header_frame.grid_columnconfigure(0, weight=1)
        
        self.title_label = ctk.CTkLabel(
            self.header_frame,
            text=self.page_name,
            font=ctk.CTkFont(size=24, weight='bold')
        )
        self.title_label.grid(row=0, column=0, padx=10, pady=10, sticky='w')
        
        self.save_btn = ctk.CTkButton(
            self.header_frame,
            text='保存',
            command=self._save_page,
            width=120
        )
        self.save_btn.grid(row=0, column=1, padx=10, pady=10, sticky='e')
        
        self.editor_frame = ctk.CTkFrame(self)
        self.editor_frame.grid(row=1, column=0, sticky='nsew', padx=10, pady=5)
        self.editor_frame.grid_columnconfigure(0, weight=1)
        self.editor_frame.grid_rowconfigure(1, weight=1)
        
        ctk.CTkLabel(
            self.editor_frame,
            text='页面内容 (支持 Markdown)',
            font=ctk.CTkFont(size=14, weight='bold')
        ).grid(row=0, column=0, sticky='w', padx=10, pady=(10, 5))
        
        self.content_text = ctk.CTkTextbox(self.editor_frame, width=900, height=500)
        self.content_text.grid(row=1, column=0, sticky='nsew', padx=10, pady=5)
    
    def _load_page(self):
        """Load page asynchronously"""
        self.after(10, self._do_load)
    
    def _do_load(self):
        """Actually load page"""
        if not self.file_path.exists():
            self.content_text.insert('1.0', '# 页面不存在\n\n文件未找到。')
            return
        
        content = self.file_path.read_text(encoding='utf-8')
        self.content_text.delete('1.0', 'end')
        self.content_text.insert('1.0', content)
        self.content_cache = content
    
    def refresh(self):
        """Refresh page"""
        self.after(10, self._do_load)
    
    def _save_page(self):
        """Save page"""
        content = self.content_text.get('1.0', 'end-1c')
        
        if not content.strip():
            messagebox.showwarning('警告', '内容不能为空')
            return
        
        try:
            self.file_path.parent.mkdir(parents=True, exist_ok=True)
            self.file_path.write_text(content, encoding='utf-8')
            self.content_cache = content
            messagebox.showinfo('成功', f'{self.page_name}保存成功')
        except Exception as e:
            messagebox.showerror('错误', f'保存失败: {e}')
