"""Tag management panel"""

import customtkinter as ctk
from tkinter import messagebox
from collections import defaultdict

from app.services.post_service import PostService
from app.services.search_index_service import SearchIndexService


class TagPanel(ctk.CTkFrame):
    """Panel for managing tags across all posts"""
    
    def __init__(self, parent):
        super().__init__(parent)
        
        self.post_service = PostService()
        self.search_service = SearchIndexService()
        self.tag_posts = {}
        self.selected_tag = None
        
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)
        
        self._create_widgets()
        self._load_tags()
    
    def _create_widgets(self):
        """Create panel widgets"""
        self.header_frame = ctk.CTkFrame(self)
        self.header_frame.grid(row=0, column=0, sticky='ew', padx=10, pady=(10, 5))
        self.header_frame.grid_columnconfigure(0, weight=1)
        
        self.title_label = ctk.CTkLabel(
            self.header_frame,
            text='标签管理',
            font=ctk.CTkFont(size=24, weight='bold')
        )
        self.title_label.grid(row=0, column=0, padx=10, pady=10, sticky='w')
        
        self.rebuild_btn = ctk.CTkButton(
            self.header_frame,
            text='重建索引',
            command=self._rebuild_index,
            width=120
        )
        self.rebuild_btn.grid(row=0, column=1, padx=10, pady=10, sticky='e')
        
        # Main content - two columns
        self.content_frame = ctk.CTkFrame(self)
        self.content_frame.grid(row=1, column=0, sticky='nsew', padx=10, pady=5)
        self.content_frame.grid_columnconfigure(0, weight=1)
        self.content_frame.grid_columnconfigure(1, weight=2)
        self.content_frame.grid_rowconfigure(0, weight=1)
        
        # Left: Tag list
        self.tag_list_frame = ctk.CTkFrame(self.content_frame)
        self.tag_list_frame.grid(row=0, column=0, sticky='nsew', padx=(0, 5))
        self.tag_list_frame.grid_rowconfigure(1, weight=1)
        self.tag_list_frame.grid_columnconfigure(0, weight=1)
        
        ctk.CTkLabel(
            self.tag_list_frame,
            text='标签列表',
            font=ctk.CTkFont(size=16, weight='bold')
        ).grid(row=0, column=0, sticky='w', padx=10, pady=(10, 5))
        
        self.tag_scroll = ctk.CTkScrollableFrame(self.tag_list_frame)
        self.tag_scroll.grid(row=1, column=0, sticky='nsew', padx=10, pady=5)
        
        # Right: Post list for selected tag
        self.post_list_frame = ctk.CTkFrame(self.content_frame)
        self.post_list_frame.grid(row=0, column=1, sticky='nsew', padx=(5, 0))
        self.post_list_frame.grid_rowconfigure(1, weight=1)
        self.post_list_frame.grid_columnconfigure(0, weight=1)
        
        self.post_list_title = ctk.CTkLabel(
            self.post_list_frame,
            text='选择标签查看文章',
            font=ctk.CTkFont(size=16, weight='bold')
        )
        self.post_list_title.grid(row=0, column=0, sticky='w', padx=10, pady=(10, 5))
        
        self.post_scroll = ctk.CTkScrollableFrame(self.post_list_frame)
        self.post_scroll.grid(row=1, column=0, sticky='nsew', padx=10, pady=5)
    
    def _load_tags(self):
        """Load tags asynchronously"""
        self.after(10, self._do_load)
    
    def _do_load(self):
        """Actually load tags"""
        self.tag_posts = defaultdict(list)
        
        for post in self.post_service.get_all_posts():
            for tag in post.tags:
                self.tag_posts[tag].append(post)
        
        self._render_tags()
    
    def _render_tags(self):
        """Render tag list"""
        for widget in self.tag_scroll.winfo_children():
            widget.destroy()
        
        sorted_tags = sorted(self.tag_posts.keys(), key=lambda t: len(self.tag_posts[t]), reverse=True)
        
        for i, tag in enumerate(sorted_tags):
            count = len(self.tag_posts[tag])
            
            btn = ctk.CTkButton(
                self.tag_scroll,
                text=f'{tag} ({count})',
                command=lambda t=tag: self._select_tag(t),
                anchor='w'
            )
            btn.grid(row=i, column=0, sticky='ew', pady=2, padx=5)
    
    def _select_tag(self, tag: str):
        """Select a tag and show its posts"""
        self.selected_tag = tag
        self.post_list_title.configure(text=f'标签: {tag}')
        
        for widget in self.post_scroll.winfo_children():
            widget.destroy()
        
        posts = self.tag_posts[tag]
        for i, post in enumerate(posts):
            card = ctk.CTkFrame(self.post_scroll)
            card.grid_columnconfigure(0, weight=1)
            card.grid(row=i, column=0, sticky='ew', pady=3)
            
            info_frame = ctk.CTkFrame(card, fg_color='transparent')
            info_frame.grid(row=0, column=0, sticky='w', padx=10, pady=8)
            
            ctk.CTkLabel(
                info_frame,
                text=post.title,
                font=ctk.CTkFont(size=14, weight='bold'),
                anchor='w'
            ).pack(anchor='w')
            
            ctk.CTkLabel(
                info_frame,
                text=f'{post.date} | {post.category}',
                text_color='gray',
                font=ctk.CTkFont(size=11),
                anchor='w'
            ).pack(anchor='w')
            
            ctk.CTkButton(
                card, text='移除标签', width=80, height=30,
                command=lambda p=post, t=tag: self._remove_tag(p, t)
            ).grid(row=0, column=1, sticky='e', padx=10, pady=8)
    
    def _remove_tag(self, post, tag: str):
        """Remove tag from a post"""
        if tag in post.tags:
            post.tags.remove(tag)
            self.post_service.save_post(post)
            self._load_tags()
            messagebox.showinfo('成功', f'已从 "{post.title}" 移除标签 "{tag}"')
    
    def refresh(self):
        """Refresh tags"""
        self.after(10, self._do_load)
    
    def _rebuild_index(self):
        """Rebuild search index"""
        if self.search_service.generate_index():
            messagebox.showinfo('成功', '搜索索引重建成功')
        else:
            messagebox.showerror('错误', '搜索索引重建失败')
