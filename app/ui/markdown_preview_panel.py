"""Markdown preview panel with live rendering"""

import customtkinter as ctk
from tkinter import messagebox
import markdown2
from pathlib import Path


class MarkdownPreviewPanel(ctk.CTkFrame):
    """Panel for editing markdown with live preview"""
    
    def __init__(self, parent, title: str = 'Markdown 编辑器', file_path: Path = None):
        super().__init__(parent)
        
        self.page_title = title
        self.file_path = file_path
        self.preview_dirty = False
        
        self.grid_columnconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(1, weight=1)
        
        self._create_widgets()
        self._bind_events()
        
        if self.file_path:
            self._load_file()
    
    def _create_widgets(self):
        """Create panel widgets"""
        self.header_frame = ctk.CTkFrame(self)
        self.header_frame.grid(row=0, column=0, columnspan=2, sticky='ew', padx=10, pady=(10, 5))
        self.header_frame.grid_columnconfigure(0, weight=1)
        
        self.title_label = ctk.CTkLabel(
            self.header_frame,
            text=self.page_title,
            font=ctk.CTkFont(size=24, weight='bold')
        )
        self.title_label.grid(row=0, column=0, padx=10, pady=10, sticky='w')
        
        self.save_btn = ctk.CTkButton(
            self.header_frame,
            text='保存',
            command=self._save_file,
            width=120
        )
        self.save_btn.grid(row=0, column=1, padx=10, pady=10, sticky='e')
        
        # Editor panel
        self.editor_frame = ctk.CTkFrame(self)
        self.editor_frame.grid(row=1, column=0, sticky='nsew', padx=(10, 5), pady=5)
        self.editor_frame.grid_columnconfigure(0, weight=1)
        self.editor_frame.grid_rowconfigure(0, weight=1)
        
        ctk.CTkLabel(
            self.editor_frame,
            text='编辑',
            font=ctk.CTkFont(size=14, weight='bold')
        ).grid(row=0, column=0, sticky='w', padx=10, pady=(10, 5))
        
        self.editor_text = ctk.CTkTextbox(self.editor_frame, width=450, height=500)
        self.editor_text.grid(row=1, column=0, sticky='nsew', padx=10, pady=5)
        
        # Preview panel
        self.preview_frame = ctk.CTkFrame(self)
        self.preview_frame.grid(row=1, column=1, sticky='nsew', padx=(5, 10), pady=5)
        self.preview_frame.grid_columnconfigure(0, weight=1)
        self.preview_frame.grid_rowconfigure(0, weight=1)
        
        ctk.CTkLabel(
            self.preview_frame,
            text='预览',
            font=ctk.CTkFont(size=14, weight='bold')
        ).grid(row=0, column=0, sticky='w', padx=10, pady=(10, 5))
        
        self.preview_text = ctk.CTkTextbox(self.preview_frame, width=450, height=500, state='disabled')
        self.preview_text.grid(row=1, column=0, sticky='nsew', padx=10, pady=5)
    
    def _bind_events(self):
        """Bind editor events"""
        self.editor_text.bind('<KeyRelease>', self._on_editor_change)
    
    def _on_editor_change(self, event=None):
        """Update preview on editor change"""
        if not self.preview_dirty:
            self.preview_dirty = True
            self.after(500, self._update_preview)
    
    def _update_preview(self):
        """Render markdown to preview"""
        content = self.editor_text.get('1.0', 'end-1c')
        
        try:
            html = markdown2.markdown(content, extras=['fenced-code-blocks', 'tables', 'strike'])
            
            # Simple HTML to text conversion for preview
            preview_text = self._html_to_text(html)
            
            self.preview_text.configure(state='normal')
            self.preview_text.delete('1.0', 'end')
            self.preview_text.insert('1.0', preview_text)
            self.preview_text.configure(state='disabled')
        except Exception:
            pass
        
        self.preview_dirty = False
    
    def _html_to_text(self, html: str) -> str:
        """Convert HTML to plain text for preview"""
        import re
        
        text = html
        
        # Remove code blocks markers
        text = re.sub(r'<pre><code>(.*?)</code></pre>', r'\n[代码]\n\1\n[/代码]\n', text, flags=re.DOTALL)
        
        # Remove all other tags
        text = re.sub(r'<[^>]+>', '', text)
        
        # Decode common entities
        text = text.replace('&amp;', '&')
        text = text.replace('&lt;', '<')
        text = text.replace('&gt;', '>')
        text = text.replace('&quot;', '"')
        text = text.replace('&#39;', "'")
        text = text.replace('&nbsp;', ' ')
        
        return text.strip()
    
    def _load_file(self):
        """Load file asynchronously"""
        self.after(10, self._do_load)
    
    def _do_load(self):
        """Actually load file"""
        if not self.file_path or not self.file_path.exists():
            return
        
        content = self.file_path.read_text(encoding='utf-8')
        self.editor_text.delete('1.0', 'end')
        self.editor_text.insert('1.0', content)
        self._update_preview()
    
    def refresh(self):
        """Refresh"""
        self.after(10, self._do_load)
    
    def _save_file(self):
        """Save file"""
        if not self.file_path:
            messagebox.showwarning('警告', '未设置文件路径')
            return
        
        content = self.editor_text.get('1.0', 'end-1c')
        
        if not content.strip():
            messagebox.showwarning('警告', '内容不能为空')
            return
        
        try:
            self.file_path.parent.mkdir(parents=True, exist_ok=True)
            self.file_path.write_text(content, encoding='utf-8')
            messagebox.showinfo('成功', '保存成功')
        except Exception as e:
            messagebox.showerror('错误', f'保存失败: {e}')
