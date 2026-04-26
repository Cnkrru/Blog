"""Post editor dialog - Enhanced with Markdown toolbar and live preview"""

import customtkinter as ctk
from tkinter import messagebox
import threading
from typing import Optional

from app.models.post import Post
from app.config import config


class PostEditorDialog(ctk.CTkToplevel):
    """Dialog for editing post with Markdown toolbar and live preview"""
    
    def __init__(self, parent, post: Post = None, title: str = '编辑文章'):
        super().__init__(parent)
        
        self.result = None
        self.post = post or Post(id='', title='', date='')
        
        self.title(title)
        self.geometry('1100x700')
        self.minsize(800, 500)
        self.transient(parent)
        self.grab_set()
        
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(5, weight=1)
        
        self._preview_html = ''
        self._update_after_id = None
        
        self._create_widgets()
        self._load_data()
    
    def _create_widgets(self):
        """Create dialog widgets"""
        # Title
        ctk.CTkLabel(self, text='标题').grid(row=0, column=0, sticky='w', padx=20, pady=(15, 5))
        self.title_entry = ctk.CTkEntry(self)
        self.title_entry.grid(row=1, column=0, padx=20, pady=(0, 10), sticky='ew')
        
        # Category and tags row
        meta_frame = ctk.CTkFrame(self, fg_color='transparent')
        meta_frame.grid(row=2, column=0, sticky='ew', padx=20, pady=5)
        
        ctk.CTkLabel(meta_frame, text='分类').pack(side='left', padx=(0, 5))
        self.category_entry = ctk.CTkEntry(meta_frame, width=150)
        self.category_entry.pack(side='left', padx=(0, 20))
        
        ctk.CTkLabel(meta_frame, text='标签 (逗号分隔)').pack(side='left', padx=(0, 5))
        self.tags_entry = ctk.CTkEntry(meta_frame, width=300)
        self.tags_entry.pack(side='left')
        
        # Description
        ctk.CTkLabel(self, text='描述').grid(row=3, column=0, sticky='w', padx=20, pady=(10, 5))
        self.desc_entry = ctk.CTkEntry(self)
        self.desc_entry.grid(row=4, column=0, padx=20, pady=(0, 10), sticky='ew')
        
        # Editor frame with toolbar and content
        self.grid_rowconfigure(6, weight=1)
        
        editor_frame = ctk.CTkFrame(self)
        editor_frame.grid(row=5, column=0, padx=20, pady=(10, 10), sticky='nsew')
        editor_frame.grid_columnconfigure(0, weight=1)
        editor_frame.grid_rowconfigure(1, weight=1)
        
        # Toolbar
        self._create_toolbar(editor_frame)
        
        # Content editor
        self.content_text = ctk.CTkTextbox(editor_frame)
        self.content_text.grid(row=1, column=0, sticky='nsew', padx=5, pady=5)
        self.content_text.configure(font=('Consolas', 13))
        self.content_text.bind('<KeyRelease>', self._on_content_change)
        self.content_text.bind('<Tab>', self._insert_tab)
        
        # Preview frame
        preview_frame = ctk.CTkFrame(self)
        preview_frame.grid(row=5, column=1, padx=(0, 20), pady=(10, 10), sticky='nsew')
        preview_frame.grid_columnconfigure(0, weight=1)
        preview_frame.grid_rowconfigure(1, weight=1)
        
        self.grid_columnconfigure(1, weight=1)
        
        ctk.CTkLabel(
            preview_frame, text='预览', font=ctk.CTkFont(size=14, weight='bold')
        ).grid(row=0, column=0, sticky='w', padx=10, pady=(5, 0))
        
        self.preview_text = ctk.CTkTextbox(preview_frame, state='disabled')
        self.preview_text.grid(row=1, column=0, sticky='nsew', padx=5, pady=5)
        self.preview_text.configure(font=('Microsoft YaHei', 12))
        
        # Keywords
        ctk.CTkLabel(self, text='关键词').grid(row=7, column=0, sticky='w', padx=20, pady=(5, 5))
        self.keywords_entry = ctk.CTkEntry(self)
        self.keywords_entry.grid(row=8, column=0, padx=20, pady=(0, 10), sticky='ew')
        
        # Buttons
        btn_frame = ctk.CTkFrame(self, fg_color='transparent')
        btn_frame.grid(row=9, column=0, sticky='e', padx=20, pady=(0, 15))
        
        ctk.CTkButton(
            btn_frame, text='取消', command=self.destroy, width=100
        ).pack(side='left', padx=5)
        
        ctk.CTkButton(
            btn_frame, text='保存', command=self._save, width=100
        ).pack(side='left', padx=5)
    
    def _create_toolbar(self, parent):
        """Create Markdown formatting toolbar"""
        toolbar = ctk.CTkFrame(parent, fg_color='transparent')
        toolbar.grid(row=0, column=0, sticky='ew', padx=5, pady=(5, 2))
        
        buttons = [
            ('B', '加粗', self._insert_bold, 30),
            ('I', '斜体', self._insert_italic, 30),
            ('H1', '一级标题', lambda: self._insert_heading(1), 35),
            ('H2', '二级标题', lambda: self._insert_heading(2), 35),
            ('H3', '三级标题', lambda: self._insert_heading(3), 35),
            ('•', '无序列表', self._insert_ulist, 30),
            ('1.', '有序列表', self._insert_olist, 35),
            ('<>', '代码块', self._insert_code, 35),
            ('`', '行内代码', self._insert_inline_code, 30),
            ('🔗', '链接', self._insert_link, 35),
            ('🖼', '图片', self._insert_image, 35),
            ('---', '分割线', self._insert_hr, 40),
            ('>', '引用', self._insert_quote, 30),
        ]
        
        for text, tooltip, cmd, width in buttons:
            btn = ctk.CTkButton(
                toolbar, text=text, command=cmd, width=width, height=28,
                font=ctk.CTkFont(size=12, weight='bold'),
                fg_color=('#3B8ED0' if ctk.get_appearance_mode() == 'Dark' else '#E8E8E8'),
                hover_color=('#1F6AA5' if ctk.get_appearance_mode() == 'Dark' else '#D0D0D0')
            )
            btn.pack(side='left', padx=2)
    
    def _get_selection(self) -> tuple[str, str, str]:
        """Get selected text from content textbox"""
        try:
            sel_start = self.content_text.index('sel.first')
            sel_end = self.content_text.index('sel.last')
            selected = self.content_text.get(sel_start, sel_end)
            return sel_start, sel_end, selected
        except:
            # No selection, get current cursor position
            cursor = self.content_text.index('insert')
            return cursor, cursor, ''
    
    def _wrap_selection(self, prefix: str, suffix: str = None):
        """Wrap selected text with prefix and suffix"""
        if suffix is None:
            suffix = prefix
        
        sel_start, sel_end, selected = self._get_selection()
        
        self.content_text.delete(sel_start, sel_end)
        self.content_text.insert(sel_start, prefix + selected + suffix)
        self.content_text.mark_set('insert', sel_start)
        self.content_text.focus()
    
    def _insert_at_line_start(self, prefix: str):
        """Insert prefix at the start of current line"""
        cursor = self.content_text.index('insert')
        line_num = cursor.split('.')[0]
        line_start = f'{line_num}.0'
        
        self.content_text.insert(line_start, prefix)
        self.content_text.focus()
    
    def _insert_bold(self):
        self._wrap_selection('**', '**')
    
    def _insert_italic(self):
        self._wrap_selection('*', '*')
    
    def _insert_heading(self, level: int):
        prefix = '#' * level + ' '
        self._insert_at_line_start(prefix)
    
    def _insert_ulist(self):
        self._insert_at_line_start('- ')
    
    def _insert_olist(self):
        self._insert_at_line_start('1. ')
    
    def _insert_code(self):
        self._wrap_selection('\n```\n', '\n```\n')
    
    def _insert_inline_code(self):
        self._wrap_selection('`', '`')
    
    def _insert_link(self):
        sel_start, sel_end, selected = self._get_selection()
        if selected:
            self.content_text.insert(sel_end, f']({selected})')
            self.content_text.insert(sel_start, '[')
        else:
            self._wrap_selection('[', '](url)')
    
    def _insert_image(self):
        sel_start, sel_end, selected = self._get_selection()
        if selected:
            self.content_text.insert(sel_end, f']({selected})')
            self.content_text.insert(sel_start, '![')
        else:
            self._wrap_selection('![', '](image_url)')
    
    def _insert_hr(self):
        self.content_text.insert('insert', '\n---\n')
        self.content_text.focus()
    
    def _insert_quote(self):
        self._insert_at_line_start('> ')
    
    def _insert_tab(self, event):
        """Handle tab key - insert 2 spaces"""
        self.content_text.insert('insert', '  ')
        return 'break'
    
    def _on_content_change(self, event=None):
        """Trigger preview update with debounce"""
        if self._update_after_id:
            self.after_cancel(self._update_after_id)
        self._update_after_id = self.after(500, self._update_preview)
    
    def _update_preview(self):
        """Update preview with rendered Markdown"""
        self._update_after_id = None
        content = self.content_text.get('1.0', 'end-1c')
        
        if not content.strip():
            self.preview_text.configure(state='normal')
            self.preview_text.delete('1.0', 'end')
            self.preview_text.insert('1.0', '预览区域 - 开始写作吧...')
            self.preview_text.configure(state='disabled')
            return
        
        try:
            import markdown
            html = markdown.markdown(
                content,
                extensions=['tables', 'fenced_code', 'toc', 'nl2br']
            )
            
            self.preview_text.configure(state='normal')
            self.preview_text.delete('1.0', 'end')
            self.preview_text.insert('1.0', html)
            self.preview_text.configure(state='disabled')
        except Exception as e:
            pass
    
    def _load_data(self):
        """Load post data into form"""
        self.title_entry.insert(0, self.post.title)
        self.category_entry.insert(0, self.post.category)
        self.tags_entry.insert(0, ', '.join(self.post.tags))
        self.desc_entry.insert(0, self.post.description)
        self.content_text.insert('1.0', self.post.content)
        self.keywords_entry.insert(0, self.post.keywords)
        
        # Initial preview
        self.after(100, self._update_preview)
    
    def _save(self):
        """Save post data"""
        title = self.title_entry.get().strip()
        if not title:
            messagebox.showwarning('警告', '标题不能为空')
            return
        
        self.result = Post(
            id=self.post.id,
            title=title,
            date=self.post.date,
            category=self.category_entry.get().strip(),
            tags=[t.strip() for t in self.tags_entry.get().split(',') if t.strip()],
            description=self.desc_entry.get().strip(),
            keywords=self.keywords_entry.get().strip(),
            content=self.content_text.get('1.0', 'end-1c')
        )
        
        self.destroy()
